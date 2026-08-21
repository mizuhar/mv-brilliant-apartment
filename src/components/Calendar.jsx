import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import styles from "./Calendar.module.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { syncBookingCalendar } from "../services/syncBooking.js";

const AvailabilityCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const calendarDocRef = doc(db, "calendar", "blocked_dates");
        let calendarDocSnap = await getDoc(calendarDocRef);

        // Ако още няма запис във Firestore, правим първоначална синхронизация
        if (!calendarDocSnap.exists()) {
          await syncBookingCalendar();
          calendarDocSnap = await getDoc(calendarDocRef);
        }

        const datesSet = new Set();

        if (calendarDocSnap.exists()) {
          const data = calendarDocSnap.data();
          if (data.dates && Array.isArray(data.dates)) {
            data.dates.forEach((dateStr) => {
              const [year, month, day] = dateStr.split("-").map(Number);
              const localDate = new Date(year, month - 1, day);
              datesSet.add(localDate.toDateString());
            });
          }
        }

        setBookedDates(datesSet);
      } catch (err) {
        console.error("Грешка при зареждане на заетостта:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const isTileDisabled = ({ date, view }) => {
    if (view === "month") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (date < today) return true;
      return bookedDates.has(date.toDateString());
    }
    return false;
  };

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