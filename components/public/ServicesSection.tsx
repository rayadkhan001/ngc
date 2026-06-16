'use client';
import { useScrollReveal } from '@/lib/hooks';
import { Ruler, Truck, Shield, Scissors, Home, Settings } from 'lucide-react';
import styles from './ServicesSection.module.css';

const SERVICES = [
  {
    icon: <Scissors size={28} strokeWidth={1.5} />,
    title: 'Custom Cutting',
    desc: 'Precision-cut glass to any shape, size, or dimension you need. From simple rectangles to complex custom patterns.',
  },
  {
    icon: <Ruler size={28} strokeWidth={1.5} />,
    title: 'Measurement-Based Orders',
    desc: 'Place your order online with exact width, height, and thickness. We calculate your price instantly.',
  },
  {
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: 'Delivery Service',
    desc: 'Safe and careful doorstep delivery for all orders. Free delivery within city for orders over ৳5,000.',
  },
  {
    icon: <Shield size={28} strokeWidth={1.5} />,
    title: 'Safety Glass Tempering',
    desc: 'Full tempering service for safety compliance. Ideal for buildings, shower enclosures, and automotive use.',
  },
  {
    icon: <Home size={28} strokeWidth={1.5} />,
    title: 'Interior & Decor',
    desc: 'Transform your space with decorative glass, frosted panels, stained art glass, and elegant mirrors.',
  },
  {
    icon: <Settings size={28} strokeWidth={1.5} />,
    title: 'Edge Finishing',
    desc: 'Professional edge polishing — choose from raw, polished, beveled, or pencil-grind finishes.',
  },
];

export default function ServicesSection() {
  useScrollReveal();
  return (
    <section className="section" id="services">
      <div className="prism-divider" />
      <div className="container">
        <div className={styles.header}>
          <p className="section-tag reveal">What We Do</p>
          <h2 className="section-title reveal delay-1">Our Services</h2>
          <p className="section-subtitle reveal delay-2">
            End-to-end glass solutions — from consultation to custom cutting to your doorstep delivery.
          </p>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((svc, i) => (
            <div key={i} className={`${styles.card} reveal-scale delay-${(i % 6) + 1}`}>
              <div className={styles.iconWrap}>{svc.icon}</div>
              <h3 className={styles.cardTitle}>{svc.title}</h3>
              <p className={styles.cardDesc}>{svc.desc}</p>
              <div className={styles.cardLine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
