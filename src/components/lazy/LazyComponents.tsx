'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
  </div>
);

const LoadingCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-48 w-full mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// Lazy-loaded components with loading states
export const LazyPetitionAnalytics = dynamic(
  () => import('../petitions/PetitionAnalytics'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Analytics don't need SSR
  }
);

export const LazyRealtimeDashboard = dynamic(
  () => import('../dashboard/RealtimeDashboard'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Real-time features don't need SSR
  }
);

export const LazyQRCodeDisplay = dynamic(
  () => import('../petitions/QRCodeDisplay'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // QR codes don't need SSR
  }
);

export const LazyQRUpgrade = dynamic(() => import('../petitions/QRUpgrade'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Payment modals don't need SSR
});

export const LazyPetitionComments = dynamic(
  () => import('../petitions/PetitionComments'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Comments can be loaded after initial render
  }
);

export const LazyNotificationCenter = dynamic(
  () => import('../notifications/NotificationCenter'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Notifications don't need SSR
  }
);

export const LazyCaptchaProtection = dynamic(
  () => import('../security/CaptchaProtection'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // CAPTCHA should be client-side only
  }
);

// Admin components (heavy and rarely used)
export const LazyAdminDashboard = dynamic(
  () =>
    import('../../app/admin/page').then((mod) => ({ default: mod.default })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyAdminUsers = dynamic(
  () =>
    import('../../app/admin/users/page').then((mod) => ({
      default: mod.default,
    })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyAdminPetitions = dynamic(
  () =>
    import('../../app/admin/petitions/page').then((mod) => ({
      default: mod.default,
    })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Petition creation form (heavy with validation)
export const LazyPetitionCreateForm = dynamic(
  () =>
    import('../../app/petitions/create/page').then((mod) => ({
      default: mod.default,
    })),
  {
    loading: () => (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Analytics dashboard (data-heavy)
export const LazyAnalyticsDashboard = dynamic(
  () =>
    import('../../app/dashboard/analytics/[id]/page').then((mod) => ({
      default: mod.default,
    })),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Utility function for conditional lazy loading
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loading?: () => JSX.Element;
    ssr?: boolean;
    condition?: () => boolean;
  } = {}
) => {
  const { loading = LoadingSpinner, ssr = true, condition } = options;

  if (condition && !condition()) {
    return null;
  }

  return dynamic(importFn, {
    loading,
    ssr,
  });
};

// Export loading components for reuse
export { LoadingSpinner, LoadingCard };
