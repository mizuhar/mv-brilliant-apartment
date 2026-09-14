import { 
  Wifi, Tv, Wind, Coffee, Utensils, WashingMachine, 
  Car, ShieldCheck, Waves, Refrigerator, Armchair, Sun 
} from 'lucide-react';
import { useLanguage } from '../App';
import styles from './Amenities.module.css';

export default function Amenities() {
  const { lang } = useLanguage();

  const content = {
    bg: {
      title: 'Удобства в апартамента',
      subtitle: 'Всичко необходимо за вашия пълен комфорт и приятен престой',
      categories: [
        {
          title: 'Основен комфорт',
          items: ['Климатик', 'Бърз Wi-Fi', 'Смарт TV', 'Удобна дневна зона']
        },
        {
          title: 'Кухня и Хранене',
          items: ['Кафемашина', 'Пълен комплект прибори', 'Хладилник с фризер', 'Пералня']
        },
        {
          title: 'Удобства и Сигурност',
          items: ['Възможност за паркиране', 'Балкон / Терaса', 'Близост до плажа', 'Самостоятелен вход']
        }
      ]
    },
    en: {
      title: 'Apartment Amenities',
      subtitle: 'Everything you need for your full comfort and an enjoyable stay',
      categories: [
        {
          title: 'Core Comfort',
          items: ['Air Conditioning', 'Fast Wi-Fi', 'Smart TV', 'Cozy Living Area']
        },
        {
          title: 'Kitchen & Dining',
          items: ['Coffee Machine', 'Full Utensil Set', 'Fridge & Freezer', 'Washing Machine']
        },
        {
          title: 'Convenience & Safety',
          items: ['Parking Available', 'Balcony / Terrace', 'Close to Beach', 'Private Entrance']
        }
      ]
    },
    de: {
      title: 'Ausstattung des Apartments',
      subtitle: 'Alles, was Sie für Ihren vollen Komfort und einen angenehmen Aufenthalt brauchen',
      categories: [
        {
          title: 'Grundkomfort',
          items: ['Klimaanlage', 'Schnelles WLAN', 'Smart-TV', 'Gemütlicher Wohnbereich']
        },
        {
          title: 'Küche & Essen',
          items: ['Kaffeemaschine', 'Vollständiges Besteckset', 'Kühlschrank mit Gefrierfach', 'Waschmaschine']
        },
        {
          title: 'Komfort & Sicherheit',
          items: ['Parkmöglichkeit', 'Balkon / Terrasse', 'Strandnähe', 'Eigener Eingang']
        }
      ]
    }
  };

  const currentContent = content[lang] || content.bg;

  const iconsGrid = [
    [<Wind size={20} key="wind" />, <Wifi size={20} key="wifi" />, <Tv size={20} key="tv" />, <Armchair size={20} key="armchair" />],
    [<Coffee size={20} key="coffee" />, <Utensils size={20} key="utensils" />, <Refrigerator size={20} key="fridge" />, <WashingMachine size={20} key="wash" />],
    [<Car size={20} key="car" />, <Sun size={20} key="sun" />, <Waves size={20} key="waves" />, <ShieldCheck size={20} key="shield" />]
  ];

  return (
    <section id="amenities" className={styles['amenities-section']}>
      <div className={styles['amenities-container']}>
        <div className={styles['amenities-header']}>
          <h2>{currentContent.title}</h2>
          <p>{currentContent.subtitle}</p>
        </div>

        <div className={styles['amenities-grid']}>
          {currentContent.categories.map((cat, idx) => (
            <div key={idx} className={styles['category-card']}>
              <h3>{cat.title}</h3>
              <ul className={styles['items-list']}>
                {cat.items.map((itemName, itemIdx) => (
                  <li key={itemIdx}>
                    <span className={styles['item-icon']}>{iconsGrid[idx][itemIdx]}</span>
                    <span>{itemName}</span>
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