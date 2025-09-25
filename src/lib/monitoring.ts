// Production monitoring and health check utilities

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  error?: string;
  timestamp: number;
}

interface SystemHealth {
  overall: 'healthy' | 'unhealthy' | 'degraded';
  services: HealthCheckResult[];
  uptime: number;
  version: string;
}

class ProductionMonitor {
  private healthChecks: Map<string, () => Promise<HealthCheckResult>> =
    new Map();
  private startTime = Date.now();

  constructor() {
    this.registerDefaultHealthChecks();
  }

  // Register default health checks
  private registerDefaultHealthChecks() {
    this.registerHealthCheck(
      'firebase-auth',
      this.checkFirebaseAuth.bind(this)
    );
    this.registerHealthCheck('firestore', this.checkFirestore.bind(this));
    this.registerHealthCheck('storage', this.checkStorage.bind(this));
    this.registerHealthCheck('stripe', this.checkStripe.bind(this));
  }

  // Register a custom health check
  registerHealthCheck(name: string, checkFn: () => Promise<HealthCheckResult>) {
    this.healthChecks.set(name, checkFn);
  }

  // Run all health checks
  async runHealthChecks(): Promise<SystemHealth> {
    const results: HealthCheckResult[] = [];

    for (const [name, checkFn] of this.healthChecks) {
      try {
        const result = await Promise.race([
          checkFn(),
          this.timeoutPromise(name, 5000), // 5 second timeout
        ]);
        results.push(result);
      } catch (error) {
        results.push({
          service: name,
          status: 'unhealthy',
          responseTime: 5000,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        });
      }
    }

    const overall = this.calculateOverallHealth(results);

    return {
      overall,
      services: results,
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  // Calculate overall system health
  private calculateOverallHealth(
    results: HealthCheckResult[]
  ): 'healthy' | 'unhealthy' | 'degraded' {
    const unhealthyCount = results.filter(
      (r) => r.status === 'unhealthy'
    ).length;
    const degradedCount = results.filter((r) => r.status === 'degraded').length;

    if (unhealthyCount > 0) {
      return 'unhealthy';
    } else if (degradedCount > 0) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }

  // Timeout promise helper
  private timeoutPromise(
    serviceName: string,
    timeout: number
  ): Promise<HealthCheckResult> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Health check timeout for ${serviceName}`));
      }, timeout);
    });
  }

  // Firebase Auth health check
  private async checkFirebaseAuth(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();

      // Simple check - if auth object exists and has expected properties
      if (auth && typeof auth.currentUser !== 'undefined') {
        return {
          service: 'firebase-auth',
          status: 'healthy',
          responseTime: performance.now() - startTime,
          timestamp: Date.now(),
        };
      } else {
        throw new Error('Firebase Auth not properly initialized');
      }
    } catch (error) {
      return {
        service: 'firebase-auth',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  // Firestore health check
  private async checkFirestore(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');

      // Try to read a system document (create one if it doesn't exist)
      const healthDoc = doc(db, 'system', 'health');
      await getDoc(healthDoc);

      const responseTime = performance.now() - startTime;

      return {
        service: 'firestore',
        status: responseTime > 1000 ? 'degraded' : 'healthy',
        responseTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        service: 'firestore',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  // Storage health check
  private async checkStorage(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      const { getStorage, ref, getDownloadURL } = await import(
        'firebase/storage'
      );
      const storage = getStorage();

      // Try to get a reference (doesn't actually download)
      const testRef = ref(storage, 'health-check.txt');

      // This will throw if storage is not accessible
      if (storage && testRef) {
        return {
          service: 'storage',
          status: 'healthy',
          responseTime: performance.now() - startTime,
          timestamp: Date.now(),
        };
      } else {
        throw new Error('Storage not accessible');
      }
    } catch (error) {
      return {
        service: 'storage',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  // Stripe health check
  private async checkStripe(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      // Simple check - verify Stripe is configured
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      if (!publishableKey) {
        throw new Error('Stripe publishable key not configured');
      }

      if (!publishableKey.startsWith('pk_')) {
        throw new Error('Invalid Stripe publishable key format');
      }

      return {
        service: 'stripe',
        status: 'healthy',
        responseTime: performance.now() - startTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        service: 'stripe',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  // Log system metrics
  async logMetrics() {
    if (typeof window === 'undefined') return;

    try {
      const health = await this.runHealthChecks();

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🏥 System Health Check');
        console.log('Overall Status:', health.overall);
        console.log('Uptime:', Math.round(health.uptime / 1000), 'seconds');
        health.services.forEach((service) => {
          const icon =
            service.status === 'healthy'
              ? '✅'
              : service.status === 'degraded'
              ? '⚠️'
              : '❌';
          console.log(
            `${icon} ${service.service}: ${service.status} (${Math.round(
              service.responseTime
            )}ms)`
          );
        });
        console.groupEnd();
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        this.sendHealthMetrics(health);
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  // Send health metrics to analytics
  private async sendHealthMetrics(health: SystemHealth) {
    try {
      const { getAnalytics, logEvent } = await import('firebase/analytics');
      const analytics = getAnalytics();

      logEvent(analytics, 'system_health_check', {
        overall_status: health.overall,
        uptime_seconds: Math.round(health.uptime / 1000),
        healthy_services: health.services.filter((s) => s.status === 'healthy')
          .length,
        total_services: health.services.length,
      });

      // Log individual service metrics
      health.services.forEach((service) => {
        logEvent(analytics, 'service_health_check', {
          service_name: service.service,
          status: service.status,
          response_time_ms: Math.round(service.responseTime),
        });
      });
    } catch (error) {
      console.warn('Failed to send health metrics:', error);
    }
  }
}

// Error tracking and reporting
class ErrorTracker {
  private errorQueue: Array<{
    error: Error;
    context: any;
    timestamp: number;
    userId?: string;
    url: string;
  }> = [];

  // Track an error
  trackError(error: Error, context: any = {}) {
    const errorInfo = {
      error,
      context,
      timestamp: Date.now(),
      userId: this.getCurrentUserId(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    this.errorQueue.push(errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Error tracked:', error, context);
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(errorInfo);
    }

    // Keep queue size manageable
    if (this.errorQueue.length > 100) {
      this.errorQueue.shift();
    }
  }

  // Report error to external service
  private async reportError(errorInfo: any) {
    try {
      // Send to Firebase Analytics
      const { getAnalytics, logEvent } = await import('firebase/analytics');
      const analytics = getAnalytics();

      logEvent(analytics, 'application_error', {
        error_message: errorInfo.error.message,
        error_stack: errorInfo.error.stack?.substring(0, 500), // Truncate stack trace
        user_id: errorInfo.userId,
        page_url: errorInfo.url,
      });

      // In a real production app, you might also send to Sentry, LogRocket, etc.
    } catch (error) {
      console.warn('Failed to report error:', error);
    }
  }

  // Get current user ID
  private getCurrentUserId(): string | undefined {
    try {
      return localStorage.getItem('userId') || undefined;
    } catch {
      return undefined;
    }
  }

  // Get error summary
  getErrorSummary() {
    return {
      totalErrors: this.errorQueue.length,
      recentErrors: this.errorQueue.slice(-10),
      errorsByType: this.groupErrorsByType(),
    };
  }

  // Group errors by type
  private groupErrorsByType() {
    return this.errorQueue.reduce((acc, { error }) => {
      const type = error.constructor.name;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Performance metrics collector
class PerformanceCollector {
  private metrics: Array<{
    name: string;
    value: number;
    timestamp: number;
    url: string;
  }> = [];

  // Collect Web Vitals
  collectWebVitals() {
    if (typeof window === 'undefined') return;

    // Use the web-vitals library if available, otherwise use Performance Observer
    this.observeMetric('largest-contentful-paint', 'LCP');
    this.observeMetric('first-input', 'FID');
    this.observeMetric('layout-shift', 'CLS');
  }

  // Observe performance metrics
  private observeMetric(entryType: string, metricName: string) {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          let value = entry.startTime;

          if (entryType === 'first-input') {
            value = entry.processingStart - entry.startTime;
          } else if (entryType === 'layout-shift') {
            value = entry.value;
          }

          this.recordMetric(metricName, value);
        });
      });

      observer.observe({ type: entryType, buffered: true });
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  // Record a performance metric
  recordMetric(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      url: window.location.pathname,
    });

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendMetric(name, value);
    }
  }

  // Send metric to analytics
  private async sendMetric(name: string, value: number) {
    try {
      const { getAnalytics, logEvent } = await import('firebase/analytics');
      const analytics = getAnalytics();

      logEvent(analytics, 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }
}

// Export singleton instances
export const productionMonitor = new ProductionMonitor();
export const errorTracker = new ErrorTracker();
export const performanceCollector = new PerformanceCollector();

// Initialize monitoring in production
export function initializeMonitoring() {
  if (typeof window === 'undefined') return;

  // Start health checks every 5 minutes
  setInterval(() => {
    productionMonitor.logMetrics();
  }, 5 * 60 * 1000);

  // Collect performance metrics
  performanceCollector.collectWebVitals();

  // Global error handler
  window.addEventListener('error', (event) => {
    errorTracker.trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.trackError(new Error(event.reason), {
      type: 'unhandled_promise_rejection',
    });
  });

  console.log('🏥 Production monitoring initialized');
}

// React hook for monitoring
export function useMonitoring() {
  return {
    trackError: errorTracker.trackError.bind(errorTracker),
    recordMetric: performanceCollector.recordMetric.bind(performanceCollector),
    getHealthStatus: productionMonitor.runHealthChecks.bind(productionMonitor),
  };
}
