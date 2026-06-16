'use client';

import { useState, FormEvent } from 'react';
import { Diamond, Lock, LogIn, AlertCircle } from 'lucide-react';
import { checkAdminPassword, setAdminSession } from '@/lib/store';
import styles from './AdminLogin.module.css';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay for UX feel
    await new Promise(resolve => setTimeout(resolve, 400));

    if (checkAdminPassword(password)) {
      setAdminSession();
      onLogin();
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.logoIcon}>
          <Diamond size={30} />
        </div>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>New Glass Center</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorMsg}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className={`form-group ${styles.inputWrapper}`}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              type="password"
              className={`form-input ${styles.passwordInput}`}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className={`btn-primary ${styles.loginBtn}`}
            disabled={loading || !password}
          >
            {loading ? (
              <>Authenticating...</>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className={styles.footer}>
          Protected area · Authorized personnel only
        </p>
      </div>
    </div>
  );
}
