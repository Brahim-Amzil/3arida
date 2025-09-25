import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';
import { ProductionMonitoringProvider } from '@/components/monitoring/ProductionMonitoringProvider';

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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#22c55e" />
      </head>
      <body className={inter.className}>
        <ProductionMonitoringProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">{children}</div>
          </AuthProvider>
        </ProductionMonitoringProvider>
      </body>
    </html>
  );
}
