import { getJSONContent } from "@/lib/content.server";
import styles from "./Home.module.css";

export default async function HomeSection() {
  const content = await getJSONContent("home/home");
  if (!content) return null;

  const { headline, description, background } = content;

  return (
    <section id="home-intro" className={styles.home}>
      {background && (
        <div 
          className={styles.background} 
          style={{ backgroundImage: `url(/${background})` }}
        />
      )}

      <div className={styles.container}>
        <div className={styles.badge}>
          <span>We are</span>
        </div>

        <h2 className={styles.headline}>
          {headline}
        </h2>

        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
