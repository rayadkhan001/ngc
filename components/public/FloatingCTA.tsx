'use client';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/store';
import { Phone } from 'lucide-react';
import styles from './FloatingCTA.module.css';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState('01714239064');

  useEffect(() => {
    // Load phone from local storage
    const content = getSiteContent();
    if (content?.phone) {
      setPhone(content.phone);
    }

    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formattedPhone = phone.replace(/\s+/g, '');

  return (
    <a
      href={`tel:${formattedPhone}`}
      className={`${styles.floatingBtn} ${visible ? styles.visible : ''}`}
      aria-label="Call Business Directly"
      title={`Call Us at ${phone}`}
    >
      <div className={styles.pulseRing}></div>
      <div className={styles.pulseRing2}></div>
      <div className={styles.iconWrapper}>
        <Phone size={24} fill="currentColor" />
      </div>
    </a>
  );
}
