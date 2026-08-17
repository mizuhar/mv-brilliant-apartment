import { useState } from "react";
import styles from "./Gallery.module.css";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const processNumbers = (nummbers) => {
  return nummbers.filter((num) => num % 2 === 0).map((num) => num * 2);
};
console.log(processNumbers([1, 2, 3, 4, 5, 6]))

  const photos = [
    {
      id: 1,
      category: "living-room",
      title: "Всекидневна",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      category: "bedroom",
      title: "Основна спалня",
      url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      category: "kitchen",
      title: "Кухненски бокс",
      url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      category: "bathroom",
      title: "Баня и тоалетна",
      url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 5,
      category: "living-room",
      title: "Зона за релакс",
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 6,
      category: "balcony",
      title: "Балкон",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
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
              <img src={photo.url} alt={photo.title} loading="lazy" />
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
