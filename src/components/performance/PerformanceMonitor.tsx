'use client';

import { useEffect, useState } from 'react';
import { performanceMonitor, ResourceOptimizer } from '@/lib/performance';

interface PerformanceMonitorProps {
  children: React.ReactNode;
  enableWebVitals?: boolean;
  enableResourceOptimization?: boolean;
}

export function PerformanceMonitor({
  children,
  enableWebVitals = true,
  enableResourceOptimization = true,
}: PerformanceMonitorProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize performance monitoring
    if (enableWebVitals) {
      performanceMonitor.measureWebVitals();
    }

    // Initialize resource optimization
    if (enableResourceOptimization) {
      ResourceOptimizer.preloadCriticalResources();
      ResourceOptimizer.lazyLoadImages();
    }

    // Monitor page load performance
    const handleLoad = () => {
      const loadTime = performance.now();
      performanceMonitor.measureCustomMetric('PAGE_LOAD', 0);

      // Log page load time
      console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    };

    // Monitor navigation performance
    const handleBeforeUnload = () => {
      const summary = performanceMonitor.getPerformanceSummary();
      console.log('Performance Summary:', summary);
    };

    window.addEventListener('load', handleLoad);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enableWebVitals, enableResourceOptimization]);

  return <>{children}</>;
}

// Performance debugging component (development only)
export function PerformanceDebugger() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const debugInterval = setInterval(() => {
      const summary = performanceMonitor.getPerformanceSummary();
      if (summary.totalMetrics > 0) {
        console.group('🚀 Performance Debug');
        console.log('Total Metrics:', summary.totalMetrics);
        console.log('Averages:', summary.averageByType);
        console.log('Recent Metrics:', summary.recentMetrics);
        console.groupEnd();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(debugInterval);
  }, []);

  return null;
}

// Component performance wrapper
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceWrappedComponent(props: T) {
    useEffect(() => {
      const monitor = performanceMonitor.measureComponentRender(componentName);
      monitor.start();

      return () => {
        monitor.end();
      };
    });

    return <Component {...props} />;
  };
}

// Performance metrics display (admin only)
export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const updateMetrics = () => {
      const summary = performanceMonitor.getPerformanceSummary();
      setMetrics(summary);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!metrics || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h4 className="font-bold mb-2">Performance Metrics</h4>
      <div className="space-y-1">
        <div>Total Metrics: {metrics.totalMetrics}</div>
        {Object.entries(metrics.averageByType).map(([name, avg]) => (
          <div key={name}>
            {name}: {Math.round(avg as number)}ms
          </div>
        ))}
      </div>
    </div>
  );
}
