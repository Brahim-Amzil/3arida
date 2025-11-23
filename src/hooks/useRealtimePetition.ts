'use client';

import { useEffect, useState } from 'react';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
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

    let unsubscribe: (() => void) | null = null;

    const setupListener = async () => {
      try {
        let docId = petitionIdOrCode;

        // Check if it's a reference code (starts with 3AR- or similar pattern)
        if (petitionIdOrCode.includes('-') || petitionIdOrCode.length < 20) {
          console.log(
            '🔍 Looking up petition by reference code:',
            petitionIdOrCode
          );

          // Query by reference code
          const q = query(
            collection(db, 'petitions'),
            where('referenceCode', '==', petitionIdOrCode)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            docId = querySnapshot.docs[0].id;
            console.log('✅ Found petition ID:', docId);
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

        // Set up real-time listener with the resolved document ID
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

    setupListener();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [petitionIdOrCode]);

  return { petition, loading, error };
};

export default useRealtimePetition;
