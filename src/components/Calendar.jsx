import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import styles from "./Calendar.module.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { syncBookingCalendar } from "../services/syncBooking.js";
import { useLanguage } from "../App.jsx";

const AvailabilityCalendar = () => {
  const { lang } = useLanguage();

  const translations = {
    bg: {
      heading: "Календар за заетост",
      subheading: "Проверете свободните дати за вашия престой в MV Brilliant Apartment.",
      loading: "Зареждане и синхронизиране на датите...",
      free: "Свободно",
      booked: "Заето",
      locale: "bg-BG"
    },
    en: {
      heading: "Availability Calendar",
      subheading: "Check available dates for your stay at MV Brilliant Apartment.",
      loading: "Loading and synchronizing dates...",
      free: "Available",
      booked: "Booked",
      locale: "en-US"
    },
    de: {
      heading: "Belegungskalender",
      subheading: "Überprüfen Sie die verfügbaren Termine für Ihren Aufenthalt im MV Brilliant Apartment.",
      loading: "Daten werden geladen und synchronisiert...",
      free: "Frei",
      booked: "Belegt",
      locale: "de-DE"
    }
  };

  const t = translations[lang] || translations.bg;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Хелпър функция за форматиране на дата в YYYY-MM-DD
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // 1. Синхронизираме с Booking
        await syncBookingCalendar();

        // 2. Вземаме обновените дати от Firestore
        const calendarDocRef = doc(db, "calendar", "blocked_dates");
        const calendarDocSnap = await getDoc(calendarDocRef);

        const datesSet = new Set();

        if (calendarDocSnap.exists()) {
          const data = calendarDocSnap.data();

          // 1. Автоматични от Booking
          if (data.dates && Array.isArray(data.dates)) {
            data.dates.forEach((dateStr) => datesSet.add(dateStr));
          }

          // 2. Ръчно блокирани дати
          if (data.manualDates && Array.isArray(data.manualDates)) {
            data.manualDates.forEach((dateStr) => datesSet.add(dateStr));
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

      const dateStr = formatDateToYYYYMMDD(date);
      return bookedDates.has(dateStr);
    }
    return false;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = formatDateToYYYYMMDD(date);
      if (bookedDates.has(dateStr)) {
        return "booking-blocked";
      }
    }
    return null;
  };

  return (
    <section className={styles.sectionContainer} id="calendar">
      <div className="max-w-4xl mx-auto">
        <h2 className={styles.heading}>{t.heading}</h2>
        <p className={styles.subheading}>{t.subheading}</p>

        {loading ? (
          <div className="text-gray-500 text-center py-8">
            {t.loading}
          </div>
        ) : (
          <div className={styles.calendarWrapper}>
            <Calendar
              locale={t.locale}
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
            <span>{t.free}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.dotBooked}></span>
            <span>{t.booked}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityCalendar;