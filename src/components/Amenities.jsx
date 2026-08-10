import { 
  Wifi, Tv, Wind, Coffee, Utensils, WashingMachine, 
  Car, ShieldCheck, Waves, Refrigerator, Armchair, Sun 
} from 'lucide-react';
import styles from './Amenities.module.css';

export default function Amenities() {
  const categories = [
    {
      title: 'Основен комфорт',
      items: [
        { icon: <Wind size={20} />, name: 'Климатик' },
        { icon: <Wifi size={20} />, name: 'Бърз Wi-Fi' },
        { icon: <Tv size={20} />, name: 'Смарт TV' },
        { icon: <Armchair size={20} />, name: 'Удобна дневна зона' },
      ],
    },
    {
      title: 'Кухня и Хранене',
      items: [
        { icon: <Coffee size={20} />, name: 'Кафемашина' },
        { icon: <Utensils size={20} />, name: 'Пълен комплект прибори' },
        { icon: <Refrigerator size={20} />, name: 'Хладилник с фризер' },
        { icon: <WashingMachine size={20} />, name: 'Пералня' },
      ],
    },
    {
      title: 'Удобства и Сигурност',
      items: [
        { icon: <Car size={20} />, name: 'Възможност за паркиране' },
        { icon: <Sun size={20} />, name: 'Балкон / Терaса' },
        { icon: <Waves size={20} />, name: 'Близост до плажа' },
        { icon: <ShieldCheck size={20} />, name: 'Самостоятелен вход' },
      ],
    },
  ];

  return (
    <section id="amenities" className={styles['amenities-section']}>
      <div className={styles['amenities-container']}>
        <div className={styles['amenities-header']}>
          <h2>Удобства в апартамента</h2>
          <p>Всичко необходимо за вашия пълен комфорт и приятен престой</p>
        </div>

        <div className={styles['amenities-grid']}>
          {categories.map((cat, idx) => (
            <div key={idx} className={styles['category-card']}>
              <h3>{cat.title}</h3>
              <ul className={styles['items-list']}>
                {cat.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <span className={styles['item-icon']}>{item.icon}</span>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}