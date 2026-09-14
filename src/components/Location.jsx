import { MapPin, Navigation, Compass } from 'lucide-react';
import { useLanguage } from '../App.jsx';
import styles from './Location.module.css';

export default function Location() {
  const { lang } = useLanguage();

  const translations = {
    bg: {
      title: "Отлична Локация",
      subtitle: "MV Brilliant Apartment се намира в един от най-удобните и приятни райони на Варна",
      addressTitle: "Адрес",
      addressText: "гр. Варна, район Чаталджа / Генерали",
      nearbyTitle: "Какво има наблизо?",
      googleMapsBtn: "Отвори упътване в Google Maps",
      places: [
        { name: "Морска градина & Плаж", distance: "10 мин пеша" },
        { name: "Център / Пешеходна зона", distance: "12 мин пеша" },
        { name: "Ресторанти и кафенета", distance: "2-5 мин пеша" },
        { name: "Супермаркет & Пазар", distance: "3 мин пеша" },
      ]
    },
    en: {
      title: "Prime Location",
      subtitle: "MV Brilliant Apartment is situated in one of the most convenient and pleasant areas of Varna",
      addressTitle: "Address",
      addressText: "Varna, Chataldzha / Generali area",
      nearbyTitle: "What's nearby?",
      googleMapsBtn: "Get directions on Google Maps",
      places: [
        { name: "Sea Garden & Beach", distance: "10 min walk" },
        { name: "City Center / Pedestrian Zone", distance: "12 min walk" },
        { name: "Restaurants & Cafes", distance: "2-5 min walk" },
        { name: "Supermarket & Local Market", distance: "3 min walk" },
      ]
    },
    de: {
      title: "Ausgezeichnetе Lage",
      subtitle: "MV Brilliant Apartment befindet sich in einer der bequemsten und angenehmsten Gegenden von Varna",
      addressTitle: "Adresse",
      addressText: "Varna, Bezirk Chataldzha / Generali",
      nearbyTitle: "Was ist in der Nähe?",
      googleMapsBtn: "Route in Google Maps öffnen",
      places: [
        { name: "Meeresgarten & Strand", distance: "10 Min. zu Fuß" },
        { name: "Zentrum / Fußgängerzone", distance: "12 Min. zu Fuß" },
        { name: "Restaurants & Cafés", distance: "2-5 Min. zu Fuß" },
        { name: "Supermarkt & Markt", distance: "3 Min. zu Fuß" },
      ]
    }
  };

  const t = translations[lang] || translations.bg;

  return (
    <section id="location" className={styles['location-section']}>
      <div className={styles['location-container']}>
        <div className={styles['location-header']}>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className={styles['location-content']}>
          <div className={styles['location-info']}>
            <div className={styles['address-card']}>
              <MapPin size={24} className={styles.icon} />
              <div>
                <h3>{t.addressTitle}</h3>
                <p>{t.addressText}</p>
              </div>
            </div>

            <div className={styles['nearby-box']}>
              <h3><Compass size={20} /> {t.nearbyTitle}</h3>
              <ul>
                {t.places.map((place, idx) => (
                  <li key={idx}>
                    <span>{place.name}</span>
                    <span className={styles.badge}>{place.distance}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://www.google.com/maps/place/MV-Brilliant+apartment/@43.217029,27.9169029,17z/data=!3m1!4b1!4m6!3m5!1s0x40a455001052c4c7:0x4333f959eaef01b1!8m2!3d43.2170251!4d27.9194778!16s%2Fg%2F11x0znl9d0?entry=ttu&g_ep=EgoyMDI2MDgxMC4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles['btn-directions']}
            >
              <Navigation size={18} />
              <span>{t.googleMapsBtn}</span>
            </a>
          </div>

          <div className={styles['map-wrapper']}>
            <iframe
              title="MV Brilliant Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2907.5752943183536!2d27.92211907663989!3d43.21319228113426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a454796791444d%3A0xb3634e32d677d242!2z0YDQtdGB0YLQvtGA0LDQvdGCINCh0LXQstCw0YHRgtC-0L_QvtC7!5e0!3m2!1sbg!2sbg!4v1710000000000!5m2!1sbg!2sbg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}