import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { galleryCategories } from "../data/galleryData";
import { useLanguage } from "../App.jsx";
import styles from "./Gallery.module.css";

export default function Gallery() {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [index, setIndex] = useState(-1);

  const translations = {
    bg: {
      title: "Галерия",
      subtitle:
        "Разгледайте уюта и модерния интериор на MV Brilliant Apartment",
      categories: {
        all: "Всички",
        living: "Всекидневна",
        "living-room": "Всекидневна",
        vsekidnevna: "Всекидневна",
        bedroom: "Спалня",
        kitchen: "Кухня",
        bathroom: "Баня",
        corridor: "Коридор",
        entrance: "Вход",
        Entrance: "Вход",
        vhod: "Вход",
        balcony: "Балкон",
        Всекидневна: "Всекидневна",
        Вход: "Вход",
      },
      photoTitles: {
        // Кратки наименования
        Всекидневна: "Всекидневна",
        Спалня: "Спалня",
        Кухня: "Кухня",
        Баня: "Баня",
        Коридор: "Коридор",
        Вход: "Вход",
        Балкон: "Балкон",
        Удобства: "Удобства",
        // Разширени заглавия от под-галериите
        "Просторен дневен тракт": "Просторен дневен тракт",
        "Уютна спалня": "Уютна спалня",
        "Оборудвана кухня": "Оборудвана кухня",
        "Модерна баня": "Модерна баня",
      },
    },
    en: {
      title: "Gallery",
      subtitle:
        "Explore the comfort and modern interior of MV Brilliant Apartment",
      categories: {
        all: "All",
        living: "Living Room",
        "living-room": "Living Room",
        vsekidnevna: "Living Room",
        bedroom: "Bedroom",
        kitchen: "Kitchen",
        bathroom: "Bathroom",
        corridor: "Hallway",
        entrance: "Entrance",
        Entrance: "Entrance",
        vhod: "Entrance",
        balcony: "Balcony",
        Всекидневна: "Living Room",
        Вход: "Entrance",
      },
      photoTitles: {
        // Кратки наименования
        Всекидневна: "Living Room",
        Спалня: "Bedroom",
        Кухня: "Kitchen",
        Баня: "Bathroom",
        Коридор: "Hallway",
        Вход: "Entrance",
        Балкон: "Balcony",
        Удобства: "Amenities",
        // Разширени заглавия от под-галериите
        "Просторен дневен тракт": "Spacious Living Area",
        "Уютна спалня": "Cozy Bedroom",
        "Оборудвана кухня": "Fully Equipped Kitchen",
        "Модерна баня": "Modern Bathroom",
      },
    },
    de: {
      title: "Galerie",
      subtitle:
        "Entdecken Sie den Komfort und das moderne Interieur des MV Brilliant Apartment",
      categories: {
        all: "Alle",
        living: "Wohnzimmer",
        "living-room": "Wohnzimmer",
        vsekidnevna: "Wohnzimmer",
        bedroom: "Schlafzimmer",
        kitchen: "Küche",
        bathroom: "Badezimmer",
        corridor: "Flur",
        entrance: "Eingang",
        Entrance: "Eingang",
        vhod: "Eingang",
        balcony: "Balkon",
        Всекидневна: "Wohnzimmer",
        Вход: "Eingang",
      },
      photoTitles: {
        // Кратки наименования
        Всекидневна: "Wohnzimmer",
        Спалня: "Schlafzimmer",
        Кухня: "Küche",
        Баня: "Badezimmer",
        Коридор: "Flur",
        Вход: "Eingang",
        Балкон: "Balkon",
        Удобства: "Annehmlichkeiten",
        // Разширени заглавия от под-галериите
        "Просторен дневен тракт": "Geräumiger Wohnbereich",
        "Уютна спалня": "Gemütliches Schlafzimmer",
        "Оборудвана кухня": "Voll ausgestattete Küche",
        "Модерна баня": "Modernes Badezimmer",
      },
    },
  };

  const t = translations[lang] || translations.bg;

  const currentCategoryObj =
    galleryCategories.find((cat) => cat.id === selectedCategory) ||
    galleryCategories[0];

  const currentImages = currentCategoryObj.images;

  const getTranslatedTitle = (originalTitle) => {
    return t.photoTitles[originalTitle] || originalTitle;
  };

  const getCategoryLabel = (cat) => {
    return t.categories[cat.id] || t.categories[cat.title] || cat.title;
  };

  return (
    <section id="gallery" className={styles["gallery-section"]}>
      <div className={styles["gallery-container"]}>
        <div className={styles["gallery-header"]}>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        {/* Динамични бутони с пълен покриващ превод */}
        <div className={styles["filter-buttons"]}>
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles["filter-btn"]} ${
                selectedCategory === cat.id ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Мрежа от снимки */}
        <div className={styles["gallery-grid"]}>
          {currentImages.map((photo, idx) => {
            const translatedTitle = getTranslatedTitle(photo.title);
            return (
              <div
                key={idx}
                className={styles["gallery-card"]}
                style={{ cursor: "pointer" }}
                onClick={() => setIndex(idx)}
              >
                <img src={photo.src} alt={translatedTitle} loading="lazy" />
                <div className={styles.overlay}>
                  <span>{translatedTitle}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox */}
        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 50,
          }}
          slides={currentImages.map((img) => ({
            src: img.src,
            title: getTranslatedTitle(img.title),
          }))}
        />
      </div>
    </section>
  );
}