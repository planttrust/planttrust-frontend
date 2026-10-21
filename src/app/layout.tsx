import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PlanTrust — Blockchain Land Investment Platform (XRPL)',
  description:
    'Decentralized land investment platform built on the XRPL Testnet with OCR verification, escrow state machine, AI risk assessment, and cryptographic Merkle proof auditing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#060b13] text-[#f8fafc] font-sans antialiased">
        <Navbar />
        <main className="main-content flex-1 w-full max-w-[1300px] mx-auto px-6 py-10 pb-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
