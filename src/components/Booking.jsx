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
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
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

  // ⚙️ Динамичен state за ценообразуването от Firestore
  const [pricingConfig, setPricingConfig] = useState({
    basePrice: 100,
    extraGuestPercent: 0.15,
    nonRefundableDiscount: 0.1,
    weeklyDiscount: 0.1,
    monthlyDiscount: 0.25,
    minNights: 2,
  });

  // 📥 Дърпане на цените от Firestore при зареждане
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
            minNights: Number(data.minNights) || 2,
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

  // 📊 Динамичен калкулатор за цената
  const priceCalculation = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return null;

    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = end - start;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0)
      return { error: "Датата на напускане трябва да е след настаняването." };
    if (nights < pricingConfig.minNights) {
      return {
        error: `Минималният престой е ${pricingConfig.minNights} нощувки.`,
      };
    }

    const guestsCount = Number(formData.guests);
    let nightPrice = pricingConfig.basePrice;

    // Доплащане за допълнителни гости (над 2-ма)
    if (guestsCount > 2) {
      const extraGuests = guestsCount - 2;
      nightPrice +=
        pricingConfig.basePrice *
        (extraGuests * pricingConfig.extraGuestPercent);
    }

    let total = nightPrice * nights;
    let appliedDiscount = "";

    // Отстъпка за продължителност
    if (nights >= 28) {
      total *= 1 - pricingConfig.monthlyDiscount;
      appliedDiscount = `Месечна отстъпка (-${Math.round(pricingConfig.monthlyDiscount * 100)}%)`;
    } else if (nights >= 7) {
      total *= 1 - pricingConfig.weeklyDiscount;
      appliedDiscount = `Седмична отстъпка (-${Math.round(pricingConfig.weeklyDiscount * 100)}%)`;
    }

    // Отстъпка за невъзвръщаема тарифа
    if (formData.rateType === "nonRefundable") {
      total *= 1 - pricingConfig.nonRefundableDiscount;
    }

    return {
      nights,
      nightPrice: Math.round(nightPrice),
      totalPrice: Math.round(total),
      appliedDiscount,
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

      // 1. Запис във Firestore
      await addDoc(collection(db, "bookings"), bookingPayload);

      // 2. Известие в Telegram
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
              <a href="tel:+359888000000" className={styles["contact-item"]}>
                <div className={styles.icon}>
                  <Phone size={20} />
                </div>
                <div>
                  <span>Телефон</span>
                  <strong>+359 88 800 0000</strong>
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
                  <strong>info@mvbrilliant.com</strong>
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
                  {pricingConfig.minNights} нощувки.*
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
                      3 гости (+{Math.round(pricingConfig.extraGuestPercent * 100)}%)
                    </option>
                    <option value="4">
                      4 гости (+{Math.round(pricingConfig.extraGuestPercent * 2 * 100)}%)
                    </option>
                    <option value="5">
                      5 гости (+{Math.round(pricingConfig.extraGuestPercent * 3 * 100)}%)
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
                          {Math.round(pricingConfig.nonRefundableDiscount * 100)}%)
                        </strong>
                        <p>
                          Спестявате{" "}
                          {Math.round(pricingConfig.nonRefundableDiscount * 100)}%
                          от сумата, без право на възстановяване
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {priceCalculation && !priceCalculation.error && (
                  <div className={styles["price-summary"]}>
                    <div className={styles["price-row"]}>
                      <span>Престой:</span>
                      <strong>{priceCalculation.nights} нощувки</strong>
                    </div>
                    {priceCalculation.appliedDiscount && (
                      <div className={styles["price-discount"]}>
                        <Tag size={14} /> {priceCalculation.appliedDiscount}
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