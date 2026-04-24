'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  // Minimal UI while redirecting — no header, no nav, no links
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-gray-400 text-sm">...</p>
    </div>
  );
}
