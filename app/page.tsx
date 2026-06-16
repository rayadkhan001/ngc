'use client';
import { useState } from 'react';
import { Product } from '@/lib/data';
import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import AboutSection from '@/components/public/AboutSection';
import ProductsGrid from '@/components/public/ProductsGrid';
import ServicesSection from '@/components/public/ServicesSection';
import VideoShowcase from '@/components/public/VideoShowcase';
import OrderSection from '@/components/public/OrderSection';
import ContactSection from '@/components/public/ContactSection';
import Footer from '@/components/public/Footer';
import FloatingCTA from '@/components/public/FloatingCTA';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProductsGrid onOrderClick={(product) => setSelectedProduct(product)} />
        <ServicesSection />
        <VideoShowcase />
        <OrderSection
          selectedProduct={selectedProduct}
          onClearSelected={() => setSelectedProduct(null)}
        />
        <ContactSection />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
