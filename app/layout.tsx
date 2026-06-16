import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "New Glass Center | Premium Glass for Decoration, Mirrors & Windows",
  description:
    "New Glass Center — Est. ~1950. Premium quality glass for decoration, mirrors, windows, and custom architectural solutions. Located at Koshai Bazaar. Call 01714239064.",
  keywords:
    "glass, mirror glass, decorative glass, window glass, tempered glass, frosted glass, Bangladesh, Koshai Bazaar",
  openGraph: {
    title: "New Glass Center | Premium Glass Solutions",
    description:
      "Premium quality glass for decoration, mirrors, windows, and custom architectural solutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
