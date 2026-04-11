'use client';

import { useState, useEffect } from 'react';
import styles from './Hero.module.css';

/**
 * HeroHeadline: Cycles through phrases with a typewriting effect.
 * Handles specialized styling for {?} and </> markers.
 */
export default function HeroHeadline({ phrases }) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const currentFullPhrase = phrases[currentPhraseIndex];

  useEffect(() => {
    let timeout;

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing phase
        const nextText = currentFullPhrase.substring(0, displayText.length + 1);
        setDisplayText(nextText);
        setTypingSpeed(100);

        if (nextText === currentFullPhrase) {
          // Pause at the end of the phrase
          timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else {
          timeout = setTimeout(handleTyping, typingSpeed);
        }
      } else {
        // Deleting phase
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

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phrases, currentPhraseIndex, currentFullPhrase, typingSpeed]);

  /**
   * helper to render themed spans for special markers
   */
  const renderThemedText = (text) => {
    // Force line breaks for each word
    const stackedText = text.replaceAll(' ', '\n');
    
    const isAcademy = stackedText.startsWith('{?}');
    const isLabs = stackedText.startsWith('</>');

    if (isAcademy || isLabs) {
      const lines = stackedText.split('\n');
      const firstLine = lines[0];
      const rest = stackedText.substring(firstLine.length);
      
      return (
        <>
          <span className={isAcademy ? styles.titleLearn : styles.titleBuild}>
            {firstLine}
          </span>
          {rest}
        </>
      );
    }

    return stackedText;
  };

  return (
    <div className={styles.headlineContainer}>
      <h1 className={styles.heroTitleAnimated}>
        {renderThemedText(displayText)}
        <span className={styles.cursor}>|</span>
      </h1>
    </div>
  );
}
