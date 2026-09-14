import { Users, Bed, Bath, Wifi, Tv, Coffee } from 'lucide-react';
import { useLanguage } from '../App';
import styles from './About.module.css';

export default function About() {
  const { lang } = useLanguage();

  const content = {
    bg: {
      title: 'За MV Brilliant Apartment',
      text: 'Добре дошли в MV Brilliant – вашият уютен дом далеч от дома. Апартаментът предлага всички съвременни удобства, съчетани с отлична локация, осигуряваща бърз достъп до морския бряг и ключови забележителности.',
      highlights: [
        { title: 'Капацитет', desc: 'До 5 гости' },
        { title: 'Спални помещения', desc: 'Комфортна спалня + разтегателен диван' },
        { title: 'Баня', desc: 'Модерна самостоятелна баня' },
        { title: 'Бърз Wi-Fi', desc: 'Безплатен високоскоростен интернет' },
        { title: 'Смарт TV', desc: 'Телевизор с кабелна и стрийминг' },
        { title: 'Напълно оборудван', desc: 'Кухня с всички необходими уреди' },
      ]
    },
    en: {
      title: 'About MV Brilliant Apartment',
      text: 'Welcome to MV Brilliant – your cozy home away from home. The apartment offers modern amenities combined with a prime location, providing quick access to the beach and key city landmarks.',
      highlights: [
        { title: 'Capacity', desc: 'Up to 5 guests' },
        { title: 'Bedrooms', desc: 'Comfortable bedroom + sofa bed' },
        { title: 'Bathroom', desc: 'Modern private bathroom' },
        { title: 'Fast Wi-Fi', desc: 'Free high-speed internet' },
        { title: 'Smart TV', desc: 'TV with cable and streaming' },
        { title: 'Fully Equipped', desc: 'Kitchen with all necessary appliances' },
      ]
    },
    de: {
      title: 'Über MV Brilliant Apartment',
      text: 'Willkommen im MV Brilliant – Ihrem gemütlichen Zuhause in der Ferne. Das Apartment bietet modernen Komfort in bester Lage mit schnellem Zugang zum Strand und den Hauptattraktionen.',
      highlights: [
        { title: 'Kapazität', desc: 'Bis zu 5 Gäste' },
        { title: 'Schlafzimmer', desc: 'Komfortables Schlafzimmer + Schlafsofa' },
        { title: 'Badezimmer', desc: 'Modernes einfaches Bad' },
        { title: 'Schnelles WLAN', desc: 'Kostenloses Highspeed-Internet' },
        { title: 'Smart-TV', desc: 'Fernseher mit Kabel und Streaming' },
        { title: 'Voll ausgestattet', desc: 'Küche mit allen notwendigen Geräten' },
      ]
    }
  };

  const currentContent = content[lang] || content.bg;

  const icons = [
    <Users size={28} key="users" />,
    <Bed size={28} key="bed" />,
    <Bath size={28} key="bath" />,
    <Wifi size={28} key="wifi" />,
    <Tv size={28} key="tv" />,
    <Coffee size={28} key="coffee" />
  ];

  return (
    <section id="about" className={styles['about-section']}>
      <div className={styles['about-container']}>
        <div className={styles['about-header']}>
          <h2>{currentContent.title}</h2>
          <p>{currentContent.text}</p>
        </div>

        <div className={styles['highlights-grid']}>
          {currentContent.highlights.map((item, index) => (
            <div key={index} className={styles['highlight-card']}>
              <div className={styles['highlight-icon']}>{icons[index]}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}