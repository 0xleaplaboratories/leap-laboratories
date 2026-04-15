'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getJSONContent } from '@/lib/content.shared';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    async function loadContent() {
      const data = await getJSONContent('navbar/navbar');
      setContent(data);
    }
    loadContent();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = (e) => {
    // If we're on the home page, prevent routing and focus the hero card
    if (pathname === '/') {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('leap:focus-auth'));
    }
    setIsMobileMenuOpen(false);
  };

  if (!content) return null;

  const { brand, navLinks, actions } = content;

  return (
    <header className={styles.navbar}>
      <div className={styles.navbar__container}>

        {/* ── LEFT ZONE: Logo ────────────────────────────────── */}
        <div className={styles.navbar__logo}>
          <Link href={brand.href} aria-label={`${brand.name} home`}>
            <Image
              src={`/${brand.logo}`}
              alt={brand.name}
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
            {navLinks.map((link) => (
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
          <Link 
            href={actions.login.href} 
            className={styles['navbar__login-btn']}
            onClick={handleAuthClick}
          >
            {actions.login.label}
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
          {navLinks.map((link) => (
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
            <Link 
              href={actions.login.href} 
              className={`${styles['navbar__login-btn']} ${styles['navbar__login-btn--mobile']}`}
              onClick={handleAuthClick}
            >
              {actions.login.label}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
