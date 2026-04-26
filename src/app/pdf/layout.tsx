import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default function PDFLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Clean layout with no website UI elements
  // Prevents cookie consent, navigation, footer, etc. from rendering
  return children;
}
