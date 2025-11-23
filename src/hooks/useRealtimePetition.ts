'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Petition } from '@/types/petition';

export const useRealtimePetition = (petitionId: string) => {
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!petitionId) {
      setLoading(false);
      return;
    }

    // Set up real-time listener
    const petitionRef = doc(db, 'petitions', petitionId);

    const unsubscribe = onSnapshot(
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
        console.error('Error listening to petition:', err);
        setError('Failed to load petition');
        setPetition(null);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [petitionId]);

  return { petition, loading, error };
};

export default useRealtimePetition;
