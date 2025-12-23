'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPetitionById } from '@/lib/petitions';
import { Petition } from '@/types/petition';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { AlertCircle } from 'lucide-react';

const MAX_RESUBMISSIONS = 3;

export default function EditPetitionPage() {
  const params = useParams();
  const router = useRouter();
  const petitionId = params?.id as string;
  const { user, userProfile } = useAuth();

  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [targetSignatures, setTargetSignatures] = useState(2500);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>([]);

  useEffect(() => {
    const loadPetition = async () => {
      if (!petitionId) return;

      try {
        const data = await getPetitionById(petitionId);
        if (!data) {
          setError('Petition not found');
          setLoading(false);
          return;
        }

        // Check if user is the creator
        if (data.creatorId !== user?.uid) {
          setError('You do not have permission to edit this petition');
          setLoading(false);
          return;
        }

        // Check if petition is rejected
        if (data.status !== 'rejected') {
          setError('Only rejected petitions can be edited and resubmitted');
          setLoading(false);
          return;
        }

        // Check resubmission limit
        const resubmissionCount = data.resubmissionCount || 0;
        if (resubmissionCount >= MAX_RESUBMISSIONS) {
          setError(
            `You have reached the maximum number of resubmissions (${MAX_RESUBMISSIONS})`
          );
          setLoading(false);
          return;
        }

        setPetition(data);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setTargetSignatures(data.targetSignatures);
        setExistingMediaUrls(data.mediaUrls || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading petition:', err);
        setError('Failed to load petition');
        setLoading(false);
      }
    };

    if (user) {
      loadPetition();
    }
  }, [petitionId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petition || !user) return;

    setSaving(true);
    setError('');

    try {
      // Upload new media files if any
      let newMediaUrls: string[] = [];
      if (mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const timestamp = Date.now();
          const extension = file.name.split('.').pop();
          const filename = `${user.uid}_${timestamp}_${Math.random().toString(36).substring(7)}.${extension}`;
          const storageRef = ref(storage, `petition-media/${filename}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          newMediaUrls.push(downloadURL);
        }
      }

      // Combine existing and new media URLs
      const allMediaUrls = [...existingMediaUrls, ...newMediaUrls];

      // Update resubmission history - mark the last rejection as resubmitted
      const resubmissionHistory = petition.resubmissionHistory || [];

      // Convert to Firestore-compatible format
      const historyForFirestore = resubmissionHistory.map((entry, index) => {
        const isLast = index === resubmissionHistory.length - 1;
        return {
          rejectedAt:
            entry.rejectedAt instanceof Date
              ? Timestamp.fromDate(entry.rejectedAt)
              : entry.rejectedAt,
          reason: entry.reason,
          resubmittedAt: isLast
            ? Timestamp.fromDate(new Date())
            : entry.resubmittedAt
              ? entry.resubmittedAt instanceof Date
                ? Timestamp.fromDate(entry.resubmittedAt)
                : entry.resubmittedAt
              : null,
        };
      });

      // Fallback: if no history exists (shouldn't happen), create one
      if (historyForFirestore.length === 0) {
        historyForFirestore.push({
          rejectedAt: petition.rejectedAt
            ? Timestamp.fromDate(petition.rejectedAt)
            : Timestamp.fromDate(new Date()),
          reason: petition.moderationNotes || 'No reason provided',
          resubmittedAt: Timestamp.fromDate(new Date()),
        });
      }

      // Update petition
      const updateData = {
        title,
        description,
        category,
        targetSignatures,
        mediaUrls: allMediaUrls,
        status: 'pending',
        resubmissionCount: (petition.resubmissionCount || 0) + 1,
        resubmissionHistory: historyForFirestore,
        moderationNotes: '', // Clear previous rejection reason
        updatedAt: Timestamp.fromDate(new Date()),
      };

      await updateDoc(doc(db, 'petitions', petition.id), updateData);

      alert(
        'Petition resubmitted successfully! It will be reviewed by our moderation team.'
      );
      router.push('/dashboard');
    } catch (err) {
      console.error('Error resubmitting petition:', err);
      setError('Failed to resubmit petition. Please try again.');
      setSaving(false);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setExistingMediaUrls(existingMediaUrls.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Cannot Edit Petition
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const resubmissionCount = petition?.resubmissionCount || 0;
  const remainingAttempts = MAX_RESUBMISSIONS - resubmissionCount;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Edit & Resubmit Petition</CardTitle>
              <div className="mt-2 space-y-2">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-sm text-blue-700">
                    You have <strong>{remainingAttempts}</strong> resubmission
                    {remainingAttempts !== 1 ? 's' : ''} remaining.
                  </p>
                </div>
                {petition?.moderationNotes && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      Previous Rejection Reason:
                    </p>
                    <p className="text-sm text-red-700">
                      {petition.moderationNotes}
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Petition Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={150}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter a clear and concise title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your petition in detail"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="Environment">Environment</option>
                    <option value="Human Rights">Human Rights</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Animal Rights">Animal Rights</option>
                    <option value="Politics">Politics</option>
                    <option value="Economy">Economy</option>
                    <option value="Social Justice">Social Justice</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Target Signatures */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Signatures *
                  </label>
                  <input
                    type="number"
                    value={targetSignatures}
                    onChange={(e) =>
                      setTargetSignatures(parseInt(e.target.value))
                    }
                    required
                    min={100}
                    max={100000}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Existing Media */}
                {existingMediaUrls.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Media
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {existingMediaUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Media (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) =>
                      setMediaFiles(Array.from(e.target.files || []))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? 'Resubmitting...' : 'Resubmit for Review'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/petitions/${petitionId}`)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
