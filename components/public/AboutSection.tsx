'use client';
import { useEffect, useRef, useState } from 'react';
import { getSiteContent } from '@/lib/store';
import { SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/data';
import { useScrollReveal, useCounterAnimation } from '@/lib/hooks';
import { Award, Clock, Truck, Star } from 'lucide-react';
import styles from './AboutSection.module.css';

function CounterItem({ target, label, suffix = '', prefix = '' }: {
  target: number; label: string; suffix?: string; prefix?: string;
}) {
  const ref = useCounterAnimation(target, 2200, prefix, suffix);
  return (
    <div className={styles.counterItem}>
      <span className={styles.counterValue} ref={ref}>{prefix}0{suffix}</span>
      <span className={styles.counterLabel}>{label}</span>
    </div>
  );
}

export default function AboutSection() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  useScrollReveal();

  useEffect(() => {
    setContent(getSiteContent());
  }, []);

  const pillars = [
    { icon: <Award size={22} />, title: 'Premium Quality', desc: 'Only the finest glass materials, carefully sourced and inspected.' },
    { icon: <Clock size={22} />, title: '70+ Years Legacy', desc: 'Trusted by generations of families and businesses since ~1950.' },
    { icon: <Truck size={22} />, title: 'Door-to-Door Delivery', desc: 'We bring your custom glass directly to your location with care.' },
    { icon: <Star size={22} />, title: 'Custom Solutions', desc: 'Every piece cut, finished, and tailored to your exact specification.' },
  ];

  return (
    <section className="section" id="about">
      <div className="prism-divider" />
      <div className="container">
        <div className={styles.grid}>
          {/* Left: Text */}
          <div className={styles.textCol}>
            <p className="section-tag reveal-left">Our Story</p>
            <h2 className={`section-title reveal-left delay-1`}>{content.aboutTitle}</h2>
            <p className={`${styles.aboutText} reveal-left delay-2`}>{content.aboutText}</p>

            {/* Counters */}
            <div className={`${styles.counters} reveal-left delay-3`}>
              <CounterItem target={70} suffix="+" label="Years in Business" />
              <CounterItem target={500} suffix="+" label="Happy Clients" />
              <CounterItem target={6} label="Glass Categories" />
              <CounterItem target={1000} suffix="+" label="Orders Completed" />
            </div>

            {/* Delivery note */}
            <div className={`${styles.deliveryNote} reveal-left delay-4`}>
              <Truck size={16} />
              <span>{content.deliveryNote}</span>
            </div>
          </div>

          {/* Right: Pillars */}
          <div className={styles.pillarsCol}>
            {pillars.map((p, i) => (
              <div key={i} className={`glass-card ${styles.pillar} reveal-right delay-${i + 1}`}>
                <div className={styles.pillarIcon}>{p.icon}</div>
                <div>
                  <h3 className={styles.pillarTitle}>{p.title}</h3>
                  <p className={styles.pillarDesc}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
