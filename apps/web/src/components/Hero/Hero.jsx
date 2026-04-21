import Image from "next/image";
import { getJSONContent } from "@/lib/content.server";
import HeroAuthCard from "./HeroAuthCard";
import HeroHeadline from "./HeroHeadline";
import styles from "./Hero.module.css";

export default async function Hero() {
  const heroData = await getJSONContent("hero/hero");
  if (!heroData) return null;

  const { head, apps } = heroData;

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroMain}>
          <div className={styles.headlineWrapper}>
            <HeroHeadline phrases={head.tagline} />
          </div>
          <div className={styles.authWrapper}>
            <HeroAuthCard apps={apps} />
          </div>
        </div>
      </div>
    </section>
  );
}
