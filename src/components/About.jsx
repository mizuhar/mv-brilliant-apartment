import { Users, Bed, Bath, Wifi, Tv, Coffee } from 'lucide-react';
import styles from  './About.module.css';

export default function About() {
  const highlights = [
    { icon: <Users size={28} />, title: 'Капацитет', desc: 'До 5 гости' },
    { icon: <Bed size={28} />, title: 'Спални помещения', desc: 'Комфортна спалня + разтегателен диван' },
    { icon: <Bath size={28} />, title: 'Баня', desc: 'Модерна самостоятелна баня' },
    { icon: <Wifi size={28} />, title: 'Бърз Wi-Fi', desc: 'Безплатен високоскоростен интернет' },
    { icon: <Tv size={28} />, title: 'Смарт TV', desc: 'Телевизор с кабелна и стрийминг' },
    { icon: <Coffee size={28} />, title: 'Напълно оборудван', desc: 'Кухня с всички необходими уреди' },
  ];

  return (
    <section id="about" className={styles['about-section']}>
      <div className={styles['about-container']}>
        <div className={styles['about-header']}>
          <h2>За MV Brilliant Apartment</h2>
          <p>
            Добре дошли в MV Brilliant – вашият уютен дом далеч от дома. Апартаментът предлага 
            всички съвременни удобства, съчетани с отлична локация, осигуряваща бърз достъп до 
            морския бряг и ключови забележителности.
          </p>
        </div>

        <div className={styles['highlights-grid']}>
          {highlights.map((item, index) => (
            <div key={index} className={styles['highlight-card']}>
              <div className={styles['highlight-icon']}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}