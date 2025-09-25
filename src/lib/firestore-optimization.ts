// Firestore query optimization utilities

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  doc,
  QueryConstraint,
  DocumentSnapshot,
  Query,
  CollectionReference,
} from 'firebase/firestore';
import { db } from './firebase';

interface PaginationOptions {
  pageSize?: number;
  lastDoc?: DocumentSnapshot;
  orderField?: string;
  orderDirection?: 'asc' | 'desc';
}

interface QueryOptions {
  filters?: Array<{
    field: string;
    operator: any;
    value: any;
  }>;
  orderBy?: Array<{
    field: string;
    direction?: 'asc' | 'desc';
  }>;
  limit?: number;
  pagination?: PaginationOptions;
}

class FirestoreOptimizer {
  // Optimized petition queries with proper indexing
  async getPetitionsOptimized(options: QueryOptions = {}) {
    const {
      filters = [],
      orderBy: orderByOptions = [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount = 20,
      pagination,
    } = options;

    try {
      const petitionsRef = collection(db, 'petitions');
      const constraints: QueryConstraint[] = [];

      // Add filters - order matters for composite indexes
      // Status filter first (most selective)
      const statusFilter = filters.find((f) => f.field === 'status');
      if (statusFilter) {
        constraints.push(
          where('status', statusFilter.operator, statusFilter.value)
        );
      }

      // Category filter second
      const categoryFilter = filters.find((f) => f.field === 'category');
      if (categoryFilter) {
        constraints.push(
          where('category', categoryFilter.operator, categoryFilter.value)
        );
      }

      // Other filters
      filters
        .filter((f) => f.field !== 'status' && f.field !== 'category')
        .forEach((filter) => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });

      // Add ordering - must match composite index order
      orderByOptions.forEach((order) => {
        constraints.push(orderBy(order.field, order.direction || 'desc'));
      });

      // Add pagination
      if (pagination?.lastDoc) {
        constraints.push(startAfter(pagination.lastDoc));
      }

      // Add limit
      constraints.push(limit(limitCount));

      const q = query(petitionsRef, ...constraints);
      const snapshot = await getDocs(q);

      return {
        docs: snapshot.docs,
        data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === limitCount,
      };
    } catch (error) {
      console.error('Optimized petition query failed:', error);
      throw error;
    }
  }

  // Batch read optimization
  async batchGetDocuments(docRefs: string[], collectionName: string) {
    try {
      const promises = docRefs.map((id) => getDoc(doc(db, collectionName, id)));
      const snapshots = await Promise.all(promises);

      return snapshots
        .filter((snap) => snap.exists())
        .map((snap) => ({ id: snap.id, ...snap.data() }));
    } catch (error) {
      console.error('Batch get documents failed:', error);
      throw error;
    }
  }

  // Optimized search with multiple strategies
  async searchPetitions(searchTerm: string, options: QueryOptions = {}) {
    const { limit: limitCount = 10 } = options;

    try {
      // Strategy 1: Exact title match (fastest)
      const exactMatches = await this.searchByExactTitle(
        searchTerm,
        limitCount
      );

      if (exactMatches.length >= limitCount) {
        return exactMatches;
      }

      // Strategy 2: Title prefix match
      const prefixMatches = await this.searchByTitlePrefix(
        searchTerm,
        limitCount - exactMatches.length
      );

      // Strategy 3: Category match (if still need more results)
      const categoryMatches =
        exactMatches.length + prefixMatches.length < limitCount
          ? await this.searchByCategory(
              searchTerm,
              limitCount - exactMatches.length - prefixMatches.length
            )
          : [];

      // Combine and deduplicate results
      const allResults = [
        ...exactMatches,
        ...prefixMatches,
        ...categoryMatches,
      ];
      const uniqueResults = allResults.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      return uniqueResults.slice(0, limitCount);
    } catch (error) {
      console.error('Search petitions failed:', error);
      throw error;
    }
  }

