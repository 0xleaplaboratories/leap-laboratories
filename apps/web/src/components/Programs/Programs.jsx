// ─── NO 'use client' here ─────────────────────────────────────
// Server Component: can use async/await directly.
// Cannot use useState, useEffect, or event handlers.

import { getJSONContent } from "@/lib/content.shared";
import ProgramsExplorer from "./ProgramsExplorer";
import styles from "./Programs.module.css";

export default async function Programs() {
  // Fetch the programs tree data from lib/contents/programs/programs.json
  // getJSONContent returns null if the file is missing — handle that below.
  const data = await getJSONContent("programs/programs");

  // Graceful null guard: if programs.json is missing or unreadable,
  // render nothing rather than crash the page.
  if (!data) return null;

  return (
    // The section element provides the scroll anchor target (#programs)
    // and the outer padding/background for the section.
    <section id="programs" className={styles.section}>
      {/* Section header */}
      <div className={styles.header}>
        <p className={styles.subtitle}>Our Programs</p>
      </div>

      {/* The interactive explorer — receives the programs array as a prop */}
      {/* ProgramsExplorer is 'use client' and owns all interactive state */}
      <ProgramsExplorer programs={data.programs} />
    </section>
  );
}
