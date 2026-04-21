import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Programs from '@/components/Programs/Programs';
import HomeSection from '@/components/Home/Home';
import Contributors from '@/components/Contributors/Contributors';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.pageWrapper}> 
      <Navbar />
      <HomeSection />
      <Hero />
      <Programs />
      <Contributors />
      <section id="contact" className={`${styles.section} ${styles.bgSecondary}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <p className={styles.sectionText}>Get in touch with us.</p>
        </div>
      </section>
    </main>
  );
}
