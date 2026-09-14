import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  User,
  Send,
  CheckCircle,
  Loader2,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useLanguage } from "../App.jsx";
import styles from "./Booking.module.css";

export default function Booking() {
  const { lang } = useLanguage();

  const translations = {
    bg: {
      headerTitle: "Резервация & Запитване",
      headerDesc: "Изпратете запитване за желаните от вас дати и ние ще се свържем с вас възможно най-скоро",
      directContact: "Директен контакт",
      contactDesc: "Предпочитате бърз разговор или съобщение? Свържете се с нас директно:",
      phoneLabel: "Телефон",
      emailLabel: "Имейл",
      directBookingNoteTitle: "Директна резервация:",
      directBookingNoteText: "При резервация през сайта спестявате комисионни такси от платформи за нощувки!",
      successTitle: "Благодарим ви за запитването!",
      successDesc: "Ще се свържем с вас в най-кратък срок, за да потвърдим наличността за избраните дати.",
      newRequestBtn: "Ново запитване",
      basePriceLabel: "Базова цена:",
      perNight: "/ нощувка",
      basePriceNote: "* Цената е за до 2 гости. Изберете дати за изчисляване на крайната сума и отстъпки.",
      nameLabel: "Вашето име",
      namePlaceholder: "Иван Иванов",
      emailInputLabel: "Имейл",
      phoneInputLabel: "Телефон",
      checkInLabel: "Настаняване",
      checkOutLabel: "Напускане",
      minNightsNote: "Минималният престой за резервация е",
      nightsWord: "нощувки.",
      guestsLabel: "Брой гости",
      guestSingular: "гост",
      guestPlural: "гости",
      rateLabel: "Изберете тарифа",
      standardRate: "Стандартна тарифа",
      standardRateDesc: "Възможност за безплатна анулация",
      nonRefundableRate: "Без право на анулация",
      nonRefundableRateDesc: "Спестявате",
      nonRefundableRateDescEnd: "% от сумата, без право на възстановяване",
      summaryStay: "Престой:",
      summaryNights: "нощувки",
      summaryGuests: "Гости:",
      summaryTotal: "Обща сума:",
      messageLabel: "Допълнителна информация / въпроси",
      messagePlaceholder: "Например: час на пристигане, нужда от детско креватче...",
      submitBtn: "Изпрати запитването",
      sending: "Изпращане...",
      errDate: "Датата на напускане трябва да е след настаняването.",
      errMinNights: "Минималният престой за избрания период е {minNights} нощувки.",
      errGeneric: "Възникна грешка при изпращането. Моля, опитайте отново.",
      discMonthly: "Месечна отстъпка",
      discWeekly: "Седмична отстъпка",
      discLastMinute: "Last-Minute оферта",
      discEarlyBird: "Early-Bird (Ранно запитване)",
      discNonRefundable: "Невъзвръщаема тарифа"
    },
    en: {
      headerTitle: "Booking & Inquiry",
      headerDesc: "Send an inquiry for your preferred dates and we will contact you as soon as possible",
      directContact: "Direct Contact",
      contactDesc: "Prefer a quick chat or message? Get in touch with us directly:",
      phoneLabel: "Phone",
      emailLabel: "Email",
      directBookingNoteTitle: "Direct Booking:",
      directBookingNoteText: "Booking directly through our website saves you third-party commission fees!",
      successTitle: "Thank you for your inquiry!",
      successDesc: "We will reach out to you shortly to confirm availability for your selected dates.",
      newRequestBtn: "New Inquiry",
      basePriceLabel: "Base price:",
      perNight: "/ night",
      basePriceNote: "* Price is for up to 2 guests. Select dates to calculate total cost and discounts.",
      nameLabel: "Your Name",
      namePlaceholder: "John Doe",
      emailInputLabel: "Email",
      phoneInputLabel: "Phone",
      checkInLabel: "Check-in",
      checkOutLabel: "Check-out",
      minNightsNote: "Minimum stay required is",
      nightsWord: "nights.",
      guestsLabel: "Number of guests",
      guestSingular: "guest",
      guestPlural: "guests",
      rateLabel: "Select Rate",
      standardRate: "Standard Rate",
      standardRateDesc: "Free cancellation options available",
      nonRefundableRate: "Non-refundable Rate",
      nonRefundableRateDesc: "Save",
      nonRefundableRateDescEnd: "% off total price, non-refundable",
      summaryStay: "Stay:",
      summaryNights: "nights",
      summaryGuests: "Guests:",
      summaryTotal: "Total Amount:",
      messageLabel: "Additional Information / Questions",
      messagePlaceholder: "E.g., estimated arrival time, baby cot request...",
      submitBtn: "Send Inquiry",
      sending: "Sending...",
      errDate: "Check-out date must be after check-in date.",
      errMinNights: "Minimum stay for the selected period is {minNights} nights.",
      errGeneric: "An error occurred while sending. Please try again.",
      discMonthly: "Monthly Discount",
      discWeekly: "Weekly Discount",
      discLastMinute: "Last-Minute Offer",
      discEarlyBird: "Early-Bird Special",
      discNonRefundable: "Non-refundable Discount"
    },
    de: {
      headerTitle: "Buchung & Anfrage",
      headerDesc: "Senden Sie eine Anfrage für Ihre Wunschdaten und wir melden uns schnellstmöglich bei Ihnen",
      directContact: "Direkter Kontakt",
      contactDesc: "Bevorzugen Sie ein kurzes Gespräch oder eine Nachricht? Kontaktieren Sie uns direkt:",
      phoneLabel: "Telefon",
      emailLabel: "E-Mail",
      directBookingNoteTitle: "Direktbuchung:",
      directBookingNoteText: "Bei einer Buchung über unsere Website sparen Sie Gebühren von Drittanbietern!",
      successTitle: "Vielen Dank für Ihre Anfrage!",
      successDesc: "Wir werden uns Kürze bei Ihnen melden, um die Verfügbarkeit zu bestätigen.",
      newRequestBtn: "Neue Anfrage",
      basePriceLabel: "Basispreis:",
      perNight: "/ Nacht",
      basePriceNote: "* Der Preis gilt für bis zu 2 Gäste. Wählen Sie Daten für Gesamtsumme & Rabatte.",
      nameLabel: "Ihr Name",
      namePlaceholder: "Max Mustermann",
      emailInputLabel: "E-Mail",
      phoneInputLabel: "Telefon",
      checkInLabel: "Anreise",
      checkOutLabel: "Abreise",
      minNightsNote: "Der Mindestaufenthalt beträgt",
      nightsWord: "Nächte.",
      guestsLabel: "Anzahl der Gäste",
      guestSingular: "Gast",
      guestPlural: "Gäste",
      rateLabel: "Tarif Auswählen",
      standardRate: "Standardtarif",
      standardRateDesc: "Kostenlose Stornierungsoption",
      nonRefundableRate: "Nicht erstattungsfähig",
      nonRefundableRateDesc: "Sie sparen",
      nonRefundableRateDescEnd: "% auf den Gesamtpreis, nicht erstattungsfähig",
      summaryStay: "Aufenthalt:",
      summaryNights: "Nächte",
      summaryGuests: "Gäste:",
      summaryTotal: "Gesamtsumme:",
      messageLabel: "Zusätzliche Informationen / Fragen",
      messagePlaceholder: "Z.B. voraussichtliche Ankunftszeit, Babybett erwünscht...",
      submitBtn: "Anfrage Senden",
      sending: "Wird gesendet...",
      errDate: "Das Abreisedatum muss nach dem Anreisedatum liegen.",
      errMinNights: "Mindestaufenthalt für diesen Zeitraum beträgt {minNights} Nächte.",
      errGeneric: "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      discMonthly: "Monatsrabatt",
      discWeekly: "Wochenrabatt",
      discLastMinute: "Last-Minute Angebot",
      discEarlyBird: "Frühbucherrabatt",
      discNonRefundable: "Nicht erstattungsfähiger Rabatt"
    }
  };

  const t = translations[lang] || translations.bg;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    rateType: "standard",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [pricingConfig, setPricingConfig] = useState({
    basePrice: 100,
    extraGuestPercent: 0.15,
    nonRefundableDiscount: 0.1,
    weeklyDiscount: 0.1,
    monthlyDiscount: 0.25,
    lastMinuteDiscount: 0.1,
    earlyBirdDiscount: 0.1,
    minNights: 2,
    seasons: [],
  });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const pricingDocRef = doc(db, "settings", "pricing");
        const pricingSnap = await getDoc(pricingDocRef);

        if (pricingSnap.exists()) {
          const data = pricingSnap.data();
          setPricingConfig({
            basePrice: Number(data.basePrice) || 100,
            extraGuestPercent: Number(data.extraGuestPercent) ?? 0.15,
            nonRefundableDiscount: Number(data.nonRefundableDiscount) ?? 0.1,
            weeklyDiscount: Number(data.weeklyDiscount) ?? 0.1,
            monthlyDiscount: Number(data.monthlyDiscount) ?? 0.25,
            lastMinuteDiscount: Number(data.lastMinuteDiscount) ?? 0.1,
            earlyBirdDiscount: Number(data.earlyBirdDiscount) ?? 0.1,
            minNights: Number(data.minNights) || 2,
            seasons: Array.isArray(data.seasons) ? data.seasons : [],
          });
        }
      } catch (err) {
        console.error("Грешка при зареждане на ценовата конфигурация:", err);
      }
    };

    fetchPricing();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const priceCalculation = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return null;

    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffTime = end.getTime() - start.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return { error: t.errDate };
    }

    const basePrice = Number(pricingConfig?.basePrice) || 100;
    const extraGuestPercent = Number(pricingConfig?.extraGuestPercent) ?? 0.15;
    let maxMinNightsRequired = Number(pricingConfig?.minNights) || 2;

    const guestsCount = Number(formData.guests) || 2;
    const extraGuests = guestsCount > 2 ? guestsCount - 2 : 0;

    const formatDateLocal = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    let rawTotal = 0;
    const currentDate = new Date(start.getTime());
    const seasonsList = Array.isArray(pricingConfig?.seasons)
      ? pricingConfig.seasons
      : [];

    for (let i = 0; i < nights; i++) {
      const dateString = formatDateLocal(currentDate);

      const activeSeason = seasonsList.find((season) => {
        return (
          season?.startDate &&
          season?.endDate &&
          dateString >= season.startDate &&
          dateString <= season.endDate
        );
      });

      const dayBasePrice =
        activeSeason && !isNaN(Number(activeSeason.price))
          ? Number(activeSeason.price)
          : basePrice;

      if (
        activeSeason &&
        !isNaN(Number(activeSeason.minNights)) &&
        Number(activeSeason.minNights) > maxMinNightsRequired
      ) {
        maxMinNightsRequired = Number(activeSeason.minNights);
      }

      const dayPrice =
        dayBasePrice + dayBasePrice * (extraGuests * extraGuestPercent);
      rawTotal += dayPrice;

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (nights < maxMinNightsRequired) {
      return {
        error: t.errMinNights.replace("{minNights}", maxMinNightsRequired),
      };
    }

    let total = rawTotal;
    const discountsList = [];

    const monthlyDisc = Number(pricingConfig?.monthlyDiscount) ?? 0.25;
    const weeklyDisc = Number(pricingConfig?.weeklyDiscount) ?? 0.1;

    if (nights >= 28 && monthlyDisc > 0) {
      total *= 1 - monthlyDisc;
      discountsList.push({
        label: t.discMonthly,
        percent: Math.round(monthlyDisc * 100),
      });
    } else if (nights >= 7 && weeklyDisc > 0) {
      total *= 1 - weeklyDisc;
      discountsList.push({
        label: t.discWeekly,
        percent: Math.round(weeklyDisc * 100),
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysUntilCheckIn = Math.ceil(
      (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const lastMinuteDisc =
      pricingConfig?.lastMinuteDiscount !== undefined
        ? Number(pricingConfig.lastMinuteDiscount)
        : 0.1;

    const earlyBirdDisc =
      pricingConfig?.earlyBirdDiscount !== undefined
        ? Number(pricingConfig.earlyBirdDiscount)
        : 0.1;

    if (daysUntilCheckIn >= 0 && daysUntilCheckIn <= 3 && lastMinuteDisc > 0) {
      total *= 1 - lastMinuteDisc;
      discountsList.push({
        label: t.discLastMinute,
        percent: Math.round(lastMinuteDisc * 100),
      });
    } else if (daysUntilCheckIn >= 60 && earlyBirdDisc > 0) {
      total *= 1 - earlyBirdDisc;
      discountsList.push({
        label: t.discEarlyBird,
        percent: Math.round(earlyBirdDisc * 100),
      });
    }

    const nonRefundableDisc =
      Number(pricingConfig?.nonRefundableDiscount) ?? 0.1;

    if (formData.rateType === "nonRefundable" && nonRefundableDisc > 0) {
      total *= 1 - nonRefundableDisc;
      discountsList.push({
        label: t.discNonRefundable,
        percent: Math.round(nonRefundableDisc * 100),
      });
    }

    return {
      nights,
      rawTotal: Math.round(rawTotal),
      totalPrice: Math.round(total),
      discountsList,
      minNightsRequired: maxMinNightsRequired,
    };
  }, [
    formData.checkIn,
    formData.checkOut,
    formData.guests,
    formData.rateType,
    pricingConfig,
    t,
  ]);

  const sendTelegramNotification = async (data, calc) => {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) return;

    const rateName =
      data.rateType === "nonRefundable"
        ? `🔒 Без право на анулация (-${Math.round(pricingConfig.nonRefundableDiscount * 100)}%)`
        : "🟢 Стандартна (С право на анулация)";

    const message = `
🔔 *НОВА РЕЗЕРВАЦИЯ / ЗАПИТВАНЕ* [${lang.toUpperCase()}]

👤 *Име:* ${data.name}
📞 *Телефон:* ${data.phone}
📧 *Имейл:* ${data.email}
📅 *Настаняване:* ${data.checkIn}
📅 *Напускане:* ${data.checkOut}
🌙 *Нощувки:* ${calc ? calc.nights : "N/A"}
👥 *Гости:* ${data.guests}
📋 *Тарифа:* ${rateName}
💶 *Очаквана сума:* ${calc ? `${calc.totalPrice} €` : "Не е изчислена"}
💬 *Забележка:* ${data.message || "Няма"}
    `;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });
    } catch (err) {
      console.error("Грешка при изпращане на Telegram нотификация:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (priceCalculation?.error) {
      setError(priceCalculation.error);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingPayload = {
        ...formData,
        calculatedPrice: priceCalculation ? priceCalculation.totalPrice : null,
        nights: priceCalculation ? priceCalculation.nights : null,
        language: lang,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "bookings"), bookingPayload);
      await sendTelegramNotification(formData, priceCalculation);

      setSubmitted(true);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError(t.errGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className={styles["booking-section"]}>
      <div className={styles["booking-container"]}>
        <div className={styles["booking-header"]}>
          <h2>{t.headerTitle}</h2>
          <p>{t.headerDesc}</p>
        </div>

        <div className={styles["booking-grid"]}>
          <div className={styles["booking-info"]}>
            <h3>{t.directContact}</h3>
            <p>{t.contactDesc}</p>

            <div className={styles["contact-list"]}>
              <a href="tel:+359899990291" className={styles["contact-item"]}>
                <div className={styles.icon}>
                  <Phone size={20} />
                </div>
                <div>
                  <span>{t.phoneLabel}</span>
                  <strong>+359 89 999 0291</strong>
                </div>
              </a>

              <a
                href="mailto:info@mvbrilliant.com"
                className={styles["contact-item"]}
              >
                <div className={styles.icon}>
                  <Mail size={20} />
                </div>
                <div>
                  <span>{t.emailLabel}</span>
                  <strong>mizuharer2@gmail.com</strong>
                </div>
              </a>
            </div>

            <div className={styles["direct-booking-note"]}>
              💡 <strong>{t.directBookingNoteTitle}</strong> {t.directBookingNoteText}
            </div>
          </div>

          <div className={styles["booking-form-wrapper"]}>
            {submitted ? (
              <div className={styles["success-message"]}>
                <CheckCircle size={48} className={styles["success-icon"]} />
                <h3>{t.successTitle}</h3>
                <p>{t.successDesc}</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className={styles["btn-reset"]}
                >
                  {t.newRequestBtn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles["booking-form"]}>
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "0.85rem 0.75rem",
                    marginBottom: "1.25rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                      fontSize: "0.9rem",
                      color: "#334155",
                      lineHeight: "1.4",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Tag size={18} color="#2563eb" />
                      <span>{t.basePriceLabel}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.25rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "1.25rem",
                          color: "#2563eb",
                          fontWeight: "700",
                        }}
                      >
                        {pricingConfig?.basePrice || "..."} €
                      </strong>
                      <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                        {t.perNight}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      marginTop: "0.35rem",
                      marginBottom: 0,
                    }}
                  >
                    {t.basePriceNote}
                  </p>
                </div>

                {error && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className={styles["form-group"]}>
                  <label htmlFor="name">
                    <User size={16} /> {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles["form-row"]}>
                  <div className={styles["form-group"]}>
                    <label htmlFor="email">
                      <Mail size={16} /> {t.emailInputLabel}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles["form-group"]}>
                    <label htmlFor="phone">
                      <Phone size={16} /> {t.phoneInputLabel}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="0888 123 456"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles["form-row"]}>
                  <div className={styles["form-group"]}>
                    <label htmlFor="checkIn">
                      <Calendar size={16} /> {t.checkInLabel}
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      required
                      value={formData.checkIn}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles["form-group"]}>
                    <label htmlFor="checkOut">
                      <Calendar size={16} /> {t.checkOutLabel}
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      required
                      value={formData.checkOut}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {priceCalculation?.error && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#991b1b",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    ⚠️ <strong>{priceCalculation.error}</strong>
                  </div>
                )}

                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginTop: "-0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  ℹ️ *{t.minNightsNote}{" "}
                  {priceCalculation?.minNightsRequired ||
                    pricingConfig.minNights}{" "}
                  {t.nightsWord}*
                </div>

                <div className={styles["form-group"]}>
                  <label htmlFor="guests">
                    <Users size={16} /> {t.guestsLabel}
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    <option value="1">1 {t.guestSingular}</option>
                    <option value="2">2 {t.guestPlural}</option>
                    <option value="3">
                      3 {t.guestPlural} (+
                      {Math.round(pricingConfig.extraGuestPercent * 100)}%)
                    </option>
                    <option value="4">
                      4 {t.guestPlural} (+
                      {Math.round(pricingConfig.extraGuestPercent * 2 * 100)}%)
                    </option>
                    <option value="5">
                      5 {t.guestPlural} (+
                      {Math.round(pricingConfig.extraGuestPercent * 3 * 100)}%)
                    </option>
                  </select>
                </div>

                <div className={styles["form-group"]}>
                  <label>
                    <ShieldCheck size={16} /> {t.rateLabel}
                  </label>
                  <div className={styles["rate-options"]}>
                    <label className={styles["rate-card"]}>
                      <input
                        type="radio"
                        name="rateType"
                        value="standard"
                        checked={formData.rateType === "standard"}
                        onChange={handleChange}
                      />
                      <div>
                        <strong>{t.standardRate}</strong>
                        <p>{t.standardRateDesc}</p>
                      </div>
                    </label>

                    <label className={styles["rate-card"]}>
                      <input
                        type="radio"
                        name="rateType"
                        value="nonRefundable"
                        checked={formData.rateType === "nonRefundable"}
                        onChange={handleChange}
                      />
                      <div>
                        <strong>
                          {t.nonRefundableRate} (-
                          {Math.round(
                            pricingConfig.nonRefundableDiscount * 100
                          )}
                          %)
                        </strong>
                        <p>
                          {t.nonRefundableRateDesc}{" "}
                          {Math.round(
                            pricingConfig.nonRefundableDiscount * 100
                          )}
                          {t.nonRefundableRateDescEnd}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {priceCalculation && !priceCalculation.error && (
                  <div className={styles["price-summary"]}>
                    <div className={styles["price-row"]}>
                      <span>{t.summaryStay}</span>
                      <strong>
                        {priceCalculation.nights} {t.summaryNights}
                      </strong>
                    </div>

                    <div className={styles["price-row"]}>
                      <span>{t.summaryGuests}</span>
                      <strong>
                        {formData.guests}{" "}
                        {Number(formData.guests) === 1
                          ? t.guestSingular
                          : t.guestPlural}
                      </strong>
                    </div>

                    {priceCalculation.discountsList &&
                      priceCalculation.discountsList.length > 0 && (
                        <div
                          style={{
                            margin: "0.75rem 0",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.35rem",
                          }}
                        >
                          {priceCalculation.discountsList.map((disc, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                color: "#16a34a",
                                fontSize: "0.85rem",
                                fontWeight: "500",
                              }}
                            >
                              <Tag size={14} />
                              <span>
                                {disc.label} (<strong>-{disc.percent}%</strong>)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                    <div className={styles["price-total"]}>
                      <span>{t.summaryTotal}</span>
                      <strong>{priceCalculation.totalPrice} €</strong>
                    </div>
                  </div>
                )}

                <div className={styles["form-group"]}>
                  <label htmlFor="message">{t.messageLabel}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    placeholder={t.messagePlaceholder}
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={styles["btn-submit"]}
                  disabled={loading || Boolean(priceCalculation?.error)}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>{t.sending}</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>{t.submitBtn}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}