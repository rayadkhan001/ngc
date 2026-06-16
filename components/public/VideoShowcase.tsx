'use client';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/store';
import { SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/data';
import { useScrollReveal } from '@/lib/hooks';
import styles from './VideoShowcase.module.css';

export default function VideoShowcase() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  useScrollReveal([content]);

  useEffect(() => {
    setContent(getSiteContent());

    // Listen for storage events (if edited in another tab)
    const handleStorageChange = () => {
      setContent(getSiteContent());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // If both videos are empty, do not render this section at all
  if (!content.video1 && !content.video2) return null;

  return (
    <section className="section" id="gallery">
      <div className="prism-divider" />
      <div className="container">
        <div className={styles.header}>
          <p className="section-tag reveal">Showroom Media</p>
          <h2 className="section-title reveal delay-1">Showcase in Motion</h2>
          <p className="section-subtitle reveal delay-2">
            Watch our craftsmanship and take a look at our premium glass collections.
          </p>
        </div>

        <div className={`${styles.videoGrid} ${content.video1 && content.video2 ? styles.twoCols : styles.oneCol}`}>
          {content.video1 && (
            <div className={`glass-card ${styles.videoCard} reveal-scale`}>
              <div className={styles.videoWrapper}>
                <video
                  src={content.video1}
                  controls
                  loop
                  muted
                  playsInline
                  className={styles.videoPlayer}
                />
              </div>
              {content.video1Title && (
                <div className={styles.meta}>
                  <h3 className={styles.videoTitle}>{content.video1Title}</h3>
                </div>
              )}
            </div>
          )}

          {content.video2 && (
            <div className={`glass-card ${styles.videoCard} reveal-scale delay-1`}>
              <div className={styles.videoWrapper}>
                <video
                  src={content.video2}
                  controls
                  loop
                  muted
                  playsInline
                  className={styles.videoPlayer}
                />
              </div>
              {content.video2Title && (
                <div className={styles.meta}>
                  <h3 className={styles.videoTitle}>{content.video2Title}</h3>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
