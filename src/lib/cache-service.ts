// Advanced caching service for API calls and data management

import { CacheManager } from './performance';

interface CacheConfig {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  maxAge?: number;
  tags?: string[];
}

interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
  etag?: string;
}

class CacheService {
  private memoryCache = new Map<string, CachedData<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_MEMORY_ENTRIES = 100;

  // Get data with cache-first strategy
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig = {}
  ): Promise<T> {
    const {
      ttl = this.DEFAULT_TTL,
      staleWhileRevalidate = true,
      tags = [],
    } = config;

    // Check memory cache first
    const memoryData = this.memoryCache.get(key);
    if (memoryData && !this.isExpired(memoryData)) {
      return memoryData.data;
    }

    // Check localStorage cache
    const cachedData = CacheManager.get<CachedData<T>>(key);
    if (cachedData && !this.isExpired(cachedData)) {
      // Update memory cache
      this.memoryCache.set(key, cachedData);
      return cachedData.data;
    }

    // Handle stale-while-revalidate
    if (staleWhileRevalidate && cachedData) {
      // Return stale data immediately
      const staleData = cachedData.data;

      // Revalidate in background
      this.revalidateInBackground(key, fetcher, { ttl, tags });

      return staleData;
    }

    // Fetch fresh data
    const freshData = await fetcher();
    this.set(key, freshData, { ttl, tags });

    return freshData;
  }

  // Set data in cache
  set<T>(key: string, data: T, config: CacheConfig = {}) {
    const { ttl = this.DEFAULT_TTL, tags = [] } = config;

    const cachedData: CachedData<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags,
    };

    // Update memory cache
    this.memoryCache.set(key, cachedData);
    this.cleanupMemoryCache();

    // Update localStorage cache
    CacheManager.set(key, cachedData, ttl);
  }

  // Invalidate cache by key
  invalidate(key: string) {
    this.memoryCache.delete(key);
    CacheManager.remove(key);
  }

  // Invalidate cache by tags
  invalidateByTags(tags: string[]) {
    // Memory cache
    const keysToDelete: string[] = [];
    this.memoryCache.forEach((data, key) => {
      if (data.tags.some((tag: string) => tags.includes(tag))) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.memoryCache.delete(key));

    // localStorage cache - need to iterate through all keys
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('3arida_cache_')) {
          try {
            const cached = localStorage.getItem(key);
            if (cached) {
              const data = JSON.parse(cached);
              if (
                data.tags &&
                data.tags.some((tag: string) => tags.includes(tag))
              ) {
                keysToRemove.push(key.replace('3arida_cache_', ''));
              }
            }
          } catch (error) {
            console.warn('Error checking cache tags:', error);
          }
        }
      }

      keysToRemove.forEach((key) => CacheManager.remove(key));
    }
  }

  // Preload data into cache
  async preload<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig = {}
  ) {
    try {
      const data = await fetcher();
      this.set(key, data, config);
    } catch (error) {
      console.warn(`Failed to preload cache for ${key}:`, error);
    }
  }

  // Batch operations
  async getBatch<T>(
    requests: Array<{
      key: string;
      fetcher: () => Promise<T>;
      config?: CacheConfig;
    }>
  ): Promise<Record<string, T>> {
    const results = await Promise.allSettled(
      requests.map(async ({ key, fetcher, config }) => ({
        key,
        data: await this.get(key, fetcher, config),
      }))
    );

    return results.reduce((acc, result, index) => {
      if (result.status === 'fulfilled') {
        acc[result.value.key] = result.value.data;
      } else {
        console.warn(`Failed to fetch ${requests[index].key}:`, result.reason);
      }
      return acc;
    }, {} as Record<string, T>);
  }

  // Private methods
  private isExpired<T>(cachedData: CachedData<T>): boolean {
    return Date.now() - cachedData.timestamp > cachedData.ttl;
  }

  private async revalidateInBackground<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: { ttl: number; tags: string[] }
  ) {
    try {
      const freshData = await fetcher();
      this.set(key, freshData, config);
    } catch (error) {
      console.warn(`Background revalidation failed for ${key}:`, error);
    }
  }

  private cleanupMemoryCache() {
    if (this.memoryCache.size > this.MAX_MEMORY_ENTRIES) {
      // Remove oldest entries
      const entries = Array.from(this.memoryCache.entries());
      entries
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, entries.length - this.MAX_MEMORY_ENTRIES)
        .forEach(([key]) => this.memoryCache.delete(key));
    }
  }

  // Cache statistics
  getStats() {
    return {
      memoryEntries: this.memoryCache.size,
      localStorageEntries: this.getLocalStorageEntries(),
    };
  }

  private getLocalStorageEntries(): number {
    if (typeof window === 'undefined') return 0;

    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('3arida_cache_')) {
        count++;
      }
    }
    return count;
  }
}

