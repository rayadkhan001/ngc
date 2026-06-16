'use client';
import { useEffect, useState } from 'react';
import ParticleCanvas from './ParticleCanvas';
import { getSiteContent } from '@/lib/store';
import { SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/data';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setContent(getSiteContent());
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="home">
      {/* Background image with overlay */}
      <div className={styles.bgImage} />
      <div className={styles.overlay} />
      <ParticleCanvas />

      {/* Decorative rings */}
      <div className={styles.ring1} />
      <div className={styles.ring2} />

      {/* Content */}
      <div className={`container ${styles.content} ${visible ? styles.visible : ''}`}>
        <div className={styles.badge}>
          <Sparkles size={12} />
          Est. ~{content.established} · Over 70 Years of Excellence
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine1}>Premium Glass</span>
          <span className={styles.titleLine2}>
            {content.tagline.split(' ').slice(0, -1).join(' ')}&nbsp;
            <span className={styles.titleAccent}>
              {content.tagline.split(' ').slice(-1)}
            </span>
          </span>
        </h1>

        <p className={styles.subtitle}>{content.heroSubtitle}</p>

        <div className={styles.actions}>
          <button
            className="btn-primary"
            onClick={() => scrollToSection('products')}
          >
            {content.heroCtaText}
            <ArrowRight size={16} />
          </button>
          <button
            className="btn-secondary"
            onClick={() => scrollToSection('order')}
          >
            {content.heroCtaSecondary}
          </button>
        </div>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          {[
            { value: '70+', label: 'Years of Experience' },
            { value: '500+', label: 'Happy Clients' },
            { value: '6+', label: 'Glass Categories' },
            { value: '100%', label: 'Custom Orders' },
          ].map((stat, i) => (
            <div key={i} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        className={styles.scrollDown}
        onClick={() => scrollToSection('about')}
        aria-label="Scroll down"
      >
        <ChevronDown size={20} />
      </button>
    </section>
  );
}
