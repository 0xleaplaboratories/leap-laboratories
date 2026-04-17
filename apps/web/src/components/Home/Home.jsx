import { getJSONContent } from "@/lib/content.shared";
import styles from "./Home.module.css";

export default async function HomeSection() {
  const content = await getJSONContent("home/home");
  if (!content) return null;

  return (
    <section id="home-intro" className={styles.home}>
      <div className={styles.container}>
        {/* Subtle "We are" pin */}
        <div className={styles.badge}>
          <span>We are</span>
        </div>

        {/* Large Maximalist Headline */}
        <h2 className={styles.headline}>
          {content.headline}
        </h2>

        {/* Balanced Description */}
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>
            {content.description}
          </p>
        </div>
      </div>
    </section>
  );
}
