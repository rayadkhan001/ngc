export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerSqFt: number; // in Taka
  unit: string;
  image: string; // URL or base64
  available: boolean;
  features: string[];
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  width: number;
  height: number;
  measureUnit: 'inches' | 'cm' | 'mm' | 'feet';
  quantity: number;
  couponCode: string;
  discount: number;
  notes: string;
  subtotal: number;
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  expiryDate: string;
  active: boolean;
  usageCount: number;
}

export interface SiteContent {
  businessName: string;
  tagline: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  established: string;
  phone: string;
  email: string;
  address: string;
  mapEmbedUrl: string;
  whatsapp: string;
  facebookUrl: string;
  businessHours: string;
  deliveryNote: string;
  heroCtaText: string;
  heroCtaSecondary: string;
  video1: string;
  video2: string;
  video1Title: string;
  video2Title: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  businessName: 'New Glass Center',
  tagline: 'Crafting Clarity Since 1950',
  heroSubtitle: 'Premium glass solutions for decoration, mirrors, and architectural excellence — delivered to your door.',
  aboutTitle: 'A Legacy of Glass Excellence',
  aboutText: 'Founded around 1950, New Glass Center has been the region\'s most trusted name in fine glass craftsmanship. From ornate decorative mirrors to precision-cut architectural glass, we bring beauty and clarity to every space. Located at Koshai Bazaar, our expert team serves homes, businesses, and design professionals alike with unmatched quality and personalized service.',
  established: '1950',
  phone: '01714239064',
  email: 'info@newglasscenter.com',
  address: 'Koshai Bazaar, Bangladesh',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.3!2d90.4!3d23.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ4JzAwLjAiTiA5MMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890',
  whatsapp: '8801714239064',
  facebookUrl: '#',
  businessHours: 'Saturday – Thursday: 9:00 AM – 8:00 PM\nFriday: Closed',
  deliveryNote: 'Free delivery within city limits for orders above ৳5,000',
  heroCtaText: 'Explore Our Collection',
  heroCtaSecondary: 'Place an Order',
  video1: '',
  video2: '',
  video1Title: 'Showroom Showcase',
  video2Title: 'Glass Craftsmanship in Action',
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Premium Mirror Glass',
    category: 'Mirror',
    description: 'High-clarity silver-backed mirror glass perfect for bedrooms, bathrooms, and living spaces. Available in custom sizes with polished, beveled, or raw edges.',
    pricePerSqFt: 850,
    unit: 'per sq. ft',
    image: '/products-preview.png',
    available: true,
    features: ['Crystal clear reflection', 'Moisture resistant', 'Custom edge finishing', 'Anti-corrosion coating'],
  },
  {
    id: 'p2',
    name: 'Tempered Safety Glass',
    category: 'Safety Glass',
    description: 'Heat-treated tempered glass that is 4x stronger than regular glass. Ideal for doors, shower enclosures, railings, and table tops.',
    pricePerSqFt: 1200,
    unit: 'per sq. ft',
    image: '/products-preview.png',
    available: true,
    features: ['4× stronger than standard', 'Shatter-safe fragments', 'Heat & thermal resistant', 'Ideal for high-traffic areas'],
  },
  {
    id: 'p3',
    name: 'Frosted Privacy Glass',
    category: 'Decorative',
    description: 'Elegant acid-etched or sandblasted frosted glass providing privacy without sacrificing natural light. Perfect for office partitions, bathroom windows, and interior doors.',
    pricePerSqFt: 1050,
    unit: 'per sq. ft',
    image: '/products-preview.png',
    available: true,
    features: ['Full privacy with soft light', 'Elegant matte finish', 'Easy to clean', 'Custom etching available'],
  },
  {
    id: 'p4',
    name: 'Decorative Stained Glass',
    category: 'Decorative',
    description: 'Handcrafted stained glass panels with vibrant colors and intricate patterns. A timeless art form that transforms any space into a masterpiece of light and color.',
    pricePerSqFt: 2200,
    unit: 'per sq. ft',
    image: '/products-preview.png',
    available: true,
    features: ['Handcrafted artisan quality', 'Vibrant colorfast pigments', 'Custom pattern design', 'UV resistant'],
  },
  {
    id: 'p5',
    name: 'Float Window Glass',
    category: 'Window Glass',
    description: 'High-quality float glass for windows offering exceptional clarity and insulation. Available in 3mm, 4mm, 5mm, and 6mm thickness for all architectural needs.',
    pricePerSqFt: 600,
    unit: 'per sq. ft',
    image: '/products-preview.png',
    available: true,
    features: ['Optical clarity', 'Multiple thickness options', 'Weather resistant', 'Easy installation'],
  },
  {
    id: 'p6',
    name: 'Glass Showcase / Cabinet',
    category: 'Specialty',
    description: 'Custom-cut glass panels for shop showcases, display cabinets, and retail counters. Ultra-clear low-iron glass for maximum product visibility.',
    pricePerSqFt: 950,
    unit: 'per sq. ft',
    image: '/products-preview.png',
    available: true,
    features: ['Ultra-clear low-iron glass', 'Perfect for retail display', 'Custom cut to size', 'Polished edges included'],
  },
];

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    expiryDate: '2026-12-31',
    active: true,
    usageCount: 0,
  },
  {
    id: 'c2',
    code: 'SAVE500',
    type: 'flat',
    value: 500,
    expiryDate: '2026-09-30',
    active: true,
    usageCount: 0,
  },
];
