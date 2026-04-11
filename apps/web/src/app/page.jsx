import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.pageWrapper}>
      <Navbar />
      
      <Hero />

      <section id="articles" className={`${styles.section} ${styles.bgSecondary}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Articles</h2>
          <p className={styles.sectionText}>Discover our latest research and insights.</p>
        </div>
      </section>

      <section id="gallery" className={`${styles.section} ${styles.bgPrimary}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Gallery</h2>
          <p className={styles.sectionText}>A visual journey through our projects.</p>
        </div>
      </section>

      <section id="contact" className={`${styles.section} ${styles.bgSecondary}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <p className={styles.sectionText}>Get in touch with us.</p>
        </div>
      </section>
    </main>
  );
}
