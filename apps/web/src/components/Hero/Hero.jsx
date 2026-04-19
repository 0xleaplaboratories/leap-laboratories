import Image from "next/image";
import { getJSONContent } from "@/lib/content.shared";
import HeroAuthCard from "./HeroAuthCard";
import HeroHeadline from "./HeroHeadline";
import styles from "./Hero.module.css";

/**
 * Hero: Async Server Component that fetches data and renders the base layout.
 * Interactive logic is delegated to HeroAuthCard (Client Component).
 */
export default async function Hero() {
  // Fetch hero data using the shared content utility
  const heroData = await getJSONContent("hero/hero");
  if (!heroData) return null;

  const { head, apps } = heroData;

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroContainer}>
        {/* ── HORIZONTAL ZONE ────────────────── */}
        <div className={styles.heroMain}>
          
          {/* Headline on Left */}
          <div className={styles.headlineWrapper}>
            <HeroHeadline phrases={head.tagline} />
          </div>

          {/* Auth Card on Right */}
          <div className={styles.authWrapper}>
            <HeroAuthCard apps={apps} />
          </div>

        </div>
      </div>
    </section>
  );
}
