// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  name: string;
  value: number;
  timestamp: number;
  url?: string;
  userId?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled =
      typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
  }

  // Measure Web Vitals
  measureWebVitals() {
    if (!this.isEnabled) return;

    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entry) => {
      this.recordMetric('LCP', entry.startTime);
    });

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entry) => {
      this.recordMetric('FID', entry.processingStart - entry.startTime);
    });

    // Cumulative Layout Shift (CLS)
    this.observePerformanceEntry('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.recordMetric('CLS', entry.value);
      }
    });
  }

  // Measure custom performance metrics
  measureCustomMetric(name: string, startTime: number) {
    if (!this.isEnabled) return;

    const duration = performance.now() - startTime;
    this.recordMetric(name, duration);
  }

  // Measure API response times
  measureApiCall<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return apiCall();

    const startTime = performance.now();

    return apiCall()
      .then((result) => {
        this.measureCustomMetric(`API_${name}`, startTime);
        return result;
      })
      .catch((error) => {
        this.measureCustomMetric(`API_${name}_ERROR`, startTime);
        throw error;
      });
  }

  // Measure component render time
  measureComponentRender(componentName: string) {
    if (!this.isEnabled) return { start: () => {}, end: () => {} };

    let startTime: number;

    return {
      start: () => {
        startTime = performance.now();
      },
      end: () => {
        this.measureCustomMetric(`RENDER_${componentName}`, startTime);
      },
    };
  }

  // Record performance metric
  private recordMetric(name: string, value: number) {
    const metric: PerformanceMetrics = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.pathname,
      userId: this.getCurrentUserId(),
    };

    this.metrics.push(metric);

    // Send to analytics service (Firebase Analytics)
    this.sendToAnalytics(metric);

    // Log performance issues
    this.checkPerformanceThresholds(metric);
  }

  // Performance observer helper
  private observePerformanceEntry(
    type: string,
    callback: (entry: any) => void
  ) {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });

      observer.observe({ type, buffered: true });
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  // Send metrics to Firebase Analytics
  private sendToAnalytics(metric: PerformanceMetrics) {
    if (typeof window === 'undefined') return;

    // Import Firebase Analytics dynamically to avoid SSR issues
    import('firebase/analytics').then(({ getAnalytics, logEvent }) => {
      try {
        const analytics = getAnalytics();
        logEvent(analytics, 'performance_metric', {
          metric_name: metric.name,
          metric_value: Math.round(metric.value),
          page_path: metric.url,
        });
      } catch (error) {
        console.warn('Failed to send performance metric:', error);
      }
    });
  }

  // Check performance thresholds and log warnings
  private checkPerformanceThresholds(metric: PerformanceMetrics) {
    const thresholds = {
      LCP: 2500, // 2.5 seconds
      FID: 100, // 100ms
      CLS: 0.1, // 0.1
      API_: 3000, // 3 seconds for API calls
      RENDER_: 16, // 16ms for 60fps
    };

    const threshold = Object.entries(thresholds).find(([key]) =>
      metric.name.startsWith(key)
    )?.[1];

    if (threshold && metric.value > threshold) {
      console.warn(
        `Performance threshold exceeded: ${metric.name} = ${metric.value}ms (threshold: ${threshold}ms)`
      );

      // Send warning to monitoring service
      this.sendPerformanceWarning(metric, threshold);
    }
  }

  // Send performance warnings to monitoring service
  private sendPerformanceWarning(
    metric: PerformanceMetrics,
    threshold: number
  ) {
    // In production, this would send to a monitoring service like Sentry
    if (process.env.NODE_ENV === 'production') {
      console.error('Performance Warning:', {
        metric: metric.name,
        value: metric.value,
        threshold,
        url: metric.url,
        timestamp: metric.timestamp,
      });
    }
  }

  // Get current user ID for tracking
  private getCurrentUserId(): string | undefined {
    try {
      // This would integrate with your auth system
      return localStorage.getItem('userId') || undefined;
    } catch {
      return undefined;
    }
  }

  // Get performance summary
  getPerformanceSummary() {
    return {
      totalMetrics: this.metrics.length,
      averageByType: this.calculateAverages(),
      recentMetrics: this.metrics.slice(-10),
    };
  }

  // Calculate average metrics by type
  private calculateAverages() {
    const grouped = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(grouped).reduce((acc, [name, values]) => {
      acc[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Resource loading optimization
export class ResourceOptimizer {
  // Preload critical resources
  static preloadCriticalResources() {
    if (typeof window === 'undefined') return;

    const criticalResources = ['/images/logo.svg'];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.woff2') ? 'font' : 'image';
      if (link.as === 'font') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  // Lazy load images with intersection observer
  static lazyLoadImages() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window))
      return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Prefetch next page resources
  static prefetchNextPage(href: string) {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
}

// Cache management
export class CacheManager {
  private static readonly CACHE_PREFIX = '3arida_cache_';
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // Set cache with TTL
  static set(key: string, data: any, ttl: number = this.DEFAULT_TTL) {
    if (typeof window === 'undefined') return;

    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to set cache:', error);
    }
  }

  // Get cache if not expired
  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(this.CACHE_PREFIX + key);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const isExpired = Date.now() - cacheData.timestamp > cacheData.ttl;

      if (isExpired) {
        this.remove(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.warn('Failed to get cache:', error);
      return null;
    }
  }

  // Remove cache entry
  static remove(key: string) {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.CACHE_PREFIX + key);
    } catch (error) {
      console.warn('Failed to remove cache:', error);
    }
  }

  // Clear all cache
  static clear() {
    if (typeof window === 'undefined') return;

    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.CACHE_PREFIX))
        .forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Performance hooks for React components
export const usePerformanceMonitor = () => {
  return {
    measureRender: (componentName: string) =>
      performanceMonitor.measureComponentRender(componentName),
    measureApi: <T>(name: string, apiCall: () => Promise<T>) =>
      performanceMonitor.measureApiCall(name, apiCall),
  };
};
