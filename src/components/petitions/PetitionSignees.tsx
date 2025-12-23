'use client';

import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Signature {
  id: string;
  name: string;
  location?: {
    city?: string;
    country?: string;
  };
  comment?: string;
  signedAt: Date;
}

interface PetitionSigneesProps {
  petitionId: string;
}

export default function PetitionSignees({ petitionId }: PetitionSigneesProps) {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchSignatures();
  }, [petitionId]);

  const fetchSignatures = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const signaturesRef = collection(db, 'signatures');
      let q = query(
        signaturesRef,
        where('petitionId', '==', petitionId),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          signaturesRef,
          where('petitionId', '==', petitionId),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setHasMore(false);
        return;
      }

      const newSignatures = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.signerName || data.name || 'Anonymous',
          location: data.signerLocation || data.location,
          comment: data.comment,
          signedAt:
            data.createdAt?.toDate() || data.verifiedAt?.toDate() || new Date(),
        };
      });

      if (loadMore) {
        setSignatures((prev) => [...prev, ...newSignatures]);
      } else {
        setSignatures(newSignatures);
        setTotalCount(newSignatures.length);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching signatures:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchSignatures(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (signatures.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="text-gray-500 font-medium">No signatures yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to sign this petition!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {signatures.length.toLocaleString()} Supporters
        </h3>
      </div>

      <div className="space-y-3">
        {signatures.map((signature) => (
          <div
            key={signature.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-medium text-sm">
                      {signature.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {signature.name}
                    </p>
                    {signature.location && (
                      <p className="text-sm text-gray-500">
                        {[signature.location.city, signature.location.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                {signature.comment && (
                  <p className="mt-2 text-sm text-gray-700 italic">
                    "{signature.comment}"
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {signature.signedAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
