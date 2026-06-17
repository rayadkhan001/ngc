'use client';
import { useEffect, useRef, useState } from 'react';
import { getSiteContent } from '@/lib/store';
import { Phone, MessageCircle, X } from 'lucide-react';
import styles from './FloatingCTA.module.css';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('01714239064');
  const [whatsapp, setWhatsapp] = useState('8801714239064');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = getSiteContent();
    if (content?.phone) setPhone(content.phone);
    if (content?.whatsapp) setWhatsapp(content.whatsapp);

    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const cleanPhone = phone.replace(/\s+/g, '');
  const cleanWhatsapp = whatsapp.replace(/\s+/g, '');

  return (
    <div
      ref={panelRef}
      className={`${styles.wrapper} ${visible ? styles.visible : ''}`}
      aria-label="Contact options"
    >
      {/* Expandable panel */}
      <div className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
        <p className={styles.panelLabel}>📞 Reach Us</p>
        <p className={styles.panelPhone}>{phone}</p>
        <div className={styles.panelActions}>
          <a
            href={`tel:${cleanPhone}`}
            className={styles.actionCall}
            onClick={() => setOpen(false)}
          >
            <Phone size={14} />
            Call Now
          </a>
          <a
            href={`https://wa.me/${cleanWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.actionWhatsapp}
            onClick={() => setOpen(false)}
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Main toggle button */}
      <button
        className={`${styles.floatingBtn} ${open ? styles.btnOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close contact options' : 'Open contact options'}
        title="Contact Us"
      >
        {!open && (
          <>
            <div className={styles.pulseRing} />
            <div className={styles.pulseRing2} />
          </>
        )}
        <div className={styles.iconWrapper}>
          {open ? <X size={22} /> : <Phone size={22} fill="currentColor" />}
        </div>
        {!open && <span className={styles.btnLabel}>Call Us</span>}
      </button>
    </div>
  );
}
