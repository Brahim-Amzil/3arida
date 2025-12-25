'use client';

import dynamic from 'next/dynamic';

// Dynamically import HeaderModern with no SSR to avoid hydration issues
const Header = dynamic(() => import('./HeaderModern'), {
  ssr: false,
  loading: () => null,
});

export default Header;
