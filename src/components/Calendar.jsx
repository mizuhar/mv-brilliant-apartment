import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import styles from "./Calendar.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

const AvailabilityCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        const datesSet = new Set();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.checkIn && data.checkOut) {
            // Преобразуване на Firestore Timestamp / String към Date обект
            let start = data.checkIn?.toDate ? data.checkIn.toDate() : new Date(data.checkIn);
            let end = data.checkOut?.toDate ? data.checkOut.toDate() : new Date(data.checkOut);

            // Нормализираме часовете
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            // Добавяме нощувките (без самия ден на checkOut)
            let current = new Date(start);
            while (current < end) {
              datesSet.add(current.toDateString());
              current.setDate(current.getDate() + 1);
            }
          }
        });

        setBookedDates(datesSet);
      } catch (err) {
        console.error("Грешка при зареждане на заетостта:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Проверка дали даден ден е зает или отминал
  const isTileDisabled = ({ date, view }) => {
    if (view === "month") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Блокираме минали дати
      if (date < today) return true;

      // Блокираме резервирани дати
      return bookedDates.has(date.toDateString());
    }
    return false;
  };

  // Персонализиран стил за заетите дати
  const tileClassName = ({ date, view }) => {
    if (view === "month" && bookedDates.has(date.toDateString())) {
      return "bg-red-500 text-white rounded-full cursor-not-allowed";
    }
    return null;
  };

  return (
    <section className={styles.sectionContainer} id="calendar">
      <div className="max-w-4xl mx-auto">
        <h2 className={styles.heading}>Календар за заетост</h2>
        <p className={styles.subheading}>
          Проверете свободните дати за вашия престой в MV Brilliant Apartment.
        </p>

        {loading ? (
          <div className="text-gray-500">Зареждане на датите...</div>
        ) : (
          <div className={styles.calendarWrapper}>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileDisabled={isTileDisabled}
              tileClassName={tileClassName}
              minDate={new Date()}
            />
          </div>
        )}

        {/* Легенда */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.dotFree}></span>
            <span>Свободно</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.dotBooked}></span>
            <span>Заето</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityCalendar;