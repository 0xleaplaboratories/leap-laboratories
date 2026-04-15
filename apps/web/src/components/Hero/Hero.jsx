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
        {/* ── LEFT ZONE: Copy & Interaction ─────────────────── */}
        <div className={styles.heroLeft}>
          <div className={styles.heroHeadlineWrapper}>
            {/* Logo Container (Left Aligned) */}
            <div className={styles.logoContainer}>
              <Image
                src={`/${head.logo}`}
                alt="Leap Laboratories Icon"
                width={128}
                height={128}
                className={styles.heroLogo}
                priority
              />
            </div>

            {/* Dynamic Typewriting Headline (Right Aligned) */}
            <HeroHeadline phrases={head.tagline} />
          </div>

          {/* Interactive Auth Card (Client Side) */}
          <HeroAuthCard apps={apps} />
        </div>

        {/* ── RIGHT ZONE: Full-bleed Visual ─────────────────── */}
        <div className={styles.heroRight}>
          <video
            className={styles.heroVideo}
            src="/assets/videos/video.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Fallback/Overlay for the visual zone */}
          <div className={styles.heroOverlay} />
        </div>
      </div>
    </section>
  );
}
