'use client';
import { useState, useEffect } from 'react';
import { getProducts, validateCoupon, saveOrder, calculateArea, generateId } from '@/lib/store';
import { Product } from '@/lib/data';
import { useScrollReveal } from '@/lib/hooks';
import {
  ShoppingCart, Tag, X, CheckCircle, AlertCircle,
  Ruler, ChevronDown, Send, Phone, MapPin
} from 'lucide-react';
import styles from './OrderSection.module.css';

interface Props {
  selectedProduct?: Product | null;
  onClearSelected?: () => void;
}

export default function OrderSection({ selectedProduct, onClearSelected }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    productId: '',
    width: '',
    height: '',
    unit: 'feet' as 'feet' | 'inches' | 'cm' | 'mm',
    quantity: '1',
    couponCode: '',
    notes: '',
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
  });
  const [couponState, setCouponState] = useState<{ valid: boolean; discount: number; message: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useScrollReveal([submitted]);

  useEffect(() => {
    const prods = getProducts().filter(p => p.available);
    setProducts(prods);
    if (prods.length > 0) {
      setForm(f => ({ ...f, productId: prods[0].id }));
    }
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setForm(f => ({ ...f, productId: selectedProduct.id }));
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedProduct]);

  const selectedProd = products.find(p => p.id === form.productId);
  const area = form.width && form.height
    ? calculateArea(parseFloat(form.width), parseFloat(form.height), form.unit)
    : 0;
  const qty = parseInt(form.quantity) || 1;
  const subtotal = selectedProd ? Math.round(area * selectedProd.pricePerSqFt * qty) : 0;
  const discount = couponState?.valid ? couponState.discount : 0;
  const total = Math.max(0, subtotal - discount);

  function handleChange(key: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
    if (key === 'couponCode') setCouponState(null);
  }

  function applyCoupon() {
    if (!form.couponCode.trim()) return;
    const result = validateCoupon(form.couponCode, subtotal);
    setCouponState(result);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.productId) e.productId = 'Select a product';
    if (!form.width || parseFloat(form.width) <= 0) e.width = 'Enter a valid width';
    if (!form.height || parseFloat(form.height) <= 0) e.height = 'Enter a valid height';
    if (!form.customerName.trim()) e.customerName = 'Your name is required';
    if (!form.deliveryAddress.trim()) e.deliveryAddress = 'Delivery address is required';
    
    const phoneTrimmed = form.customerPhone.trim();
    if (!phoneTrimmed) {
      e.customerPhone = 'Phone number is required';
    } else if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(phoneTrimmed) && !/^[0-9+\-\s()]{7,15}$/.test(phoneTrimmed)) {
      e.customerPhone = 'Enter a valid phone number (e.g. 017XXXXXXXX)';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const order = {
      id: generateId(),
      productId: form.productId,
      productName: selectedProd?.name || '',
      width: parseFloat(form.width),
      height: parseFloat(form.height),
      measureUnit: form.unit,
      quantity: qty,
      couponCode: couponState?.valid ? form.couponCode : '',
      discount,
      notes: form.notes,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      deliveryAddress: form.deliveryAddress,
      subtotal,
      total,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      saveOrder(order);
      setSubmitted(true);
      setIsSubmitting(false);
      onClearSelected?.();
    }, 1000);
  }

  function resetForm() {
    setForm({ productId: products[0]?.id || '', width: '', height: '', unit: 'feet', quantity: '1', couponCode: '', notes: '', customerName: '', customerPhone: '', deliveryAddress: '' });
    setCouponState(null);
    setSubmitted(false);
    setErrors({});
  }

  return (
    <section className="section" id="order">
      <div className="prism-divider" />
      <div className="container">
        <div className={styles.header}>
          <p className="section-tag reveal">Place Your Order</p>
          <h2 className="section-title reveal delay-1">Order with Custom Measurements</h2>
          <p className="section-subtitle reveal delay-2">
            Select your glass, enter exact dimensions, and we'll cut and deliver it perfectly.
          </p>
        </div>

        {submitted ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}><CheckCircle size={48} /></div>
            <h3>Order Submitted!</h3>
            <p>Thank you! Your order has been received. We will contact you at <strong>{form.customerPhone}</strong> to confirm.</p>
            <div className={styles.successActions}>
              <button className="btn-primary" onClick={resetForm}>Place Another Order</button>
              <a href="tel:01714239064" className="btn-secondary">
                <Phone size={15} />
                Call to Confirm
              </a>
            </div>
          </div>
        ) : (
          <div className={styles.formGrid}>
            {/* Left: Form */}
            <form className={`glass-card ${styles.form} reveal-left`} onSubmit={handleSubmit}>
              {/* Product select */}
              <div className="form-group">
                <label className="form-label">Select Glass Product *</label>
                <select
                  className="form-select"
                  value={form.productId}
                  onChange={e => handleChange('productId', e.target.value)}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — ৳{p.pricePerSqFt}/{p.unit}</option>
                  ))}
                </select>
                {errors.productId && <span className="form-error"><AlertCircle size={12} />{errors.productId}</span>}
              </div>

              {/* Dimensions */}
              <div className={styles.dimensionsRow}>
                <div className="form-group">
                  <label className="form-label">Width *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 24"
                    min="0.1"
                    step="0.1"
                    value={form.width}
                    onChange={e => handleChange('width', e.target.value)}
                  />
                  {errors.width && <span className="form-error"><AlertCircle size={12} />{errors.width}</span>}
                </div>
                <div className={styles.dimensionX}>×</div>
                <div className="form-group">
                  <label className="form-label">Height *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 36"
                    min="0.1"
                    step="0.1"
                    value={form.height}
                    onChange={e => handleChange('height', e.target.value)}
                  />
                  {errors.height && <span className="form-error"><AlertCircle size={12} />{errors.height}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select
                    className="form-select"
                    value={form.unit}
                    onChange={e => handleChange('unit', e.target.value as typeof form.unit)}
                  >
                    <option value="feet">Feet (ft)</option>
                    <option value="inches">Inches (in)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="mm">Millimeters (mm)</option>
                  </select>
                </div>
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label className="form-label">Quantity (panels)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={form.quantity}
                  onChange={e => handleChange('quantity', e.target.value)}
                />
              </div>

              {/* Coupon */}
              <div className="form-group">
                <label className="form-label"><Tag size={12} style={{display:'inline',marginRight:4}} />Coupon Code</label>
                <div className={styles.couponRow}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter coupon code"
                    value={form.couponCode}
                    onChange={e => handleChange('couponCode', e.target.value.toUpperCase())}
                  />
                  <button type="button" className="btn-secondary" onClick={applyCoupon} style={{whiteSpace:'nowrap',padding:'12px 16px'}}>
                    Apply
                  </button>
                </div>
                {couponState && (
                  <span className={couponState.valid ? 'form-success' : 'form-error'}>
                    {couponState.valid ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {couponState.message}
                  </span>
                )}
              </div>

              {/* Customer Info */}
              <div className={styles.customerRow}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Full name"
                    value={form.customerName}
                    onChange={e => handleChange('customerName', e.target.value)}
                  />
                  {errors.customerName && <span className="form-error"><AlertCircle size={12} />{errors.customerName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Your Phone *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. 01XXXXXXXXX"
                    value={form.customerPhone}
                    onChange={e => handleChange('customerPhone', e.target.value)}
                  />
                  {errors.customerPhone && <span className="form-error"><AlertCircle size={12} />{errors.customerPhone}</span>}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="form-group">
                <label className="form-label"><MapPin size={12} style={{display:'inline',marginRight:4}} />Delivery Address *</label>
                <textarea
                  className="form-textarea"
                  placeholder="House/flat no., road, area, city — where should we deliver?"
                  value={form.deliveryAddress}
                  onChange={e => handleChange('deliveryAddress', e.target.value)}
                  rows={2}
                />
                {errors.deliveryAddress && <span className="form-error"><AlertCircle size={12} />{errors.deliveryAddress}</span>}
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">Additional Notes / Instructions</label>
                <textarea
                  className="form-textarea"
                  placeholder="E.g. edge type (polished/raw/beveled), installation notes, special delivery instructions..."
                  value={form.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : (
                  <><Send size={16} /> Submit Order</>
                )}
              </button>
            </form>

            {/* Right: Price Summary */}
            <div className={styles.summary}>
              <div className={`glass-card ${styles.summaryCard} reveal-right`}>
                <h3 className={styles.summaryTitle}>
                  <ShoppingCart size={18} />
                  Order Summary
                </h3>

                {selectedProd ? (
                  <>
                    <div className={styles.summaryProduct}>
                      <span>{selectedProd.name}</span>
                      <span className={styles.summaryProductPrice}>৳{selectedProd.pricePerSqFt}/sq.ft</span>
                    </div>

                    {area > 0 && (
                      <div className={styles.summaryRows}>
                        <div className={styles.summaryRow}>
                          <span>Area</span>
                          <span>{area.toFixed(2)} sq. ft × {qty}</span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span>Subtotal</span>
                          <span>৳{subtotal.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                          <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                            <span>Discount</span>
                            <span>−৳{discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                          <span>Total</span>
                          <span>৳{total.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {(!form.width || !form.height) && (
                      <p className={styles.summaryHint}>
                        <Ruler size={14} />
                        Enter dimensions to see price
                      </p>
                    )}
                  </>
                ) : (
                  <p className={styles.summaryHint}>Select a product to see pricing</p>
                )}
              </div>

              {/* Or call */}
              <div className={`glass-card ${styles.callCard} reveal-right delay-2`}>
                <p className={styles.callTitle}>Prefer to order by phone?</p>
                <a href="tel:01714239064" className={`btn-primary ${styles.callCta}`}>
                  <Phone size={18} />
                  Call 01714239064
                </a>
                <p className={styles.callNote}>Available Sat–Thu, 9AM–8PM</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
