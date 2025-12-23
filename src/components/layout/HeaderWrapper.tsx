'use client';

import dynamic from 'next/dynamic';

// Dynamically import Header with no SSR to avoid hydration issues
const Header = dynamic(() => import('./Header'), {
  ssr: false,
  loading: () => null,
});

export default Header;
