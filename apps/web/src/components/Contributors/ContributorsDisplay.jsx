'use client';

import { useState } from 'react';
import ContributorCard from './ContributorCard';
import styles from './Contributors.module.css';

export default function ContributorsDisplay({ title, tagline, profiles }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className={styles.section} id="contributors">
      <div className={styles.wrapper}>
        <div className={styles.desktopLayout}>
          <div className={styles.leftZone}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.tagline}>{tagline}</p>
          </div>

          <div className={styles.rightZone}>
            {profiles.map((profile, index) => (
              <div key={index} className={styles.cardWrapper}>
                <ContributorCard profile={profile} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mobileLayout}>
          <div className={styles.mobileHeader}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.tagline}>{tagline}</p>
          </div>

          <div className={styles.carouselWrapper}>
            <button 
              className={styles.navButton} 
              onClick={goToPrev}
              aria-label="Previous contributor"
            >
              ‹
            </button>

            <div className={styles.carouselViewport}>
              {profiles.map((profile, index) => (
                <div 
                  key={index} 
                  className={`${styles.carouselSlide} ${index === currentIndex ? styles.carouselSlideActive : ''}`}
                >
                  <ContributorCard profile={profile} />
                </div>
              ))}
            </div>

            <button 
              className={styles.navButton} 
              onClick={goToNext}
              aria-label="Next contributor"
            >
              ›
            </button>
          </div>

          <div className={styles.dotIndicators}>
            {profiles.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to contributor ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
