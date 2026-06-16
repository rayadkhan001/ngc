'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Diamond, Phone } from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#products', label: 'Products' },
  { href: '#services', label: 'Services' },
  { href: '#order', label: 'Order' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Diamond size={18} strokeWidth={1.5} />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>New Glass</span>
              <span className={styles.logoSub}>CENTER</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className={styles.links}>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <button className={styles.navLink} onClick={() => handleNavClick(link.href)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className={styles.actions}>
            <a href="tel:01714239064" className={styles.callBtn}>
              <Phone size={14} />
              Call Now
            </a>
            <button
              className={styles.menuToggle}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <button className={styles.mobileLink} onClick={() => handleNavClick(link.href)}>
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <a href="tel:01714239064" className={`btn-primary ${styles.mobileCallBtn}`}>
              <Phone size={16} />
              Call 01714239064
            </a>
          </li>
        </ul>
      </div>
      {menuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
