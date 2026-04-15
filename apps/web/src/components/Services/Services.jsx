// ─── NO 'use client' here ─────────────────────────────────────
// Server Component: can use async/await directly.
// Cannot use useState, useEffect, or event handlers.

import { getJSONContent } from '@/lib/content.shared';
import ServicesExplorer from './ServicesExplorer';
import styles from './Services.module.css';

export default async function Services() {
  // Fetch the services tree data from lib/contents/services/services.json
  // getJSONContent returns null if the file is missing — handle that below.
  const data = await getJSONContent('services/services');

  // Graceful null guard: if services.json is missing or unreadable,
  // render nothing rather than crash the page.
  if (!data) return null;

  return (
    // The section element provides the scroll anchor target (#services)
    // and the outer padding/background for the section.
    <section id="services" className={styles.section}>

      {/* Section header */}
      <div className={styles.header}>
        <p className={styles.subtitle}>Our Services</p>
      </div>

      {/* The interactive explorer — receives the services array as a prop */}
      {/* ServicesExplorer is 'use client' and owns all interactive state */}
      <ServicesExplorer services={data.services} />
    </section>
  );
}
