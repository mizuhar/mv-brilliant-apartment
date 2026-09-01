import { useState } from "react";
import styles from "./Gallery.module.css";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const photos = [
    {
      id: 1,
      category: "living-room",
      title: "Всекидневна",
      alt: "Просторна всекидневна с мека мебел в MV Brilliant Apartment Варна Чаталджа",
      url: "/images/chataldja-apartment-living-room.jpg",
    },
    {
      id: 2,
      category: "bedroom",
      title: "Основна спалня",
      alt: "Уютна спалня с двойно легло в апартамент под наем Варна",
      url: "/images/mv-brilliant-bedroom.jpg",
    },
    {
      id: 3,
      category: "kitchen",
      title: "Кухненски бокс",
      alt: "Модерно оборудвана кухня с уреди в MV Brilliant Apartment",
      url: "/images/mv-brilliant-kitchen6.jpg",
    },
    {
      id: 4,
      category: "bathroom",
      title: "Баня и тоалетна",
      alt: "Чиста и модерна баня в апартамент за нощувки Варна",
      url: "/images/mv-brilliant-bathroom5.jpg",
    },
    {
      id: 5,
      category: "living-room",
      title: "Зона за релакс",
      alt: "Кът за почивка с телевизор в MV Brilliant Apartment Чаталджа",
      url: "/images/mv-brilliant-livingroom2.jpg",
    },
    {
      id: 6,
      category: "balcony",
      title: "Антре",
      alt: "Слънчева тераса на апартамент под наем район Чаталджа Варна",
      url: "/images/mv-brilliant-corridor.jpg",
    },
  ];

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  return (
    <section id="gallery" className={styles["gallery-section"]}>
      <div className={styles["gallery-container"]}>
        <div className={styles["gallery-header"]}>
          <h2>Галерия</h2>
          <p>Разгледайте уюта и модерния интериор на MV Brilliant Apartment</p>
        </div>

        <div className={styles["filter-buttons"]}>
          <button
            className={`${styles["filter-btn"]} ${selectedCategory === "all" ? styles.active : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            Всички
          </button>
          <button
            className={`${styles["filter-btn"]} ${selectedCategory === "living-room" ? styles.active : ""}`}
            onClick={() => setSelectedCategory("living-room")}
          >
            Всекидневна
          </button>
          <button
            className={`${styles["filter-btn"]} ${selectedCategory === "bedroom" ? styles.active : ""}`}
            onClick={() => setSelectedCategory("bedroom")}
          >
            Спалня
          </button>
          <button
            className={`${styles["filter-btn"]} ${selectedCategory === "kitchen" ? styles.active : ""}`}
            onClick={() => setSelectedCategory("kitchen")}
          >
            Кухня
          </button>
        </div>

        <div className={styles["gallery-grid"]}>
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className={styles["gallery-card"]}>
              <img src={photo.url} alt={photo.alt} loading="lazy" />
              <div className={styles.overlay}>
                <span>{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}