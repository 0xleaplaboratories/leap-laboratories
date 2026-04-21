'use client';

import { useState, useEffect } from 'react';
import styles from './Hero.module.css';

export default function HeroHeadline({ phrases }) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [isMobile, setIsMobile] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const currentFullPhrase = phrases[currentPhraseIndex];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1100);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let timeout;

    if (isMobile) {
      const handleMobileTransition = () => {
        setIsFading(true);
        
        timeout = setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setDisplayText(phrases[(currentPhraseIndex + 1) % phrases.length]);
          setIsFading(false);
        }, 500);
      };

      if (displayText === '') setDisplayText(phrases[0]);

      timeout = setTimeout(handleMobileTransition, 3000);
    } else {
      const handleTyping = () => {
        if (!isDeleting) {
          const nextText = currentFullPhrase.substring(0, displayText.length + 1);
          setDisplayText(nextText);
          setTypingSpeed(100);

          if (nextText === currentFullPhrase) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
          } else {
            timeout = setTimeout(handleTyping, typingSpeed);
          }
        } else {
          const nextText = currentFullPhrase.substring(0, displayText.length - 1);
          setDisplayText(nextText);
          setTypingSpeed(50);

          if (nextText === '') {
            setIsDeleting(false);
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            timeout = setTimeout(handleTyping, 500);
          } else {
            timeout = setTimeout(handleTyping, typingSpeed);
          }
        }
      };

      timeout = setTimeout(handleTyping, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phrases, currentPhraseIndex, currentFullPhrase, typingSpeed, isMobile]);

  const renderThemedText = (text) => {
    const isAcademy = text.startsWith('{?}');
    const isLabs = text.startsWith('</>');
    
    if (isAcademy || isLabs) {
      const parts = text.split(' ');
      const firstWord = parts[0];
      const rest = text.substring(firstWord.length);
      
      return (
        <>
          <span className={isAcademy ? styles.titleLearn : styles.titleBuild}>
            {firstWord}
          </span>
          {rest}
        </>
      );
    }

    return text;
  };

  return (
    <div className={`${styles.headlineContainer} ${isMobile ? styles.mobileHeadline : ''}`}>
      <h1 className={`${styles.heroTitleAnimated} ${isFading ? styles.fadeOut : ''}`}>
        {renderThemedText(displayText)}
        {!isMobile && <span className={styles.cursor}>|</span>}
      </h1>
    </div>
  );
}