  // Search strategies
  private async searchByExactTitle(searchTerm: string, limitCount: number) {
    const q = query(
      collection(db, 'petitions'),
      where('status', '==', 'approved'),
      where('title', '==', searchTerm),
      orderBy('currentSignatures', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  private async searchByTitlePrefix(searchTerm: string, limitCount: number) {
    const endTerm =
      searchTerm.slice(0, -1) +
      String.fromCharCode(searchTerm.charCodeAt(searchTerm.length - 1) + 1);

    const q = query(
      collection(db, 'petitions'),
      where('status', '==', 'approved'),
      where('title', '>=', searchTerm),
      where('title', '<', endTerm),
      orderBy('title'),
      orderBy('currentSignatures', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  private async searchByCategory(searchTerm: string, limitCount: number) {
    const q = query(
      collection(db, 'petitions'),
      where('status', '==', 'approved'),
      where('category', '==', searchTerm.toLowerCase()),
      orderBy('currentSignatures', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Optimized aggregation queries
  async getPetitionStats(creatorId?: string) {
    try {
      const constraints: QueryConstraint[] = [
        where('status', '==', 'approved'),
      ];

      if (creatorId) {
        constraints.push(where('creatorId', '==', creatorId));
      }

      const q = query(collection(db, 'petitions'), ...constraints);
      const snapshot = await getDocs(q);

      // Calculate stats in memory (more efficient than multiple queries)
      const stats = snapshot.docs.reduce(
        (acc, doc) => {
          const data = doc.data();
          acc.totalPetitions++;
          acc.totalSignatures += data.currentSignatures || 0;

          if (data.currentSignatures >= data.requiredSignatures) {
            acc.successfulPetitions++;
          }

          return acc;
        },
        {
          totalPetitions: 0,
          totalSignatures: 0,
          successfulPetitions: 0,
        }
      );

      return {
        ...stats,
        averageSignatures:
          stats.totalPetitions > 0
            ? Math.round(stats.totalSignatures / stats.totalPetitions)
            : 0,
        successRate:
          stats.totalPetitions > 0
            ? Math.round(
                (stats.successfulPetitions / stats.totalPetitions) * 100
              )
            : 0,
      };
    } catch (error) {
      console.error('Get petition stats failed:', error);
      throw error;
    }
  }

  // Query performance monitoring
  async monitorQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await queryFn();
      const duration = performance.now() - startTime;

      // Log slow queries
      if (duration > 1000) {
        // 1 second threshold
        console.warn(
          `Slow Firestore query detected: ${queryName} took ${duration}ms`
        );
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        this.logQueryPerformance(queryName, duration);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(
        `Firestore query failed: ${queryName} (${duration}ms)`,
        error
      );
      throw error;
    }
  }

  private logQueryPerformance(queryName: string, duration: number) {
    // In production, send to Firebase Analytics or monitoring service
    if (typeof window !== 'undefined') {
      import('firebase/analytics').then(({ getAnalytics, logEvent }) => {
        try {
          const analytics = getAnalytics();
          logEvent(analytics, 'firestore_query_performance', {
            query_name: queryName,
            duration_ms: Math.round(duration),
            is_slow: duration > 1000,
          });
        } catch (error) {
          console.warn('Failed to log query performance:', error);
        }
      });
    }
  }
}

// Query builder for complex queries
export class QueryBuilder {
  private constraints: QueryConstraint[] = [];
  private collectionRef: CollectionReference;

  constructor(collectionName: string) {
    this.collectionRef = collection(db, collectionName);
  }

  where(field: string, operator: any, value: any) {
    this.constraints.push(where(field, operator, value));
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'desc') {
    this.constraints.push(orderBy(field, direction));
    return this;
  }

  limit(count: number) {
    this.constraints.push(limit(count));
    return this;
  }

  startAfter(doc: DocumentSnapshot) {
    this.constraints.push(startAfter(doc));
    return this;
  }

  build(): Query {
    return query(this.collectionRef, ...this.constraints);
  }

  async execute() {
    const q = this.build();
    const snapshot = await getDocs(q);
    return {
      docs: snapshot.docs,
      data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
  }
}

// Firestore indexes configuration generator
export function generateIndexConfig() {
  return {
    indexes: [
      // Petition queries
      {
        collectionGroup: 'petitions',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'status', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' },
        ],
      },
      {
        collectionGroup: 'petitions',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'status', order: 'ASCENDING' },
          { fieldPath: 'category', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' },
        ],
      },
      {
        collectionGroup: 'petitions',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'status', order: 'ASCENDING' },
          { fieldPath: 'currentSignatures', order: 'DESCENDING' },
        ],
      },
      {
        collectionGroup: 'petitions',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'creatorId', order: 'ASCENDING' },
          { fieldPath: 'status', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' },
        ],
      },
      // Search indexes
      {
        collectionGroup: 'petitions',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'status', order: 'ASCENDING' },
          { fieldPath: 'title', order: 'ASCENDING' },
          { fieldPath: 'currentSignatures', order: 'DESCENDING' },
        ],
      },
      // Signature queries
      {
        collectionGroup: 'signatures',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'petitionId', order: 'ASCENDING' },
          { fieldPath: 'signedAt', order: 'DESCENDING' },
        ],
      },
      {
        collectionGroup: 'signatures',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'signedAt', order: 'DESCENDING' },
        ],
      },
    ],
  };
}

// Export singleton
export const firestoreOptimizer = new FirestoreOptimizer();

// React hooks for optimized queries
export function useOptimizedQuery() {
  return {
    getPetitions:
      firestoreOptimizer.getPetitionsOptimized.bind(firestoreOptimizer),
    searchPetitions:
      firestoreOptimizer.searchPetitions.bind(firestoreOptimizer),
    getPetitionStats:
      firestoreOptimizer.getPetitionStats.bind(firestoreOptimizer),
    monitorQuery: firestoreOptimizer.monitorQuery.bind(firestoreOptimizer),
  };
}
