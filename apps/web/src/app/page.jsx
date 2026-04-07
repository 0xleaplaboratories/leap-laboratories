import Navbar from '@/components/Navbar/Navbar';

export default function Home() {
  return (
    <main className="page-wrapper">
      <Navbar />
      
      <section id="hero" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-3xl)', textAlign: 'center' }}>
            Welcome to Leap Laboratories
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xl)', textAlign: 'center', marginTop: 'var(--space-md)' }}>
            Empowering innovation through learning and research.
          </p>
        </div>
      </section>

      <section id="articles" style={{ padding: 'var(--space-3xl) 0', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <h2 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-2xl)' }}>Articles</h2>
          <p style={{ marginTop: 'var(--space-md)' }}>Discover our latest research and insights.</p>
        </div>
      </section>

      <section id="gallery" style={{ padding: 'var(--space-3xl) 0', background: 'var(--color-bg-primary)' }}>
        <div className="container">
          <h2 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-2xl)' }}>Gallery</h2>
          <p style={{ marginTop: 'var(--space-md)' }}>A visual journey through our projects.</p>
        </div>
      </section>

      <section id="contact" style={{ padding: 'var(--space-3xl) 0', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <h2 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-2xl)' }}>Contact</h2>
          <p style={{ marginTop: 'var(--space-md)' }}>Get in touch with us.</p>
        </div>
      </section>
    </main>
  );
}
