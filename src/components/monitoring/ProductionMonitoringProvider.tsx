'use client';

import { useEffect } from 'react';
import { initializeMonitoring } from '@/lib/monitoring';
import { validateEnvironmentOnStartup } from '@/lib/env-validator';

interface ProductionMonitoringProviderProps {
  children: React.ReactNode;
}

export function ProductionMonitoringProvider({
  children,
}: ProductionMonitoringProviderProps) {
  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;

    const initializeApp = async () => {
      try {
        // Only validate environment in production
        if (process.env.NODE_ENV === 'production') {
          const isValidEnv = await validateEnvironmentOnStartup();

          if (!isValidEnv) {
            console.error('❌ Environment validation failed in production');
            return;
          }
        }

        // Initialize production monitoring only in production
        if (process.env.NODE_ENV === 'production') {
          initializeMonitoring();
        }

        // Log startup success
        console.log('🚀 3arida Petition Platform initialized successfully');

        // Send startup event to analytics
        if (process.env.NODE_ENV === 'production') {
          try {
            const { getAnalytics, logEvent } = await import(
              'firebase/analytics'
            );
            const analytics = getAnalytics();
            logEvent(analytics, 'app_startup', {
              environment: process.env.NODE_ENV,
              timestamp: Date.now(),
            });
          } catch (error) {
            console.warn('Failed to log startup event:', error);
          }
        }
      } catch (error) {
        console.error('❌ Failed to initialize application:', error);

        // Track initialization error
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('app-initialization-error', {
              detail: { error },
            })
          );
        }
      }
    };

    initializeApp();
  }, []);

  return <>{children}</>;
}

// Error boundary for production monitoring
export function ProductionErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);

      // Send to monitoring service
      if (process.env.NODE_ENV === 'production') {
        import('@/lib/monitoring').then(({ errorTracker }) => {
          errorTracker.trackError(event.error, {
            type: 'global_error',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          });
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);

      // Send to monitoring service
      if (process.env.NODE_ENV === 'production') {
        import('@/lib/monitoring').then(({ errorTracker }) => {
          errorTracker.trackError(new Error(event.reason), {
            type: 'unhandled_promise_rejection',
          });
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, []);

  return <>{children}</>;
}
