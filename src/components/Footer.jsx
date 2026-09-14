import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../App';
import styles from './Footer.module.css';

export default function Footer() {
  const { lang } = useLanguage();
  const currentYear = new Date().getFullYear();

  const content = {
    bg: {
      desc: 'Модерен и луксозен апартамент под наем в град Варна. Вашият незабравим престой до морето.',
      quickLinks: 'Бързи връзки',
      about: 'За апартамента',
      gallery: 'Галерия',
      amenities: 'Удобства',
      location: 'Локация',
      booking: 'Резервация',
      contacts: 'Контакти',
      city: 'гр. Варна, България',
      rights: 'Всички права запазени.',
    },
    en: {
      desc: 'Modern and luxury apartment for rent in Varna. Your unforgettable stay by the sea.',
      quickLinks: 'Quick Links',
      about: 'About',
      gallery: 'Gallery',
      amenities: 'Amenities',
      location: 'Location',
      booking: 'Booking',
      contacts: 'Contacts',
      city: 'Varna, Bulgaria',
      rights: 'All rights reserved.',
    },
    de: {
      desc: 'Modernes und luxuriöses Apartment zur Miete in Varna. Ihr unvergesslicher Aufenthalt am Meer.',
      quickLinks: 'Schnelllinks',
      about: 'Über uns',
      gallery: 'Galerie',
      amenities: 'Ausstattung',
      location: 'Lage',
      booking: 'Buchung',
      contacts: 'Kontakte',
      city: 'Varna, Bulgarien',
      rights: 'Alle Rechte vorbehalten.',
    },
  };

  const t = content[lang] || content.bg;

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        <div className={styles['footer-brand']}>
          <div className={styles.logo}>
            <Sparkles className={styles['logo-icon']} />
            <span>MV Brilliant</span>
          </div>
          <p>{t.desc}</p>
        </div>

        <div className={styles['footer-links']}>
          <h4>{t.quickLinks}</h4>
          <ul>
            <li><a href="#about">{t.about}</a></li>
            <li><a href="#gallery">{t.gallery}</a></li>
            <li><a href="#amenities">{t.amenities}</a></li>
            <li><a href="#location">{t.location}</a></li>
            <li><a href="#booking">{t.booking}</a></li>
          </ul>
        </div>

        <div className={styles['footer-contact']}>
          <h4>{t.contacts}</h4>
          <ul>
            <li>
              <MapPin size={16} />
              <span>{t.city}</span>
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
        <p>&copy; {currentYear} MV Brilliant Apartment. {t.rights}</p>
      </div>
    </footer>
  );
}