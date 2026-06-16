'use client';
import { useState } from 'react';
import { Diamond, LogOut, ArrowLeft, Package, ShoppingBag, Tag, FileText } from 'lucide-react';
import { clearAdminSession } from '@/lib/store';
import styles from './AdminDashboard.module.css';

// Subcomponents (we will create these next)
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import CouponManager from './CouponManager';
import ContentEditor from './ContentEditor';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'products' | 'orders' | 'coupons' | 'content';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('products');

  const handleLogout = () => {
    clearAdminSession();
    onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManager />;
      case 'orders':
        return <OrderManager />;
      case 'coupons':
        return <CouponManager />;
      case 'content':
        return <ContentEditor />;
      default:
        return <ProductManager />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Logo */}
          <div className={styles.logo}>
            <Diamond size={20} className={styles.logoIcon} strokeWidth={1.5} />
            <span>NGC Admin</span>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={15} />
              <span>Products</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={15} />
              <span>Orders</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'coupons' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <Tag size={15} />
              <span>Coupons</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'content' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <FileText size={15} />
              <span>Site Content</span>
            </button>
          </div>

          {/* Actions */}
          <div className={styles.headerActions}>
            <a href="/" className={styles.backLink}>
              <ArrowLeft size={14} />
              <span>Back to Site</span>
            </a>
            <button
              onClick={handleLogout}
              className={`btn-danger ${styles.logoutBtn}`}
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Panel Workspace */}
      <main className={styles.content}>
        {renderContent()}
      </main>
    </div>
  );
}
