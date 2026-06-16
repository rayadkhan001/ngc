'use client';
import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '@/lib/store';
import { Order } from '@/lib/data';
import { ShoppingBag, Eye, Trash2, CheckCircle, AlertCircle, Clock, Check, X, Calendar } from 'lucide-react';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setOrders(getOrders());
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusChange = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
    loadOrders();
    showToast(`Order status updated to ${status}`);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order record? This cannot be undone.')) {
      deleteOrder(id);
      loadOrders();
      showToast('Order record deleted');
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'badge-gold';
      case 'confirmed':
        return 'badge-cyan';
      case 'delivered':
        return 'badge-green';
      case 'cancelled':
        return 'badge-red';
      default:
        return 'badge-cyan';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return isoString;
    }
  };

  return (
    <div>
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: '700' }}>
            <ShoppingBag size={22} style={{ color: 'var(--accent-cyan)' }} />
            Orders Management
            {orders.length > 0 && (
              <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px' }}>
                {orders.length} Total
              </span>
            )}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Track client requests, update fulfillment status, and review custom cut measurements.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card" style={{ overflowX: 'auto', border: '1px solid var(--glass-border)', padding: '8px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Dimensions</th>
              <th>Qty</th>
              <th>Total (৳)</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No orders placed yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    #{o.id.substring(0, 8)}...
                  </td>
                  <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                    <div>{o.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customerPhone}</div>
                  </td>
                  <td>{o.productName}</td>
                  <td>
                    {o.width} × {o.height} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.measureUnit}</span>
                  </td>
                  <td>{o.quantity}</td>
                  <td style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>৳{o.total.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(o.status)}`}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatDate(o.createdAt)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedOrder(o)}
                        style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="View Details"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(o.id)}
                        style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
                        title="Delete Order"
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

      {/* Order Details View Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box glass-card" style={{ padding: '32px', maxWidth: '580px', border: '1px solid var(--glass-border-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Order Details
                  <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`} style={{ fontSize: '0.75rem' }}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: #{selectedOrder.id}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Customer Info */}
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Customer Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.95rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Name</span>
                    <strong>{selectedOrder.customerName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Phone</span>
                    <strong>
                      <a href={`tel:${selectedOrder.customerPhone}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
                        {selectedOrder.customerPhone}
                      </a>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Product & Dimensions</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.95rem', marginBottom: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Product Name</span>
                    <strong>{selectedOrder.productName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Dimensions (W × H)</span>
                    <strong>{selectedOrder.width} × {selectedOrder.height} {selectedOrder.measureUnit}</strong>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.95rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Quantity</span>
                    <strong>{selectedOrder.quantity} panel(s)</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Order Date</span>
                    <strong style={{ fontSize: '0.85rem', fontWeight: '500' }}>{formatDate(selectedOrder.createdAt)}</strong>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Customer Notes / Instructions</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', fontStyle: 'italic' }}>
                    "{selectedOrder.notes}"
                  </p>
                </div>
              )}

              {/* Cost Summary */}
              <div style={{ padding: '16px', background: 'rgba(0, 212, 255, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 212, 255, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#22c55e' }}>
                    <span>Discount {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ''}</span>
                    <span>−৳{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontWeight: '700', fontSize: '1.15rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Total Price</span>
                  <span style={{ color: 'var(--accent-gold)' }}>৳{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Update Buttons */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Change Order Status</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                    className="btn-secondary"
                    style={{ flex: '1', minWidth: '100px', fontSize: '0.8rem', padding: '10px 8px', justifyContent: 'center' }}
                    disabled={selectedOrder.status === 'confirmed'}
                  >
                    Confirm Order
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                    className="btn-success"
                    style={{ flex: '1', minWidth: '100px', fontSize: '0.8rem', padding: '10px 8px', justifyContent: 'center' }}
                    disabled={selectedOrder.status === 'delivered'}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                    className="btn-danger"
                    style={{ flex: '1', minWidth: '100px', fontSize: '0.8rem', padding: '10px 8px', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                    disabled={selectedOrder.status === 'cancelled'}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
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
