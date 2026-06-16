'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProducts } from '@/lib/store';
import { Product } from '@/lib/data';
import { useScrollReveal } from '@/lib/hooks';
import { CheckCircle, ShoppingCart, Tag } from 'lucide-react';
import styles from './ProductsGrid.module.css';

interface Props {
  onOrderClick: (product: Product) => void;
}

export default function ProductsGrid({ onOrderClick }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  useScrollReveal([products, filter]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <section className="section" id="products">
      <div className="prism-divider" />
      <div className="container">
        <div className={styles.header}>
          <p className="section-tag reveal">Our Products</p>
          <h2 className="section-title reveal delay-1">
            Fine Glass for Every Purpose
          </h2>
          <p className={`section-subtitle reveal delay-2`}>
            From ornate decorative mirrors to architectural safety glass — custom cut, custom sized, delivered to your door.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className={`${styles.filters} reveal delay-3`}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className={styles.grid}>
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className={`glass-card ${styles.card} reveal-scale delay-${(i % 6) + 1}`}
            >
              {/* Product image */}
              <div className={styles.imageWrapper}>
                <Image
                  src={product.image || '/products-preview.png'}
                  alt={product.name}
                  fill
                  className={styles.productImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={styles.imageOverlay} />
                {!product.available && (
                  <div className={styles.unavailableBadge}>Unavailable</div>
                )}
                <div className={styles.categoryTag}>
                  <Tag size={10} />
                  {product.category}
                </div>
              </div>

              {/* Card body */}
              <div className={styles.body}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDesc}>{product.description.slice(0, 100)}...</p>

                {/* Features */}
                <ul className={styles.features}>
                  {product.features.slice(0, 3).map((f, j) => (
                    <li key={j} className={styles.feature}>
                      <CheckCircle size={12} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className={styles.footer}>
                  <div className={styles.price}>
                    <span className={styles.priceValue}>৳{product.pricePerSqFt.toLocaleString()}</span>
                    <span className={styles.priceUnit}>{product.unit}</span>
                  </div>
                  {product.available ? (
                    <button
                      className={`btn-primary ${styles.orderBtn}`}
                      onClick={() => onOrderClick(product)}
                    >
                      <ShoppingCart size={14} />
                      Order
                    </button>
                  ) : (
                    <span className="badge badge-red">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <p>No products in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
