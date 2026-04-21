import { getJSONContent } from '@/lib/content.server';
import ProgramsExplorer from './ProgramsExplorer';
import styles from './Programs.module.css';

function SectionHeader({ title }) {
  return (
    <header className={styles.header}>
      <h2 className={styles.subtitle}>{title}</h2>
    </header>
  );
}

function ErrorBoundary({ message }) {
  return (
    <div className={styles.container}>
      <p>{message}</p>
    </div>
  );
}

export default async function Programs() {
  const data = await getJSONContent('programs/programs');
  const programsArray = data?.programs || null;

  return (
    <section className={styles.section} id="programs" aria-labelledby="programs-title">
      <SectionHeader title="Curriculum Stage" />
      
      {!programsArray ? (
        <ErrorBoundary message="Failed to load laboratory programs." />
      ) : (
        <ProgramsExplorer programs={programsArray} />
      )}
    </section>
  );
}

