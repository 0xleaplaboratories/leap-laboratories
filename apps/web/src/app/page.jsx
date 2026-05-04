import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Programs from '@/components/Programs/Programs';
import HomeSection from '@/components/Home/Home';
import Contributors from '@/components/Contributors/Contributors';
import Contact from '@/components/Contact/Contact';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.pageWrapper}> 
      <Navbar />
      <HomeSection />
      <Hero />
      <Programs />
      <Contributors />
      <Contact />
    </main>
  );
}