// Petition-specific cache utilities
export class PetitionCacheService extends CacheService {
  // Cache petition list with filtering
  async getPetitions(filters: any = {}) {
    const cacheKey = `petitions_${JSON.stringify(filters)}`;
    return this.get(cacheKey, () => this.fetchPetitions(filters), {
      ttl: 2 * 60 * 1000, // 2 minutes for petition lists
      tags: ['petitions', 'petition-list'],
      staleWhileRevalidate: true,
    });
  }

  // Cache individual petition
  async getPetition(id: string) {
    return this.get(`petition_${id}`, () => this.fetchPetition(id), {
      ttl: 5 * 60 * 1000, // 5 minutes for individual petitions
      tags: ['petitions', `petition-${id}`],
      staleWhileRevalidate: true,
    });
  }

  // Cache user's petitions
  async getUserPetitions(userId: string) {
    return this.get(
      `user_petitions_${userId}`,
      () => this.fetchUserPetitions(userId),
      {
        ttl: 3 * 60 * 1000, // 3 minutes
        tags: ['petitions', 'user-petitions', `user-${userId}`],
      }
    );
  }

  // Cache petition analytics
  async getPetitionAnalytics(petitionId: string) {
    return this.get(
      `analytics_${petitionId}`,
      () => this.fetchPetitionAnalytics(petitionId),
      {
        ttl: 1 * 60 * 1000, // 1 minute for analytics (more frequent updates)
        tags: ['analytics', `petition-${petitionId}`],
        staleWhileRevalidate: true,
      }
    );
  }

  // Invalidate petition-related caches
  invalidatePetitionCaches(petitionId?: string) {
    if (petitionId) {
      this.invalidateByTags([`petition-${petitionId}`]);
    } else {
      this.invalidateByTags(['petitions']);
    }
  }

  // Preload related petitions
  async preloadRelatedPetitions(category: string, excludeId?: string) {
    const cacheKey = `related_petitions_${category}_${excludeId || 'none'}`;
    return this.preload(
      cacheKey,
      () => this.fetchRelatedPetitions(category, excludeId),
      {
        ttl: 10 * 60 * 1000, // 10 minutes
        tags: ['petitions', 'related-petitions'],
      }
    );
  }

  // Fetch methods (these would call your actual API)
  private async fetchPetitions(filters: any) {
    // Implementation would call your petition service
    const { getPetitions } = await import('./petitions');
    return getPetitions(filters);
  }

  private async fetchPetition(id: string) {
    const { getPetition } = await import('./petitions');
    return getPetition(id);
  }

  private async fetchUserPetitions(userId: string) {
    const { getUserPetitions } = await import('./petitions');
    return getUserPetitions(userId);
  }

  private async fetchPetitionAnalytics(petitionId: string) {
    // Implementation would call your analytics service
    const { getPetitionAnalytics } = await import('./petitions');
    return getPetitionAnalytics(petitionId);
  }

  private async fetchRelatedPetitions(category: string, excludeId?: string) {
    const { getRelatedPetitions } = await import('./petitions');
    return getRelatedPetitions(category, excludeId);
  }
}

// Export singleton instances
export const cacheService = new CacheService();
export const petitionCache = new PetitionCacheService();

// React hook for cache management
export function useCache() {
  return {
    get: cacheService.get.bind(cacheService),
    set: cacheService.set.bind(cacheService),
    invalidate: cacheService.invalidate.bind(cacheService),
    invalidateByTags: cacheService.invalidateByTags.bind(cacheService),
    preload: cacheService.preload.bind(cacheService),
  };
}
