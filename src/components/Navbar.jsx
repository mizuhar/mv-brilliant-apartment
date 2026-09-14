import { Link } from "react-router-dom";
import { Sparkles, Phone } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../App.jsx";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { lang } = useLanguage();

  const translations = {
    bg: {
      about: "За апартамента",
      gallery: "Галерия",
      amenities: "Удобства",
      booking: "Резервация",
      calendar: "Календар",
      location: "Локация",
      contact: "Контакт",
    },
    en: {
      about: "About",
      gallery: "Gallery",
      amenities: "Amenities",
      booking: "Booking",
      calendar: "Calendar",
      location: "Location",
      contact: "Contact",
    },
    de: {
      about: "Über uns",
      gallery: "Galerie",
      amenities: "Ausstattung",
      booking: "Buchung",
      calendar: "Kalender",
      location: "Lage",
      contact: "Kontakt",
    },
  };

  const t = translations[lang] || translations.bg;

  return (
    <header className={styles.navbar}>
      <div className={styles["navbar-container"]}>
        <Link to="/" className={styles.logo}>
          <Sparkles className={styles["logo-icon"]} />
          <span>MV Brilliant</span>
        </Link>

        <nav className={styles["nav-links"]}>
          <a href="#about">{t.about}</a>
          <a href="#gallery">{t.gallery}</a>
          <a href="#amenities">{t.amenities}</a>
          <a href="#booking">{t.booking}</a>
          <a
            href="#calendar"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            {t.calendar}
          </a>
          <a href="#location">{t.location}</a>
        </nav>

        <div className={styles["nav-actions"]}>
          <LanguageSwitcher />
          <a href="tel:+359899990291" className={styles["btn-contact"]}>
            <Phone size={18} />
            <span>{t.contact}</span>
          </a>
        </div>
      </div>
    </header>
  );
}