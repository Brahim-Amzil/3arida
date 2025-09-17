'use client';

import { useEffect, useState } from 'react';
import { getPetition } from '@/lib/petitions-mock';
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

    const loadPetition = async () => {
      try {
        setLoading(true);
        const petitionData = await getPetition(petitionId);
        
        if (petitionData) {
          setPetition(petitionData);
          setError('');
        } else {
          setError('Petition not found');
          setPetition(null);
        }
      } catch (err: any) {
        console.error('Error loading petition:', err);
        setError('Failed to load petition');
        setPetition(null);
      } finally {
        setLoading(false);
      }
    };

    loadPetition();
  }, [petitionId]);

  return { petition, loading, error };
};

export default useRealtimePetition;
