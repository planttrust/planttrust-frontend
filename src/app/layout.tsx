import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AuthProvider } from '@/shared/auth/AuthProvider';
import './globals.css';

const nunito = localFont({
  src: [
    { path: './fonts/nunito-400.ttf', weight: '400', style: 'normal' },
    { path: './fonts/nunito-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Plantrust', template: '%s · Plantrust' },
  description: 'Verified land investment: GPS-checked projects, escrow and on-chain proof.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-body text-ink">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
