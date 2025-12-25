import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';
import { ProductionMonitoringProvider } from '@/components/monitoring/ProductionMonitoringProvider';
import { BannerProvider } from '@/contexts/BannerContext';
import InstallPWAPrompt from '@/components/pwa/InstallPWAPrompt';
import PushNotificationPrompt from '@/components/pwa/PushNotificationPrompt';
import CookieConsent from '@/components/legal/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '3arida - Petition Platform for Morocco',
  description:
    'Create and sign petitions to make change happen in Morocco. Join thousands of citizens making their voices heard.',
  keywords: [
    'petition',
    'morocco',
    'change',
    'democracy',
    'activism',
    'عريضة',
    'المغرب',
  ],
  authors: [{ name: '3arida Team' }],
  creator: '3arida',
  publisher: '3arida',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://3arida.ma'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '3arida',
  },
  openGraph: {
    title: '3arida - Petition Platform for Morocco',
    description: 'Create and sign petitions to make change happen in Morocco',
    url: '/',
    siteName: '3arida',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3arida - Petition Platform for Morocco',
    description: 'Create and sign petitions to make change happen in Morocco',
    creator: '@3arida_ma',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Mobile-First Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Theme Colors */}
        <meta name="theme-color" content="#10B981" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Prevent auto-zoom on iOS */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ProductionMonitoringProvider>
          <BannerProvider>
            <AuthProvider>
              <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
                {children}
              </div>
              {/* PWA Components */}
              <InstallPWAPrompt />
              <PushNotificationPrompt />
              {/* Cookie Consent Banner */}
              <CookieConsent />
            </AuthProvider>
          </BannerProvider>
        </ProductionMonitoringProvider>
      </body>
    </html>
  );
}
