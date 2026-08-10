import { Calendar, Users } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles['hero-content']}>
        <span className={styles['hero-badge']}>Луксозен престой във Варна</span>
        <h1>MV Brilliant Apartment</h1>
        <p>Вашето перфектно място за почивка и комфорт в близост до плажа и морската градина.</p>

        <div className={styles['hero-cta']}>
          <a href="#booking" className={styles['btn-primary']}>
            <Calendar size={18} />
            <span>Запази престой</span>
          </a>
          <a href="#gallery" className={styles['btn-secondary']}>Разгледай галерията</a>
        </div>
      </div>
    </section>
  );
}