import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

export async function syncBookingCalendar() {
  const rawUrl = import.meta.env.VITE_BOOKING_ICAL_URL;

  if (!rawUrl) {
    console.error('Липсва VITE_BOOKING_ICAL_URL в .env файла');
    return { success: false, error: 'Missing iCal URL' };
  }

  try {
    // Използваме нашата собствена Vercel сървърна функция за заобикаляне на CORS
    const proxyUrl = `/api/fetch-ical?url=${encodeURIComponent(rawUrl)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`HTTP грешка! статус: ${response.status}`);
    }

    const icsText = await response.text();

    if (!icsText || !icsText.includes('BEGIN:VCALENDAR')) {
      throw new Error('Невалиден или празен iCal формат');
    }

    const blockedDates = [];
    const eventRegex = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
    let match;

    console.log('--- ЗАПОЧВА АНАЛИЗ НА BOOKING ICAL СЪБИТИЯТА ---');

    while ((match = eventRegex.exec(icsText)) !== null) {
      const eventContent = match[1];

      // Игнорираме отменени резервации (STATUS:CANCELLED)
      if (/STATUS:CANCELLED/i.test(eventContent)) {
        console.log('Пропусната отменена резервация (CANCELLED)');
        continue;
      }

      const startMatch = eventContent.match(/DTSTART(?:;VALUE=DATE)?:?(\d{8})/);
      const endMatch = eventContent.match(/DTEND(?:;VALUE=DATE)?:?(\d{8})/);

      if (startMatch && endMatch) {
        const startStr = startMatch[1];
        const endStr = endMatch[1];

        let year = parseInt(startStr.substring(0, 4));
        let month = parseInt(startStr.substring(4, 6)) - 1;
        let day = parseInt(startStr.substring(6, 8));

        let current = new Date(Date.UTC(year, month, day));

        let endYear = parseInt(endStr.substring(0, 4));
        let endMonth = parseInt(endStr.substring(4, 6)) - 1;
        let endDay = parseInt(endStr.substring(6, 8));

        let lastDay = new Date(Date.UTC(endYear, endMonth, endDay));

        if (current.getTime() === lastDay.getTime()) {
          lastDay.setDate(lastDay.getDate() + 1);
        }

        while (current < lastDay) {
          const y = current.getUTCFullYear();
          const m = String(current.getUTCMonth() + 1).padStart(2, '0');
          const d = String(current.getUTCDate()).padStart(2, '0');

          const formattedDate = `${y}-${m}-${d}`;

          if (!blockedDates.includes(formattedDate)) {
            blockedDates.push(formattedDate);
          }

          current.setUTCDate(current.getUTCDate() + 1);
        }
      }
    }

    console.log('--- ОБЩО БЛОКИРАНИ ДНИ ОТ BOOKING:', blockedDates.length, '---');

    const calendarRef = doc(db, 'calendar', 'blocked_dates');
    const calendarSnap = await getDoc(calendarRef);

    let existingManualDates = [];
    if (calendarSnap.exists() && calendarSnap.data().manualDates) {
      existingManualDates = calendarSnap.data().manualDates;
    }

    await setDoc(calendarRef, {
      dates: blockedDates,
      manualDates: existingManualDates,
      lastSynced: new Date().toISOString(),
    });

    return { success: true, count: blockedDates.length };
  } catch (error) {
    console.error('iCal Sync Error:', error);
    return { success: false, error: error.message };
  }
}
export async function toggleManualBlockDate(dateStr) {
  const calendarRef = doc(db, 'calendar', 'blocked_dates');
  const calendarSnap = await getDoc(calendarRef);

  if (calendarSnap.exists()) {
    const currentManualDates = calendarSnap.data().manualDates || [];
    let updatedDates;

    if (currentManualDates.includes(dateStr)) {
      // Премахване от ръчно блокираните
      updatedDates = currentManualDates.filter((d) => d !== dateStr);
    } else {
      // Добавяне към ръчно блокираните
      updatedDates = [...currentManualDates, dateStr];
    }

    await updateDoc(calendarRef, {
      manualDates: updatedDates
    });

    return updatedDates;
  }
}