import { Link } from "react-router-dom";
import { Sparkles, Phone } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles["navbar-container"]}>
        <Link to="/" className={styles.logo}>
          <Sparkles className={styles["logo-icon"]} />
          <span>MV Brilliant</span>
        </Link>

        <nav className={styles["nav-links"]}>
          <a href="#about">За апартамента</a>
          <a href="#gallery">Галерия</a>
          <a href="#amenities">Удобства</a>
          <a href="#booking">Резервация</a>
          <a
            href="#calendar"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Календар
          </a>
          <a href="#location">Локация</a>
        </nav>

        <a href="tel:+359888000000" className={styles["btn-contact"]}>
          <Phone size={18} />
          <span>Контакт</span>
        </a>
      </div>
    </header>
  );
}
