'use client';
import { useState, useEffect } from 'react';
import { getCoupons, saveCoupon, updateCoupon, deleteCoupon, generateId } from '@/lib/store';
import { Coupon } from '@/lib/data';
import { Tag, Plus, Edit2, Trash2, CheckCircle, AlertCircle, X, Calendar } from 'lucide-react';

export default function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [form, setForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'flat',
    value: '',
    expiryDate: '',
    active: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    setCoupons(getCoupons());
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAddModal = () => {
    setEditingCoupon(null);
    setForm({
      code: '',
      type: 'percentage',
      value: '',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      expiryDate: coupon.expiryDate,
      active: coupon.active,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(id);
      loadCoupons();
      showToast('Coupon deleted');
    }
  };

  const handleToggleActive = (coupon: Coupon) => {
    const updated = { ...coupon, active: !coupon.active };
    updateCoupon(updated);
    loadCoupons();
    showToast(`Coupon ${updated.code} is now ${updated.active ? 'active' : 'inactive'}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code || !form.value || !form.expiryDate) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const couponData: Coupon = {
      id: editingCoupon ? editingCoupon.id : generateId(),
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: parseFloat(form.value),
      expiryDate: form.expiryDate,
      active: form.active,
      usageCount: editingCoupon ? editingCoupon.usageCount : 0,
    };

    if (editingCoupon) {
      updateCoupon(couponData);
      showToast('Coupon updated successfully');
    } else {
      saveCoupon(couponData);
      showToast('Coupon created successfully');
    }

    setModalOpen(false);
    loadCoupons();
  };

  const isExpired = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    // Add end of day to expiry comparison
    expiry.setHours(23, 59, 59, 999);
    return expiry < now;
  };

  return (
    <div>
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: '700' }}>
            <Tag size={22} style={{ color: 'var(--accent-cyan)' }} />
            Coupons & Discounts
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Manage discount codes, configure percentage/flat reductions, and track active promotions.
          </p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          Add Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="glass-card" style={{ overflowX: 'auto', border: '1px solid var(--glass-border)', padding: '8px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No coupons found. Click "Add Coupon" to create one.
                </td>
              </tr>
            ) : (
              coupons.map((c) => {
                const expired = isExpired(c.expiryDate);
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '0.05em', fontFamily: 'monospace', fontSize: '1rem' }}>
                      {c.code}
                    </td>
                    <td>
                      <span className={`badge ${c.type === 'percentage' ? 'badge-cyan' : 'badge-gold'}`}>
                        {c.type === 'percentage' ? 'Percentage (%)' : 'Flat (৳)'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {c.type === 'percentage' ? `${c.value}%` : `৳${c.value.toLocaleString()}`}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: expired ? '#ef4444' : 'var(--text-secondary)' }}>
                        <Calendar size={14} />
                        <span>{c.expiryDate} {expired && '(Expired)'}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`badge ${c.active && !expired ? 'badge-green' : 'badge-red'}`}
                        style={{ border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', outline: 'none' }}
                        title="Click to toggle status"
                        disabled={expired}
                      >
                        {expired ? 'EXPIRED' : c.active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-secondary"
                          onClick={() => openEditModal(c)}
                          style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                          title="Edit Coupon"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(c.id)}
                          style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
                          title="Delete Coupon"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box glass-card" style={{ padding: '32px', maxWidth: '480px', border: '1px solid var(--glass-border-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Coupon Code *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SAVE15"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  style={{ textTransform: 'uppercase', fontWeight: '600', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Discount Type *</label>
                  <select
                    className="form-select"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'flat' })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (৳)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Value *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 10"
                    min="1"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="active" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer', userSelect: 'none' }}>
                  Enable coupon (users can apply this immediately)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
