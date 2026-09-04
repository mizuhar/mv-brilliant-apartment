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
import styles from "./Booking.module.css";

export default function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    rateType: "standard", // 'standard' или 'nonRefundable'
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // ⚙️ Динамичен state за ценообразуването и сезоните от Firestore
  const [pricingConfig, setPricingConfig] = useState({
    basePrice: 100,
    extraGuestPercent: 0.15,
    nonRefundableDiscount: 0.1,
    weeklyDiscount: 0.1,
    monthlyDiscount: 0.25,
    lastMinuteDiscount: 0.1, // 👈 Добавено
    earlyBirdDiscount: 0.1,  // 👈 Добавено
    minNights: 2,
    seasons: [],
  });

  // 📥 Дърпане на цените и сезоните от Firestore при зареждане
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
            lastMinuteDiscount: Number(data.lastMinuteDiscount) ?? 0.1, // 👈 Прочитаме от DB с fallback 10%
            earlyBirdDiscount: Number(data.earlyBirdDiscount) ?? 0.1,   // 👈 Прочитаме от DB с fallback 10%
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

  // 📊 Защитено useMemo с гарантирани fallbacks за Last-Minute & Early-Bird
  const priceCalculation = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return null;

    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffTime = end.getTime() - start.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return { error: "Датата на напускане трябва да е след настаняването." };
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
    const seasonsList = Array.isArray(pricingConfig?.seasons) ? pricingConfig.seasons : [];

    // 1. Обхождане ден по ден
    for (let i = 0; i < nights; i++) {
      const dateString = formatDateLocal(currentDate);

      const activeSeason = seasonsList.find((season) => {
        return season?.startDate && season?.endDate && dateString >= season.startDate && dateString <= season.endDate;
      });

      const dayBasePrice = activeSeason && !isNaN(Number(activeSeason.price))
        ? Number(activeSeason.price)
        : basePrice;

      if (activeSeason && !isNaN(Number(activeSeason.minNights)) && Number(activeSeason.minNights) > maxMinNightsRequired) {
        maxMinNightsRequired = Number(activeSeason.minNights);
      }

      const dayPrice = dayBasePrice + dayBasePrice * (extraGuests * extraGuestPercent);
      rawTotal += dayPrice;

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (nights < maxMinNightsRequired) {
      return {
        error: `Минималният престой за избрания период е ${maxMinNightsRequired} нощувки.`,
      };
    }

    let total = rawTotal;
    const discountsList = [];

    // 2. Отстъпки за престой
    const monthlyDisc = Number(pricingConfig?.monthlyDiscount) ?? 0.25;
    const weeklyDisc = Number(pricingConfig?.weeklyDiscount) ?? 0.10;

    if (nights >= 28 && monthlyDisc > 0) {
      total *= 1 - monthlyDisc;
      discountsList.push({
        label: "Месечна отстъпка",
        percent: Math.round(monthlyDisc * 100),
      });
    } else if (nights >= 7 && weeklyDisc > 0) {
      total *= 1 - weeklyDisc;
      discountsList.push({
        label: "Седмична отстъпка",
        percent: Math.round(weeklyDisc * 100),
      });
    }

    // 3. Last-Minute / Early-Bird (с твърд fallback 0.10, ако липсва в DB)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysUntilCheckIn = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const lastMinuteDisc = pricingConfig?.lastMinuteDiscount !== undefined
      ? Number(pricingConfig.lastMinuteDiscount)
      : 0.1;

    const earlyBirdDisc = pricingConfig?.earlyBirdDiscount !== undefined
      ? Number(pricingConfig.earlyBirdDiscount)
      : 0.1;

    if (daysUntilCheckIn >= 0 && daysUntilCheckIn <= 3 && lastMinuteDisc > 0) {
      total *= 1 - lastMinuteDisc;
      discountsList.push({
        label: "Last-Minute оферта",
        percent: Math.round(lastMinuteDisc * 100),
      });
    } else if (daysUntilCheckIn >= 60 && earlyBirdDisc > 0) {
      total *= 1 - earlyBirdDisc;
      discountsList.push({
        label: "Early-Bird (Ранно запитване)",
        percent: Math.round(earlyBirdDisc * 100),
      });
    }

    // 4. Невъзвръщаема тарифа
    const nonRefundableDisc = Number(pricingConfig?.nonRefundableDiscount) ?? 0.1;

    if (formData.rateType === "nonRefundable" && nonRefundableDisc > 0) {
      total *= 1 - nonRefundableDisc;
      discountsList.push({
        label: "Невъзвръщаема тарифа",
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
🔔 *НОВА РЕЗЕРВАЦИЯ / ЗАПИТВАНЕ*

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
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "bookings"), bookingPayload);
      await sendTelegramNotification(formData, priceCalculation);

      setSubmitted(true);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Възникна грешка при изпращането. Моля, опитайте отново.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className={styles["booking-section"]}>
      <div className={styles["booking-container"]}>
        <div className={styles["booking-header"]}>
          <h2>Резервация & Запитване</h2>
          <p>
            Изпратете запитване за желаните от вас дати и ние ще се свържем с
            вас възможно най-скоро
          </p>
        </div>

        <div className={styles["booking-grid"]}>
          <div className={styles["booking-info"]}>
            <h3>Директен контакт</h3>
            <p>
              Предпочитате бърз разговор или съобщение? Свържете се с нас
              директно:
            </p>

            <div className={styles["contact-list"]}>
              <a href="tel:+359899990291" className={styles["contact-item"]}>
                <div className={styles.icon}>
                  <Phone size={20} />
                </div>
                <div>
                  <span>Телефон</span>
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
                  <span>Имейл</span>
                  <strong>mizuharer2@gmail.com</strong>
                </div>
              </a>
            </div>

            <div className={styles["direct-booking-note"]}>
              💡 <strong>Директна резервация:</strong> При резервация през сайта
              спестявате комисионни такси от платформи за нощувки!
            </div>
          </div>

          <div className={styles["booking-form-wrapper"]}>
            {submitted ? (
              <div className={styles["success-message"]}>
                <CheckCircle size={48} className={styles["success-icon"]} />
                <h3>Благодарим ви за запитването!</h3>
                <p>
                  Ще се свържем с вас в най-кратък срок, за да потвърдим
                  наличността за избраните дати.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className={styles["btn-reset"]}
                >
                  Ново запитване
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles["booking-form"]}>
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
                    <User size={16} /> Вашето име
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles["form-row"]}>
                  <div className={styles["form-group"]}>
                    <label htmlFor="email">
                      <Mail size={16} /> Имейл
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
                      <Phone size={16} /> Телефон
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
                      <Calendar size={16} /> Настаняване
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
                      <Calendar size={16} /> Напускане
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
                  ℹ️ *Минималният престой за резервация е{" "}
                  {priceCalculation?.minNightsRequired ||
                    pricingConfig.minNights}{" "}
                  нощувки.*
                </div>

                <div className={styles["form-group"]}>
                  <label htmlFor="guests">
                    <Users size={16} /> Брой гости
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    <option value="1">1 гост</option>
                    <option value="2">2 гости</option>
                    <option value="3">
                      3 гости (+
                      {Math.round(pricingConfig.extraGuestPercent * 100)}%)
                    </option>
                    <option value="4">
                      4 гости (+
                      {Math.round(pricingConfig.extraGuestPercent * 2 * 100)}%)
                    </option>
                    <option value="5">
                      5 гости (+
                      {Math.round(pricingConfig.extraGuestPercent * 3 * 100)}%)
                    </option>
                  </select>
                </div>

                <div className={styles["form-group"]}>
                  <label>
                    <ShieldCheck size={16} /> Изберете тарифа
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
                        <strong>Стандартна тарифа</strong>
                        <p>Възможност за безплатна анулация</p>
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
                          Без право на анулация (-
                          {Math.round(
                            pricingConfig.nonRefundableDiscount * 100
                          )}
                          %)
                        </strong>
                        <p>
                          Спестявате{" "}
                          {Math.round(
                            pricingConfig.nonRefundableDiscount * 100
                          )}
                          % от сумата, без право на възстановяване
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 💶 Подробен блок за цената и отстъпките в UI */}
                {priceCalculation && !priceCalculation.error && (
                  <div className={styles["price-summary"]}>
                    <div className={styles["price-row"]}>
                      <span>Престой:</span>
                      <strong>{priceCalculation.nights} нощувки</strong>
                    </div>

                    <div className={styles["price-row"]}>
                      <span>Гости:</span>
                      <strong>
                        {formData.guests} {Number(formData.guests) === 1 ? "гост" : "гости"}
                      </strong>
                    </div>

                    {/* 🏷️ Визуализиране на списъка с приложени отстъпки */}
                    {priceCalculation.discountsList && priceCalculation.discountsList.length > 0 && (
                      <div style={{ margin: "0.75rem 0", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
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
                      <span>Обща сума:</span>
                      <strong>{priceCalculation.totalPrice} €</strong>
                    </div>
                  </div>
                )}

                <div className={styles["form-group"]}>
                  <label htmlFor="message">
                    Допълнителна информация / въпроси
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    placeholder="Например: час на пристигане, нужда от детско креватче..."
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
                      <span>Изпращане...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Изпрати запитването</span>
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