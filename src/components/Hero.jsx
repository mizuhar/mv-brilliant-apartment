import { Calendar } from 'lucide-react';
import { useLanguage } from '../App.jsx';
import styles from './Hero.module.css';

export default function Hero() {
  const { lang } = useLanguage();

  const translations = {
    bg: {
      badge: "Варна • Район Чаталджа",
      title: "MV Brilliant Apartment",
      desc: "Луксозен апартамент за нощувки във Варна, район Чаталджа. Перфектно място за почивка в близост до плажа и Морската градина.",
      bookBtn: "Запази престой",
      galleryBtn: "Разгледай галерията",
    },
    en: {
      badge: "Varna • Chataldzha District",
      title: "MV Brilliant Apartment",
      desc: "Luxury overnight apartment in Varna, Chataldzha area. A perfect stay close to the beach and the Sea Garden.",
      bookBtn: "Book Your Stay",
      galleryBtn: "Explore Gallery",
    },
    de: {
      badge: "Varna • Bezirk Chataldzha",
      title: "MV Brilliant Apartment",
      desc: "Luxuriöses Apartment in Varna, Stadtteil Chataldzha. Der perfekte Ort für Ihren Urlaub nahe Strand und Meeresgarten.",
      bookBtn: "Jetzt Buchen",
      galleryBtn: "Galerie Ansehen",
    },
  };

  const t = translations[lang] || translations.bg;

  return (
    <section className={styles.hero}>
      <div className={styles['hero-content']}>
        <span className={styles['hero-badge']}>{t.badge}</span>
        <h1>{t.title}</h1>
        <p>{t.desc}</p>

        <div className={styles['hero-cta']}>
          <a href="#booking" className={styles['btn-primary']}>
            <Calendar size={18} />
            <span>{t.bookBtn}</span>
          </a>
          <a href="#gallery" className={styles['btn-secondary']}>
            {t.galleryBtn}
          </a>
        </div>
      </div>
    </section>
  );
}