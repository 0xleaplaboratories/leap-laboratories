'use client';

import { useState } from 'react';
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
  }
};

const PLACEHOLDER_PHOTO = '/assets/images/persons/placeholder.png';

export default function ContributorCard({ profile }) {
  // Local state for photo fallback
  const [photoSrc, setPhotoSrc] = useState(profile.photo || PLACEHOLDER_PHOTO);

  const handleImageError = () => {
    if (photoSrc !== PLACEHOLDER_PHOTO) {
      setPhotoSrc(PLACEHOLDER_PHOTO);
    }
  };

  const hasSocialMedia = profile.socialMedia && Object.keys(profile.socialMedia).length > 0;

  return (
    <article className={styles.card}>
      {/* ── Photo ──────────────────────────────────────────── */}
      <div className={styles.cardPhoto}>
        <Image
          src={photoSrc}
          alt={`Photo of ${profile.name}`}
          width={400}
          height={400}
          className={styles.cardImg}
          onError={handleImageError}
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
