'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';

// The four center navigation links.
// Each item scrolls to a section on the same page via an anchor href.
const NAV_LINKS = [
  { label: 'Get Started', href: '#hero' },
  { label: 'Article',     href: '#articles' },
  { label: 'Gallery',     href: '#gallery' },
  { label: 'Contact',     href: '#contact' },
];

export default function Navbar() {
  // Controls whether the mobile drawer is open or closed.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close the mobile menu when a link is clicked (UX improvement).
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbar__container}>

        {/* ── LEFT ZONE: Logo ────────────────────────────────── */}
        <div className={styles.navbar__logo}>
          <Link href="/" aria-label="Leap Laboratories home">
            <Image
              src="/assets/images/logo.png"
              alt="Leap Laboratories"
              width={1920}
              height={1080}
              className={styles['navbar__logo-img']}
              priority
            />
          </Link>
        </div>

        {/* ── CENTER ZONE: Navigation links (desktop) ────────── */}
        <nav className={styles.navbar__nav} aria-label="Main navigation">
          <ul className={styles['navbar__nav-list']}>
            {NAV_LINKS.map((link) => (
              <li key={link.href} className={styles['navbar__nav-item']}>
                <a
                  href={link.href}
                  className={styles['navbar__nav-link']}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── RIGHT ZONE: Login button (desktop) ─────────────── */}
        <div className={styles.navbar__actions}>
          <Link href="/login" className={styles['navbar__login-btn']}>
            Come Join Us
          </Link>
        </div>

        {/* ── MOBILE: Hamburger toggle ────────────────────────── */}
        <button
          className={styles.navbar__hamburger}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {/* Renders ☰ when closed, ✕ when open */}
          <span className={styles['navbar__hamburger-icon']}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* ── MOBILE: Dropdown drawer ─────────────────────────── */}
      <div
        id="mobile-menu"
        className={`${styles['navbar__mobile-menu']} ${isMobileMenuOpen ? styles['navbar__mobile-menu--open'] : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <ul className={styles['navbar__mobile-list']}>
          {NAV_LINKS.map((link) => (
            <li key={link.href} className={styles['navbar__mobile-item']}>
              <a
                href={link.href}
                className={styles['navbar__mobile-link']}
                onClick={handleLinkClick}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className={styles['navbar__mobile-item']}>
            <Link href="/login" className={`${styles['navbar__login-btn']} ${styles['navbar__login-btn--mobile']}`}>
              Come Join Us
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
