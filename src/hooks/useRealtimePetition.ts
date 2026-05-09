'use client';

import { useEffect, useState } from 'react';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Petition } from '@/types/petition';

export const useRealtimePetition = (petitionIdOrCode: string) => {
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!petitionIdOrCode) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    let resolvedDocId: string | null = null;

    const detach = () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    };

    const attach = async () => {
      detach();
      if (cancelled) return;
      try {
        let docId = resolvedDocId;
        if (!docId) {
          let id = petitionIdOrCode;
          const isReferenceCode =
            petitionIdOrCode.includes('-') && petitionIdOrCode.length <= 15;

          if (isReferenceCode) {
            console.log(
              '🔍 Looking up petition by reference code:',
              petitionIdOrCode
            );

            const q = query(
              collection(db, 'petitions'),
              where('referenceCode', '==', petitionIdOrCode),
              limit(1)
            );

            const querySnapshot = await getDocs(q);

            if (cancelled) return;

            if (!querySnapshot.empty) {
              id = querySnapshot.docs[0].id;
              console.log('✅ Found petition ID:', id);
            } else {
              console.log(
                '❌ No petition found with reference code:',
                petitionIdOrCode
              );
              setError('Petition not found');
              setPetition(null);
              setLoading(false);
              return;
            }
          }

          resolvedDocId = id;
          docId = id;
        }

        if (cancelled) return;

        const petitionRef = doc(db, 'petitions', docId);

        unsubscribe = onSnapshot(
          petitionRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setPetition({
                id: snapshot.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || new Date(),
                updatedAt: data.updatedAt?.toDate?.() || new Date(),
              } as Petition);
              setError('');
            } else {
              setError('Petition not found');
              setPetition(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error('❌ Error listening to petition:', err);
            setError('Failed to load petition');
            setPetition(null);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('❌ Error setting up petition listener:', err);
        setError('Failed to load petition');
        setPetition(null);
        setLoading(false);
      }
    };

    const onVisibilityChange = () => {
      if (typeof document === 'undefined') return;
      if (document.visibilityState === 'hidden') {
        detach();
      } else {
        void attach();
      }
    };

    void attach();
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
      cancelled = true;
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
      detach();
    };
  }, [petitionIdOrCode]);

  return { petition, loading, error };
};

export default useRealtimePetition;
