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

    const petitionRef = doc(db, 'petitions', petitionId);

    const unsubscribe = onSnapshot(
      petitionRef,
      (doc) => {
        try {
          if (doc.exists()) {
            const data = doc.data();
            const petitionData: Petition = {
              id: doc.id,
              title: data.title,
              description: data.description,
              category: data.category,
              subcategory: data.subcategory,
              targetSignatures: data.targetSignatures,
              currentSignatures: data.currentSignatures,
              status: data.status,
              creatorId: data.creatorId,
              creatorPageId: data.creatorPageId,
              mediaUrls: data.mediaUrls || [],
              qrCodeUrl: data.qrCodeUrl,
              hasQrCode: data.hasQrCode || false,
              hasQrUpgrade: data.hasQrUpgrade || false,
              qrUpgradePaidAt: data.qrUpgradePaidAt?.toDate(),
              pricingTier: data.pricingTier,
              amountPaid: data.amountPaid || 0,
              paymentStatus: data.paymentStatus || 'unpaid',
              location: data.location,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              approvedAt: data.approvedAt?.toDate(),
              pausedAt: data.pausedAt?.toDate(),
              deletedAt: data.deletedAt?.toDate(),
              viewCount: data.viewCount || 0,
              shareCount: data.shareCount || 0,
              moderatedBy: data.moderatedBy,
              moderationNotes: data.moderationNotes,
              isPublic: data.isPublic !== false,
              isActive: data.isActive !== false,
            };
            setPetition(petitionData);
            setError('');
          } else {
            setPetition(null);
            setError('Petition not found');
          }
        } catch (err) {
          console.error('Error processing petition data:', err);
          setError('Failed to load petition data');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to petition:', err);
        setError('Failed to load petition');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [petitionId]);

  return { petition, loading, error };
};

export default useRealtimePetition;
