import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import styles from "./AdminCalendar.module.css"; // Твоят CSS модул
import {
  toggleManualBlockDate,
  syncBookingCalendar,
} from "../services/syncBooking.js";

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [manualDates, setManualDates] = useState([]);
  const [bookingDates, setBookingDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const loadDates = async () => {
    setLoading(true);
    try {
      // 1. Първо синхронизираме с Booking, за да имаме най-новите резервации
      await syncBookingCalendar();

      // 2. След това дърпаме обновените данни от Firestore
      const calendarDocRef = doc(db, "calendar", "blocked_dates");
      const calendarDocSnap = await getDoc(calendarDocRef);

      if (calendarDocSnap.exists()) {
        const data = calendarDocSnap.data();
        setManualDates(data.manualDates || []);
        setBookingDates(data.dates || []);
      }
    } catch (err) {
      console.error("Грешка при зареждане на календара в админа:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDates();
  }, []);

  const handleToggleBlock = async () => {
    const dateStr = formatDateToYYYYMMDD(selectedDate);
    const updated = await toggleManualBlockDate(dateStr);
    setManualDates(updated || []);
  };

  const handleRemoveDate = async (dateStr) => {
    const updated = await toggleManualBlockDate(dateStr);
    setManualDates(updated || []);
  };

 // Цветово маркиране на дните в Админ календара
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = formatDateToYYYYMMDD(date);

      // 1. Ръчно блокирани от теб -> СИВО
      if (manualDates.includes(dateStr)) {
        return "manual-blocked";
      }

      // 2. Автоматично от Booking -> ЧЕРВЕНО
      if (bookingDates.includes(dateStr)) {
        return "booking-blocked";
      }
    }
    return null;
  };

  const selectedDateStr = formatDateToYYYYMMDD(selectedDate);
  const isSelectedManualBlocked = manualDates.includes(selectedDateStr);
  const isSelectedBookingBlocked = bookingDates.includes(selectedDateStr);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto my-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span>📅</span> Управление на заетост & Ръчно блокиране
      </h2>

      {loading ? (
        <div className="text-gray-400 py-6 text-center">
          Синхронизиране с Booking и зареждане...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Лява колона - Календар & Управление */}
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-center mb-4">
              <div className={styles.calendarWrapper}>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={tileClassName}
                  minDate={new Date()}
                />
              </div>
            </div>

            {/* Легенда за цветовете */}
            <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span>Booking.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gray-600 inline-block"></span>
                <span>Ръчно блокирани</span>
              </div>
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-sm font-medium text-gray-600 mb-3 text-center">
                Избрана дата:{" "}
                <strong className="text-gray-900">{selectedDateStr}</strong>
              </p>

              {isSelectedBookingBlocked ? (
                <div className="text-xs text-red-600 font-medium text-center bg-red-50 py-2.5 px-3 rounded-lg border border-red-100">
                  Заето през Booking.com
                </div>
              ) : (
                <button
                  onClick={handleToggleBlock}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium transition shadow-sm ${
                    isSelectedManualBlocked
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gray-800 hover:bg-gray-900 text-white"
                  }`}
                >
                  {isSelectedManualBlocked
                    ? "🔓 Отблокирай датата"
                    : "🔒 Блокирай датата в сиво"}
                </button>
              )}
            </div>
          </div>

          {/* Дясна колона - Списък с блокирани дати */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 h-full">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex justify-between items-center">
              <span>Ръчно блокирани дати</span>
              <span className="bg-gray-200 text-gray-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {manualDates.length}
              </span>
            </h3>

            {manualDates.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">
                Няма ръчно блокирани дати.
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {manualDates.sort().map((dateStr) => (
                  <div
                    key={dateStr}
                    className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 shadow-sm"
                  >
                    <span>{dateStr}</span>
                    <button
                      onClick={() => handleRemoveDate(dateStr)}
                      className="text-gray-400 hover:text-red-500 transition px-1.5 py-0.5 rounded"
                      title="Премахни"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
