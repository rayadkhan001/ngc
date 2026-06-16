'use client';
import { useState, useEffect } from 'react';
import { getSiteContent, saveSiteContent } from '@/lib/store';
import { SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/data';
import { FileText, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContentEditor() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(getSiteContent());
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleInputChange = (field: keyof SiteContent, value: string) => {
    setContent({ ...content, [field]: value });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'video1' | 'video2') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 6 * 1024 * 1024) {
        showToast('Video file is too large. Please select a clip under 6MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(c => ({ ...c, [field]: reader.result as string }));
        showToast(`Video loaded into memory! Click Save to apply.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      saveSiteContent(content);
      // Trigger a storage event so if the homepage is open in another tab it updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
      showToast('Website content saved and updated successfully!');
    } catch (err) {
      showToast('Failed to save content', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Panel Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: '700' }}>
          <FileText size={22} style={{ color: 'var(--accent-cyan)' }} />
          Edit Website Content
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Update page text, contact details, business hours, and map embeds instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 1: BRAND IDENTITY */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
            Brand Identity
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Business Name</label>
              <input
                type="text"
                className="form-input"
                value={content.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Brand Tagline</label>
              <input
                type="text"
                className="form-input"
                value={content.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: HERO BANNER */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
            Hero Banner Section
          </h3>
          <div className="form-group">
            <label className="form-label">Hero Banner Subtitle (Main intro text)</label>
            <textarea
              className="form-textarea"
              value={content.heroSubtitle}
              onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
              required
              rows={2}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Primary CTA Button Text</label>
              <input
                type="text"
                className="form-input"
                value={content.heroCtaText}
                onChange={(e) => handleInputChange('heroCtaText', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary CTA Button Text</label>
              <input
                type="text"
                className="form-input"
                value={content.heroCtaSecondary}
                onChange={(e) => handleInputChange('heroCtaSecondary', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: ABOUT US */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
            About Section
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.4fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">About Page Title</label>
              <input
                type="text"
                className="form-input"
                value={content.aboutTitle}
                onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Established Year</label>
              <input
                type="text"
                className="form-input"
                value={content.established}
                onChange={(e) => handleInputChange('established', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">About Business Description Paragraph</label>
            <textarea
              className="form-textarea"
              value={content.aboutText}
              onChange={(e) => handleInputChange('aboutText', e.target.value)}
              required
              rows={4}
            />
          </div>
        </div>

        {/* SECTION 4: CONTACT INFO & SOCIALS */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
            Contact Info & Socials
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Direct Contact Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={content.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Contact Number (incl. country code, no +)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 8801714239064"
                value={content.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Business Email</label>
              <input
                type="email"
                className="form-input"
                value={content.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Facebook Page URL</label>
              <input
                type="text"
                className="form-input"
                value={content.facebookUrl}
                onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Showroom Physical Address</label>
            <input
              type="text"
              className="form-input"
              value={content.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Google Map iframe Embed URL (src attribute only)</label>
            <input
              type="text"
              className="form-input"
              value={content.mapEmbedUrl}
              onChange={(e) => handleInputChange('mapEmbedUrl', e.target.value)}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {"Provide the iframe source URL generated from Google Maps -> Share -> Embed map -> src."}
            </span>
          </div>
        </div>

        {/* SECTION 5: HOURS & LOGISTICS */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
            Business Hours & Logistics
          </h3>
          <div className="form-group">
            <label className="form-label">Showroom Business Hours (enter each on a new line)</label>
            <textarea
              className="form-textarea"
              value={content.businessHours}
              onChange={(e) => handleInputChange('businessHours', e.target.value)}
              required
              rows={3}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Delivery Policy / Logistics Note</label>
            <input
              type="text"
              className="form-input"
              value={content.deliveryNote}
              onChange={(e) => handleInputChange('deliveryNote', e.target.value)}
              required
            />
          </div>
        </div>

        {/* SECTION 6: SHOWCASE VIDEOS */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
            Showcase Videos
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Upload short showcase clips of your showroom or glass crafting (under 6MB each) to display on the home page.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Video 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Video 1 Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={content.video1Title}
                  onChange={(e) => handleInputChange('video1Title', e.target.value)}
                  placeholder="e.g. Showroom Walkthrough"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Video 1 File Upload (Max 6MB)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoUpload(e, 'video1')}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
              {content.video1 && (
                <div style={{ marginTop: '8px' }}>
                  <video src={content.video1} controls style={{ width: '100%', maxHeight: '150px', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
                  <button type="button" className="btn-danger" style={{ marginTop: '8px', padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleInputChange('video1', '')}>
                    Remove Video
                  </button>
                </div>
              )}
            </div>

            {/* Video 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Video 2 Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={content.video2Title}
                  onChange={(e) => handleInputChange('video2Title', e.target.value)}
                  placeholder="e.g. Glass Crafting in Action"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Video 2 File Upload (Max 6MB)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoUpload(e, 'video2')}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
              {content.video2 && (
                <div style={{ marginTop: '8px' }}>
                  <video src={content.video2} controls style={{ width: '100%', maxHeight: '150px', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
                  <button type="button" className="btn-danger" style={{ marginTop: '8px', padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleInputChange('video2', '')}>
                    Remove Video
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SAVE PANEL ACTION */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '16px 40px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}
            disabled={loading}
          >
            <Save size={18} />
            {loading ? 'Saving Changes...' : 'Save and Update Site'}
          </button>
        </div>

      </form>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
