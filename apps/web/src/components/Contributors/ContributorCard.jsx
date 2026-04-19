'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Contributors.module.css';

/**
 * SOCIAL_ICON_MAP
 * Maps platform keys from the JSON to SVG icon paths and labels.
 * If a platform key is not here, it won't be rendered.
 */
const SOCIAL_ICON_MAP = {
  github: {
    label: 'GitHub',
    icon: '/assets/icons/social/github.svg'
  },
  linkedin: {
    label: 'LinkedIn',
    icon: '/assets/icons/social/linkedin.svg'
  },
  twitter: {
    label: 'Twitter',
    icon: '/assets/icons/social/twitter.svg'
  },
  instagram: {
    label: 'Instagram',
    icon: '/assets/icons/social/instagram.svg'
  },
  tiktok: {
    label: 'TikTok',
    icon: '/assets/icons/social/tiktok.svg'
  }
};

const PLACEHOLDER_PHOTO = '/assets/images/persons/placeholder.png';

export default function ContributorCard({ profile }) {
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Check if image is already broken on mount (e.g. on refresh)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (imgRef.current && imgRef.current.complete) {
        if (imgRef.current.naturalWidth === 0) {
          setHasError(true);
        }
      }
    }, 50); // Small delay to allow browser evaluation

    return () => clearTimeout(timer);
  }, []);

  const isPlaceholder = !profile.photo || hasError;
  const finalSrc = isPlaceholder ? PLACEHOLDER_PHOTO : profile.photo;

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  const hasSocialMedia = profile.socialMedia && Object.keys(profile.socialMedia).length > 0;

  return (
    <article className={styles.card}>
      {/* ── Photo ──────────────────────────────────────────── */}
      <div className={styles.cardPhoto}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          key={finalSrc}
          src={finalSrc}
          alt={`Photo of ${profile.name}`}
          className={`${styles.cardImg} ${isPlaceholder ? styles.imgPlaceholder : ''}`}
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{profile.name}</h3>

        {/* Expertise tags */}
        <div className={styles.cardExpertise}>
          {profile.expertise.map((skill, index) => (
            <span key={index} className={styles.tag}>
              {skill}
            </span>
          ))}
        </div>

        {/* Social Media links */}
        {hasSocialMedia && (
          <div className={styles.cardSocial}>
            {Object.entries(profile.socialMedia).map(([platform, url]) => {
              const info = SOCIAL_ICON_MAP[platform];
              if (!info) return null;

              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={`${profile.name} on ${info.label}`}
                >
                  <Image
                    src={info.icon}
                    alt={info.label}
                    width={20}
                    height={20}
                    className={styles.socialIcon}
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
