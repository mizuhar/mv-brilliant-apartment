import { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Save,
  Loader2,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";
import styles from "./AdminPricing.module.css";

export default function AdminPricing() {
  const [pricing, setPricing] = useState({
    basePrice: 100,
    extraGuestPercent: 15,
    minNights: 2,
    nonRefundableDiscount: 10,
    weeklyDiscount: 10,
    monthlyDiscount: 25,
  });

  // 🗓️ State за сезоните / ценовите периоди
  const [seasons, setSeasons] = useState([]);
  const [newSeason, setNewSeason] = useState({
    name: "",
    startDate: "",
    endDate: "",
    price: "",
    minNights: 2,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // 1. Зареждане на цените и сезоните от Firestore
  useEffect(() => {
    async function loadPricing() {
      try {
        const docRef = doc(db, "settings", "pricing");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPricing({
            basePrice: data.basePrice ?? 100,
            extraGuestPercent: (data.extraGuestPercent ?? 0.15) * 100,
            minNights: data.minNights ?? 2,
            nonRefundableDiscount: (data.nonRefundableDiscount ?? 0.1) * 100,
            weeklyDiscount: (data.weeklyDiscount ?? 0.1) * 100,
            monthlyDiscount: (data.monthlyDiscount ?? 0.25) * 100,
          });

          if (Array.isArray(data.seasons)) {
            setSeasons(data.seasons);
          }
        }
      } catch (err) {
        console.error("Грешка при зареждане на цените:", err);
        setError("Не можахме да заредем цените от базата данни.");
      } finally {
        setLoading(false);
      }
    }

    loadPricing();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPricing((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  // Добавяне на нов сезон към локалния масив
  const handleAddSeason = (e) => {
    e.preventDefault();
    if (
      !newSeason.name ||
      !newSeason.startDate ||
      !newSeason.endDate ||
      !newSeason.price
    ) {
      setError("Моля, попълнете всички полета за новия сезон.");
      return;
    }

    if (new Date(newSeason.startDate) >= new Date(newSeason.endDate)) {
      setError("Крайната дата трябва да е след началната.");
      return;
    }

    const createdSeason = {
      id: Date.now().toString(),
      name: newSeason.name,
      startDate: newSeason.startDate,
      endDate: newSeason.endDate,
      price: Number(newSeason.price),
      minNights: Number(newSeason.minNights) || 2,
    };

    setSeasons((prev) => [...prev, createdSeason]);
    setNewSeason({
      name: "",
      startDate: "",
      endDate: "",
      price: "",
      minNights: 2,
    });
    setError("");
  };

  // Изтриване на сезон
  const handleRemoveSeason = (id) => {
    setSeasons((prev) => prev.filter((s) => s.id !== id));
  };

  // 2. Запазване на всичко във Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      const docRef = doc(db, "settings", "pricing");

      const payload = {
        basePrice: Number(pricing.basePrice),
        extraGuestPercent: Number(pricing.extraGuestPercent) / 100,
        minNights: Number(pricing.minNights),
        nonRefundableDiscount: Number(pricing.nonRefundableDiscount) / 100,
        weeklyDiscount: Number(pricing.weeklyDiscount) / 100,
        monthlyDiscount: Number(pricing.monthlyDiscount) / 100,
        lastMinuteDiscount: Number(pricing.lastMinuteDiscount) / 100,
        earlyBirdDiscount: Number(pricing.earlyBirdDiscount) / 100,
        seasons: seasons, // Запазваме масива от сезони
        updatedAt: new Date(),
      };

      await setDoc(docRef, payload, { merge: true });
      setSuccessMsg("Цените и сезоните бяха обновени успешно!");

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Грешка при запазване:", err);
      setError("Възникна грешка при запазването на цените.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Loader2 size={24} className="animate-spin" />
        <p>Зареждане на ценовата политика...</p>
      </div>
    );
  }

  return (
    <div className={styles["pricing-card"]}>
      <div className={styles["pricing-header"]}>
        <h3>
          <DollarSign size={20} /> Управление на цени & сезони
        </h3>
        <p>Промените влизат в сила веднага за калкулатора в сайта.</p>
      </div>

      {successMsg && (
        <div className={styles["alert-success"]}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {error && <div className={styles["alert-error"]}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles["pricing-form"]}>
        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="basePrice">Базова цена (стандартен сезон)</label>
            <div className={styles["input-prefix"]}>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                min="0"
                value={pricing.basePrice}
                onChange={handleChange}
                required
              />
              <span>евро</span>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="minNights">Минимален престой (базов)</label>
            <div className={styles["input-prefix"]}>
              <input
                type="number"
                id="minNights"
                name="minNights"
                min="1"
                value={pricing.minNights}
                onChange={handleChange}
                required
              />
              <span>нощувки</span>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="extraGuestPercent">
              Доплащане за допълнителен гост
            </label>
            <div className={styles["input-prefix"]}>
              <input
                type="number"
                id="extraGuestPercent"
                name="extraGuestPercent"
                min="0"
                max="100"
                value={pricing.extraGuestPercent}
                onChange={handleChange}
                required
              />
              <span>%</span>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="nonRefundableDiscount">
              Отстъпка "Без анулация"
            </label>
            <div className={styles["input-prefix"]}>
              <input
                type="number"
                id="nonRefundableDiscount"
                name="nonRefundableDiscount"
                min="0"
                max="100"
                value={pricing.nonRefundableDiscount}
                onChange={handleChange}
                required
              />
              <span>%</span>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="weeklyDiscount">Седмична отстъпка (7+ дни)</label>
            <div className={styles["input-prefix"]}>
              <input
                type="number"
                id="weeklyDiscount"
                name="weeklyDiscount"
                min="0"
                max="100"
                value={pricing.weeklyDiscount}
                onChange={handleChange}
                required
              />
              <span>%</span>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="monthlyDiscount">Месечна отстъпка (28+ дни)</label>
            <div className={styles["input-prefix"]}>
              <input
                type="number"
                id="monthlyDiscount"
                name="monthlyDiscount"
                min="0"
                max="100"
                value={pricing.monthlyDiscount}
                onChange={handleChange}
                required
              />
              <span>%</span>
            </div>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="lastMinuteDiscount">
              Last-Minute отстъпка (настаняване до 3 дни)
            </label>
            <div className={styles["input-prefix"]}>
              <input
                type="number"
                id="lastMinuteDiscount"
                name="lastMinuteDiscount"
                min="0"
                max="100"
                value={pricing.lastMinuteDiscount ?? 10}
                onChange={handleChange}
              />
              <span>%</span>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="earlyBirdDiscount">
              Early-Bird отстъпка (резервация 60+ дни по-рано)
            </label>
            <div className={styles["input-prefix"]}>
              <input
                type="number"
                id="earlyBirdDiscount"
                name="earlyBirdDiscount"
                min="0"
                max="100"
                value={pricing.earlyBirdDiscount ?? 10}
                onChange={handleChange}
              />
              <span>%</span>
            </div>
          </div>
        </div>

        <hr style={{ margin: "2rem 0", borderColor: "#e2e8f0" }} />

        {/* 🏖️ Секция за ценови периоди / сезони */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4>
            <Calendar size={18} /> Динамични ценови периоди (Сезони)
          </h4>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
            Задайте специфични цени за юли, август или празнични дни.
          </p>
        </div>

        {/* Форма за добавяне на нов период */}
        <div
          className={styles["form-grid"]}
          style={{
            marginBottom: "1.5rem",
            backgroundColor: "#f8fafc",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <div className={styles["form-group"]}>
            <label>Име на сезона</label>
            <input
              type="text"
              placeholder="напр. Силен Летен Сезон"
              value={newSeason.name}
              onChange={(e) =>
                setNewSeason({ ...newSeason, name: e.target.value })
              }
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Начална дата</label>
            <input
              type="date"
              value={newSeason.startDate}
              onChange={(e) =>
                setNewSeason({ ...newSeason, startDate: e.target.value })
              }
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Крайна дата</label>
            <input
              type="date"
              value={newSeason.endDate}
              onChange={(e) =>
                setNewSeason({ ...newSeason, endDate: e.target.value })
              }
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Цена за нощувка (€)</label>
            <input
              type="number"
              min="0"
              placeholder="150"
              value={newSeason.price}
              onChange={(e) =>
                setNewSeason({ ...newSeason, price: e.target.value })
              }
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Мин. престой</label>
            <input
              type="number"
              min="1"
              placeholder="3"
              value={newSeason.minNights}
              onChange={(e) =>
                setNewSeason({ ...newSeason, minNights: e.target.value })
              }
            />
          </div>

          <div
            className={styles["form-group"]}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <button
              type="button"
              onClick={handleAddSeason}
              className={styles["btn-save"]}
              style={{ backgroundColor: "#0284c7", width: "100%" }}
            >
              <Plus size={16} /> Добави период
            </button>
          </div>
        </div>

        {/* Списък с активните сезони */}
      {seasons.length > 0 && (
  <div className={styles['table-wrapper']}>
    <table className={styles['seasons-table']}>
      <thead>
        <tr>
          <th>Сезон</th>
          <th>Период</th>
          <th>Цена / нощ</th>
          <th>Мин. престой</th>
          <th style={{ textAlign: 'right' }}>Действие</th>
        </tr>
      </thead>
      <tbody>
        {seasons.map((s) => (
          <tr key={s.id}>
            <td style={{ fontWeight: 'bold' }}>{s.name}</td>
            <td>{s.startDate} — {s.endDate}</td>
            <td>{s.price} €</td>
            <td>{s.minNights} нощувки</td>
            <td style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => handleRemoveSeason(s.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        <button type="submit" className={styles["btn-save"]} disabled={saving}>
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Запазване...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Запази всички промени</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
