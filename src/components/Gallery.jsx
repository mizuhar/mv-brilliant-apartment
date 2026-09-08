import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { galleryCategories } from "../data/galleryData";
import styles from "./Gallery.module.css";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [index, setIndex] = useState(-1);

  // Намираме текущо избраната категория от galleryCategories
  const currentCategoryObj =
    galleryCategories.find((cat) => cat.id === selectedCategory) ||
    galleryCategories[0];

  const currentImages = currentCategoryObj.images;

  return (
    <section id="gallery" className={styles["gallery-section"]}>
      <div className={styles["gallery-container"]}>
        <div className={styles["gallery-header"]}>
          <h2>Галерия</h2>
          <p>Разгледайте уюта и модерния интериор на MV Brilliant Apartment</p>
        </div>

        {/* Динамични бутони според категориите в galleryData.js */}
        <div className={styles["filter-buttons"]}>
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles["filter-btn"]} ${
                selectedCategory === cat.id ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Мрежа от снимки */}
        <div className={styles["gallery-grid"]}>
          {currentImages.map((photo, idx) => (
            <div
              key={idx}
              className={styles["gallery-card"]}
              style={{ cursor: "pointer" }}
              onClick={() => setIndex(idx)}
            >
              <img src={photo.src} alt={photo.title} loading="lazy" />
              <div className={styles.overlay}>
                <span>{photo.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox за преглед на цял екран */}
        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={currentImages.map((img) => ({
            src: img.src,
            title: img.title,
          }))}
        />
      </div>
    </section>
  );
}