'use client';
import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/store';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the admin is authenticated
    setIsLoggedIn(isAdminLoggedIn());
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
  };

  // Prevent flash of content during initial client check
  if (isLoggedIn === null) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.9rem'
      }}>
        Loading admin session...
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <AdminDashboard onLogout={handleLogoutSuccess} />
      ) : (
        <AdminLogin onLogin={handleLoginSuccess} />
      )}
    </>
  );
}
