import { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Loader2, CheckCircle2, DollarSign } from 'lucide-react';
import styles from './AdminPricing.module.css';

export default function AdminPricing() {
  const [pricing, setPricing] = useState({
    basePrice: 100,
    extraGuestPercent: 15, // Изразен в проценти за по-удобно въвеждане
    minNights: 2,
    nonRefundableDiscount: 10,
    weeklyDiscount: 10,
    monthlyDiscount: 25,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // 1. Зареждане на настоящите цени от Firestore
  useEffect(() => {
    async function loadPricing() {
      try {
        const docRef = doc(db, 'settings', 'pricing');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPricing({
            basePrice: data.basePrice ?? 100,
            extraGuestPercent: (data.extraGuestPercent ?? 0.15) * 100,
            minNights: data.minNights ?? 2,
            nonRefundableDiscount: (data.nonRefundableDiscount ?? 0.10) * 100,
            weeklyDiscount: (data.weeklyDiscount ?? 0.10) * 100,
            monthlyDiscount: (data.monthlyDiscount ?? 0.25) * 100,
          });
        }
      } catch (err) {
        console.error('Грешка при зареждане на цените:', err);
        setError('Не можахме да заредем цените от базата данни.');
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

  // 2. Запазване на цените във Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const docRef = doc(db, 'settings', 'pricing');
      
      // Преобразуваме процентите обратно в десетични дроби за калкулатора (15% -> 0.15)
      const payload = {
        basePrice: Number(pricing.basePrice),
        extraGuestPercent: Number(pricing.extraGuestPercent) / 100,
        minNights: Number(pricing.minNights),
        nonRefundableDiscount: Number(pricing.nonRefundableDiscount) / 100,
        weeklyDiscount: Number(pricing.weeklyDiscount) / 100,
        monthlyDiscount: Number(pricing.monthlyDiscount) / 100,
        updatedAt: new Date(),
      };

      await setDoc(docRef, payload, { merge: true });
      setSuccessMsg('Цените бяха обновени успешно!');
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Грешка при запазване:', err);
      setError('Възникна грешка при запазването на цените.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Loader2 size={24} className="animate-spin" />
        <p>Зареждане на ценовата политика...</p>
      </div>
    );
  }

  return (
    <div className={styles['pricing-card']}>
      <div className={styles['pricing-header']}>
        <h3><DollarSign size={20} /> Управление на цени & отстъпки</h3>
        <p>Промените влизат в сила веднага за калкулатора в сайта.</p>
      </div>

      {successMsg && (
        <div className={styles['alert-success']}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {error && <div className={styles['alert-error']}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles['pricing-form']}>
        <div className={styles['form-grid']}>
          <div className={styles['form-group']}>
            <label htmlFor="basePrice">Базова цена за нощувка (до 2 души)</label>
            <div className={styles['input-prefix']}>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                min="0"
                value={pricing.basePrice}
                onChange={handleChange}
                required
              />
              <span>лв.</span>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="minNights">Минимален престой</label>
            <div className={styles['input-prefix']}>
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

          <div className={styles['form-group']}>
            <label htmlFor="extraGuestPercent">Доплащане за всеки следващ гост (над 2-рия)</label>
            <div className={styles['input-prefix']}>
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

          <div className={styles['form-group']}>
            <label htmlFor="nonRefundableDiscount">Отстъпка "Без право на анулация"</label>
            <div className={styles['input-prefix']}>
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

          <div className={styles['form-group']}>
            <label htmlFor="weeklyDiscount">Седмична отстъпка (7+ нощувки)</label>
            <div className={styles['input-prefix']}>
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

          <div className={styles['form-group']}>
            <label htmlFor="monthlyDiscount">Месечна отстъпка (28+ нощувки)</label>
            <div className={styles['input-prefix']}>
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
        </div>

        <button type="submit" className={styles['btn-save']} disabled={saving}>
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Запазване...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Запази промените</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}