import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        <div className={styles['footer-brand']}>
          <div className={styles.logo}>
            <Sparkles className={styles['logo-icon']} />
            <span>MV Brilliant</span>
          </div>
          <p>
            Модерен и луксозен апартамент под наем в град Варна. Вашият незабравим престой до морето.
          </p>
        </div>

        <div className={styles['footer-links']}>
          <h4>Бързи връзки</h4>
          <ul>
            <li><a href="#about">За апартамента</a></li>
            <li><a href="#gallery">Галерия</a></li>
            <li><a href="#amenities">Удобства</a></li>
            <li><a href="#location">Локация</a></li>
            <li><a href="#booking">Резервация</a></li>
          </ul>
        </div>

        <div className={styles['footer-contact']}>
          <h4>Контакти</h4>
          <ul>
            <li>
              <MapPin size={16} />
              <span>гр. Варна, България</span>
            </li>
            <li>
              <Phone size={16} />
              <a href="tel:+359899990291">+359 899990291</a>
            </li>
            <li>
              <Mail size={16} />
              <a href="mailto:mizuhar@abv.bg">mizuhar@abv.bg</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles['footer-bottom']}>
        <p>&copy; {currentYear} MV Brilliant Apartment. Всички права запазени.</p>
      </div>
    </footer>
  );
}