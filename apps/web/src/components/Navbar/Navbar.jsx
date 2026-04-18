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
  
  // Smart Scroll state
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    async function loadContent() {
      const data = await getJSONContent('navbar/navbar');
      setContent(data);
    }
    loadContent();
  }, []);

  // Smart Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 150; // Distance before smart hiding begins

      // Case 1: Within Home/Top zone -> Always visible
      if (currentScrollY < threshold) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Case 2: Scrolling down -> Hide
      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setIsVisible(false);
      } 
      // Case 3: Scrolling up -> Show
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  const handleAuthClick = (e) => {
    // If we're on the home page, prevent routing and focus the hero card
    if (pathname === '/') {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('leap:focus-auth'));
    }
    closeMenu();
  };

  if (!content) return null;

  const { brand, navLinks, actions } = content;

  return (
    <header 
      className={`${styles.navbar} ${!isVisible ? styles['navbar--hidden'] : ''}`}
      onClick={() => isMobileMenuOpen && closeMenu()}
    >
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
          onClick={(e) => {
            e.stopPropagation();
            toggleMobileMenu();
          }}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={styles['navbar__hamburger-icon']}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* ── MOBILE: Drawer Overlay & Menu ───────────────────── */}
      <div 
        className={`${styles.navbar__overlay} ${isMobileMenuOpen ? styles['navbar__overlay--open'] : ''}`}
        onClick={closeMenu}
      />
      
      <div
        id="mobile-menu"
        className={`${styles['navbar__mobile-menu']} ${isMobileMenuOpen ? styles['navbar__mobile-menu--open'] : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles['navbar__mobile-content']}>
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
      </div>
    </header>
  );
}
