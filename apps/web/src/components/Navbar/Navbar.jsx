'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getJSONContent } from '@/lib/content.server';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    async function loadContent() {
      const data = await getJSONContent('navbar/navbar');
      setContent(data);
    }
    loadContent();
  }, []);

  useEffect(() => {
    let idleTimer;

    if (isMobileMenuOpen) {
      setIsVisible(true);
      return;
    }

    const hideNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > window.innerHeight * 0.5) {
        setIsVisible(false);
      }
    };

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(hideNavbar, 2000);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const homeThreshold = window.innerHeight * 0.5;

      if (currentScrollY < homeThreshold) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        resetIdleTimer();
        return;
      }

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } 
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      resetIdleTimer();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (window.scrollY < window.innerHeight * 0.5) {
      setIsVisible(true);
    }
    resetIdleTimer();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [lastScrollY, isMobileMenuOpen]);

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
    if (pathname === '/') {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('leap:focus-auth'));
    }
    closeMenu();
  };

  const handleLogoClick = (e) => {
    if (pathname === '/') {
      e.preventDefault();
      const targetId = brand?.href?.split('#')[1];
      const targetElement = targetId ? document.getElementById(targetId) : null;

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      window.history.pushState(null, '', '/');
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
        <div className={styles.navbar__logo}>
          <Link 
            href={brand.href} 
            aria-label={`${brand.name} home`}
            onClick={handleLogoClick}
          >
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

        <div className={styles.navbar__actions}>
          <Link 
            href={actions.login.href} 
            className={styles['navbar__login-btn']}
            onClick={handleAuthClick}
          >
            {actions.login.label}
          </Link>
        </div>

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
