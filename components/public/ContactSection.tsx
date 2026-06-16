'use client';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/store';
import { SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/data';
import { useScrollReveal } from '@/lib/hooks';
import { Phone, MapPin, Clock, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  useScrollReveal();

  useEffect(() => {
    setContent(getSiteContent());
  }, []);

  // Format phone number for tel link
  const formattedPhone = content.phone.replace(/\s+/g, '');
  // Format whatsapp number (remove plus, spaces, etc.)
  const formattedWhatsapp = content.whatsapp.replace(/\D/g, '');

  return (
    <section className="section" id="contact">
      <div className="prism-divider" />
      <div className="container">
        <div className={styles.header}>
          <p className="section-tag reveal">Get in Touch</p>
          <h2 className="section-title reveal delay-1">Contact Us</h2>
          <p className="section-subtitle reveal delay-2">
            Have questions about sizes, custom work, or pricing? Reach out to us directly or visit our showroom.
          </p>
        </div>

        {/* 3-Column Cards */}
        <div className={styles.grid}>
          {/* Card 1: Phone */}
          <div className={`glass-card ${styles.card} reveal-scale`}>
            <div className={styles.iconWrapper}>
              <Phone size={24} />
            </div>
            <h3 className={styles.cardTitle}>Call Us Directly</h3>
            <p className={styles.cardSubtitle}>Ask questions or confirm details</p>
            <a href={`tel:${formattedPhone}`} className={styles.cardLink}>
              {content.phone}
            </a>
          </div>

          {/* Card 2: Address */}
          <div className={`glass-card ${styles.card} reveal-scale delay-1`}>
            <div className={styles.iconWrapper}>
              <MapPin size={24} />
            </div>
            <h3 className={styles.cardTitle}>Visit Our Showroom</h3>
            <p className={styles.cardSubtitle}>See our wide variety of glass products</p>
            <span className={styles.cardDetail}>{content.address}</span>
          </div>

          {/* Card 3: Business Hours */}
          <div className={`glass-card ${styles.card} reveal-scale delay-2`}>
            <div className={styles.iconWrapper}>
              <Clock size={24} />
            </div>
            <h3 className={styles.cardTitle}>Business Hours</h3>
            <p className={styles.cardSubtitle}>Plan your visit or order call</p>
            <pre className={styles.hoursDetail}>{content.businessHours}</pre>
          </div>
        </div>

        {/* Big Glass Card CTA & Map */}
        <div className={`${styles.ctaContainer} reveal delay-3`}>
          <div className={`glass-card ${styles.ctaCard}`}>
            <div className={styles.ctaTextSection}>
              <h4>Let's discuss your next project</h4>
              <p>
                We deliver high-quality mirror glass, safety glass, decorative glass, and window panels cut to your precise measurements.
              </p>
              <div className={styles.ctaActions}>
                <a href={`tel:${formattedPhone}`} className="btn-primary">
                  <Phone size={18} />
                  Call Now: {content.phone}
                </a>
                {content.whatsapp && (
                  <a
                    href={`https://wa.me/${formattedWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <MessageSquare size={18} />
                    WhatsApp Us
                  </a>
                )}
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className={styles.mapWrapper}>
              <iframe
                src={content.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={styles.mapIframe}
                title="New Glass Center Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
