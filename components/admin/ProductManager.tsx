'use client';
import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct, generateId } from '@/lib/store';
import { Product } from '@/lib/data';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, X, Package } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    pricePerSqFt: '',
    unit: 'per sq. ft',
    image: '/products-preview.png',
    features: '',
    available: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file is too large. Please select a file under 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: 'Mirror',
      description: '',
      pricePerSqFt: '',
      unit: 'per sq. ft',
      image: '/products-preview.png',
      features: '',
      available: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      pricePerSqFt: product.pricePerSqFt.toString(),
      unit: product.unit,
      image: product.image,
      features: product.features.join(', '),
      available: product.available,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      loadProducts();
      showToast('Product deleted successfully');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.pricePerSqFt) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const featuresArray = form.features
      ? form.features.split(',').map((f) => f.trim()).filter((f) => f !== '')
      : [];

    const productData: Product = {
      id: editingProduct ? editingProduct.id : generateId(),
      name: form.name,
      category: form.category,
      description: form.description,
      pricePerSqFt: parseFloat(form.pricePerSqFt),
      unit: form.unit,
      image: form.image,
      features: featuresArray,
      available: form.available,
    };

    if (editingProduct) {
      updateProduct(productData);
      showToast('Product updated successfully');
    } else {
      addProduct(productData);
      showToast('Product added successfully');
    }

    setModalOpen(false);
    loadProducts();
  };

  return (
    <div>
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: '700' }}>
            <Package size={22} style={{ color: 'var(--accent-cyan)' }} />
            Products Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Add, update, or remove glass products from the store catalogue.
          </p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Products Table Wrapper */}
      <div className="glass-card" style={{ overflowX: 'auto', border: '1px solid var(--glass-border)', padding: '8px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price (Taka)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No products found. Add some to get started.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=80&auto=format&fit=crop';
                      }} />
                    </div>
                  </td>
                  <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{p.name}</td>
                  <td>
                    <span className="badge badge-cyan">{p.category}</span>
                  </td>
                  <td style={{ color: 'var(--text-primary)' }}>
                    ৳{p.pricePerSqFt} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/{p.unit}</span>
                  </td>
                  <td>
                    <span className={`badge ${p.available ? 'badge-green' : 'badge-red'}`}>
                      {p.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => openEditModal(p)}
                        style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                        title="Edit Product"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(p.id)}
                        style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
                        title="Delete Product"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box glass-card" style={{ padding: '32px', border: '1px solid var(--glass-border-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Premium Mirror Glass"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Mirror">Mirror</option>
                    <option value="Safety Glass">Safety Glass</option>
                    <option value="Decorative">Decorative</option>
                    <option value="Window Glass">Window Glass</option>
                    <option value="Specialty">Specialty</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price Per Sq Ft (৳) *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 850"
                    min="1"
                    value={form.pricePerSqFt}
                    onChange={(e) => setForm({ ...form, pricePerSqFt: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Billing Unit</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ fontSize: '0.8rem', width: '100%' }}
                      />
                      {form.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--glass-border)' }} onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=80&auto=format&fit=crop';
                        }} />
                      )}
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Or enter image URL"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Provide product details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Key Features (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Crystal clear, Custom finishing, Moisture resistant"
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
                <input
                  type="checkbox"
                  id="available"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="available" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer', userSelect: 'none' }}>
                  Available in store (users can see and order this)
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
