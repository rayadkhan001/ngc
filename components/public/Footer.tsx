'use client';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/store';
import { SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/data';
import { Diamond, Phone, MapPin, Clock, Mail, Heart } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    setContent(getSiteContent());
  }, []);

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const formattedPhone = content.phone.replace(/\s+/g, '');

  return (
    <footer className={styles.footer}>
      <div className="prism-divider" />
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          {/* Column 1: Brand Logo & About */}
          <div className={styles.col}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Diamond size={18} strokeWidth={1.5} />
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoMain}>New Glass</span>
                <span className={styles.logoSub}>CENTER</span>
              </div>
            </div>
            <p className={styles.aboutText}>
              Providing high-quality custom glass and mirror solutions since {content.established}. Custom sizing and edge polishing to meet your design needs.
            </p>
            <div className={styles.estBadge}>
              Est. Circa {content.established}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              <li>
                <button onClick={() => handleNavClick('#about')}>About Us</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#products')}>Our Products</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#services')}>Our Services</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#order')}>Order Now</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#contact')}>Contact Us</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Products */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Products</h4>
            <ul className={styles.linksList}>
              <li>
                <button onClick={() => handleNavClick('#products')}>Mirror Glass</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#products')}>Safety Glass</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#products')}>Frosted Privacy Glass</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#products')}>Decorative Glass</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#products')}>Window Glass</button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact Info</h4>
            <ul className={styles.contactList}>
              <li>
                <Phone size={14} className={styles.contactIcon} />
                <a href={`tel:${formattedPhone}`} className={styles.contactLink}>
                  {content.phone}
                </a>
              </li>
              {content.email && (
                <li>
                  <Mail size={14} className={styles.contactIcon} />
                  <a href={`mailto:${content.email}`} className={styles.contactLink}>
                    {content.email}
                  </a>
                </li>
              )}
              <li>
                <MapPin size={14} className={styles.contactIcon} />
                <span className={styles.contactText}>{content.address}</span>
              </li>
              <li className={styles.hoursItem}>
                <Clock size={14} className={styles.contactIcon} />
                <div className={styles.hoursText}>
                  {content.businessHours.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {content.businessName}. All rights reserved.
          </p>
          <p className={styles.crafted}>
            Crafted with <Heart size={12} className={styles.heartIcon} /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
