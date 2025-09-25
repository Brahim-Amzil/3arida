'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getPetition } from '@/lib/petitions';
import { Petition } from '@/types/petition';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X, Pause, Play, Trash2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

export default function AdminPetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user] = useAuthState(getAuth());
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const petitionId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchPetition();
  }, [user, petitionId]);

  const fetchPetition = async () => {
    try {
      const petitionData = await getPetition(petitionId); // This handles both slugs and IDs
      if (petitionData) {
        setPetition(petitionData);
      } else {
        console.error('Petition not found');
        router.push('/admin/petitions');
      }
    } catch (error) {
      console.error('Error fetching petition:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePetitionStatus = async (newStatus: string) => {
    if (!petition) return;

    setUpdating(true);
    try {
      await updateDoc(doc(db, 'petitions', petition.id), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setPetition({ ...petition, status: newStatus });

      // Show success message
      alert(`Petition ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating petition:', error);
      alert('Error updating petition status');
    } finally {
      setUpdating(false);
    }
  };

  const deletePetition = async () => {
    if (!petition) return;

    if (
      !confirm(
        'Are you sure you want to delete this petition? This action cannot be undone.'
      )
    ) {
      return;
    }

    setUpdating(true);
    try {
      await updateDoc(doc(db, 'petitions', petition.id), {
        status: 'deleted',
        deletedAt: new Date(),
      });

      alert('Petition deleted successfully!');
      router.push('/admin/petitions');
    } catch (error) {
      console.error('Error deleting petition:', error);
      alert('Error deleting petition');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Petition Not Found
          </h1>
          <Button onClick={() => router.push('/admin/petitions')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Petitions
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/petitions')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Petitions
          </Button>

          <Badge className={getStatusColor(petition.status)}>
            {petition.status.toUpperCase()}
          </Badge>
        </div>

        {/* Petition Details */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {petition.title}
              </h1>
              <p className="text-gray-600">
                Created by: {petition.creatorName || 'Unknown'} •{' '}
                {new Date(
                  petition.createdAt?.seconds * 1000 || Date.now()
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{petition.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subcategory</p>
                <p className="font-medium">{petition.subcategory || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Signatures</p>
                <p className="font-medium">{petition.currentSignatures || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Required Signatures</p>
                <p className="font-medium">{petition.requiredSignatures}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-900 whitespace-pre-wrap">
                {petition.description}
              </p>
            </div>

            {petition.imageUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Image</p>
                <img
                  src={petition.imageUrl}
                  alt="Petition image"
                  className="max-w-md rounded-lg"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Admin Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Admin Actions</h2>

          <div className="flex flex-wrap gap-3">
            {petition.status === 'pending' && (
              <>
                <Button
                  onClick={() => updatePetitionStatus('approved')}
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => updatePetitionStatus('rejected')}
                  disabled={updating}
                  variant="destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}

            {petition.status === 'approved' && (
              <Button
                onClick={() => updatePetitionStatus('paused')}
                disabled={updating}
                variant="outline"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}

            {petition.status === 'paused' && (
              <Button
                onClick={() => updatePetitionStatus('approved')}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}

            <Button
              onClick={deletePetition}
              disabled={updating}
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>

          {updating && (
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              Updating petition...
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
