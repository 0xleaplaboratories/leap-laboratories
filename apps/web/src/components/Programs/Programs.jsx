import { getJSONContent } from "@/lib/content.server";
import ProgramsExplorer from "./ProgramsExplorer";
import styles from "./Programs.module.css";

export default async function Programs() {
  const data = await getJSONContent("programs/programs");

  if (!data) return null;

  return (
    <section id="programs" className={styles.section}>
      <div className={styles.header}>
        <p className={styles.subtitle}>Our Programs</p>
      </div>
      <ProgramsExplorer programs={data.programs} />
    </section>
  );
}
