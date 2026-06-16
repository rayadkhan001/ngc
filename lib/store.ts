'use client';

import { Product, Order, Coupon, SiteContent, DEFAULT_PRODUCTS, DEFAULT_COUPONS, DEFAULT_SITE_CONTENT } from './data';

const KEYS = {
  PRODUCTS: 'ngc_products',
  ORDERS: 'ngc_orders',
  COUPONS: 'ngc_coupons',
  CONTENT: 'ngc_content',
  AUTH: 'ngc_auth',
};

function isBrowser() {
  return typeof window !== 'undefined';
}

// ─── Products ────────────────────────────────────────────────────────────────
export function getProducts(): Product[] {
  if (!isBrowser()) return DEFAULT_PRODUCTS;
  const raw = localStorage.getItem(KEYS.PRODUCTS);
  if (!raw) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(raw);
}

export function saveProducts(products: Product[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
}

export function addProduct(product: Product) {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(updated: Product) {
  const products = getProducts().map(p => p.id === updated.id ? updated : p);
  saveProducts(products);
}

export function deleteProduct(id: string) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export function getOrders(): Order[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(KEYS.ORDERS);
  return raw ? JSON.parse(raw) : [];
}

export function saveOrder(order: Order) {
  if (!isBrowser()) return;
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

export function updateOrderStatus(id: string, status: Order['status']) {
  if (!isBrowser()) return;
  const orders = getOrders().map(o => o.id === id ? { ...o, status } : o);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

export function deleteOrder(id: string) {
  if (!isBrowser()) return;
  const orders = getOrders().filter(o => o.id !== id);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

// ─── Coupons ──────────────────────────────────────────────────────────────────
export function getCoupons(): Coupon[] {
  if (!isBrowser()) return DEFAULT_COUPONS;
  const raw = localStorage.getItem(KEYS.COUPONS);
  if (!raw) {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
    return DEFAULT_COUPONS;
  }
  return JSON.parse(raw);
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
  if (!coupon) return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
  const now = new Date();
  const expiry = new Date(coupon.expiryDate);
  if (expiry < now) return { valid: false, discount: 0, message: 'This coupon has expired.' };
  const discount = coupon.type === 'percentage'
    ? Math.round((subtotal * coupon.value) / 100)
    : Math.min(coupon.value, subtotal);
  const message = coupon.type === 'percentage'
    ? `${coupon.value}% discount applied!`
    : `৳${coupon.value} discount applied!`;
  return { valid: true, discount, message };
}

export function saveCoupon(coupon: Coupon) {
  if (!isBrowser()) return;
  const coupons = getCoupons();
  coupons.push(coupon);
  localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
}

export function updateCoupon(updated: Coupon) {
  if (!isBrowser()) return;
  const coupons = getCoupons().map(c => c.id === updated.id ? updated : c);
  localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
}

export function deleteCoupon(id: string) {
  if (!isBrowser()) return;
  const coupons = getCoupons().filter(c => c.id !== id);
  localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
}

// ─── Site Content ─────────────────────────────────────────────────────────────
export function getSiteContent(): SiteContent {
  if (!isBrowser()) return DEFAULT_SITE_CONTENT;
  const raw = localStorage.getItem(KEYS.CONTENT);
  if (!raw) {
    localStorage.setItem(KEYS.CONTENT, JSON.stringify(DEFAULT_SITE_CONTENT));
    return DEFAULT_SITE_CONTENT;
  }
  return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(raw) };
}

export function saveSiteContent(content: SiteContent) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.CONTENT, JSON.stringify(content));
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────
const CORRECT_PASSWORD = 'ngc2026';

export function checkAdminPassword(password: string): boolean {
  return password === CORRECT_PASSWORD;
}

export function isAdminLoggedIn(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(KEYS.AUTH) === 'authenticated';
}

export function setAdminSession() {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.AUTH, 'authenticated');
}

export function clearAdminSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.AUTH);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function calculateArea(width: number, height: number, unit: string): number {
  // Convert everything to feet for calculation
  const conversions: Record<string, number> = {
    feet: 1,
    inches: 1 / 144,
    cm: 1 / 929.03,
    mm: 1 / 92903,
  };
  const factor = conversions[unit] || 1;
  return width * height * factor;
}
