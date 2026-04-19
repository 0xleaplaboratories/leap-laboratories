import { getJSONContent } from "@/lib/content.shared";
import styles from "./Home.module.css";

export default async function HomeSection() {
  const content = await getJSONContent("home/home");
  if (!content) return null;

  const { headline, description, background } = content;

  return (
    <section id="home-intro" className={styles.home}>
      {/* Dynamic Branding Background */}
      {background && (
        <div 
          className={styles.background} 
          style={{ backgroundImage: `url(/${background})` }}
        />
      )}

      <div className={styles.container}>
        {/* Subtle "We are" pin */}
        <div className={styles.badge}>
          <span>We are</span>
        </div>

        {/* Large Maximalist Headline */}
        <h2 className={styles.headline}>
          {headline}
        </h2>

        {/* Balanced Description */}
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
