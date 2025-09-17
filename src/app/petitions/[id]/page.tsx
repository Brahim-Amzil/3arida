'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import PhoneVerification from '@/components/auth/PhoneVerification';
import QRCodeDisplay from '@/components/petitions/QRCodeDisplay';
import PetitionProgress from '@/components/petitions/PetitionProgress';
import PetitionShare from '@/components/petitions/PetitionShare';
import PetitionComments from '@/components/petitions/PetitionComments';
import { useRealtimePetition } from '@/hooks/useRealtimePetition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider-mock';
import { getPetition, signPetition } from '@/lib/petitions-mock';
import {
  calculateProgress,
  getPetitionStatusColor,
  getPetitionStatusLabel,
} from '@/lib/petition-utils';
import { Petition } from '@/types/petition';

export default function PetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const petitionId = params?.id as string;
  const { user, userProfile } = useAuth();

  const { petition, loading, error } = useRealtimePetition(petitionId);
  const [showSigningFlow, setShowSigningFlow] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);

  const handleSignPetition = () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(
        `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    setShowSigningFlow(true);
  };

  const handlePhoneVerified = async (phoneNumber: string) => {
    if (!petition || !user) return;

    try {
      setSigningLoading(true);

      await signPetition(petition.id, {
        signerName: userProfile?.name || user.displayName || 'Anonymous',
        signerPhone: phoneNumber,
        signerLocation: {
          country: 'Morocco',
        },
        comment: '',
      });

      // Update local petition state
      setPetition((prev) =>
        prev
          ? {
              ...prev,
              currentSignatures: prev.currentSignatures + 1,
            }
          : null
      );

      setShowSigningFlow(false);

      // Show success message
      alert('Thank you for signing this petition!');
    } catch (err: any) {
      console.error('Error signing petition:', err);
      alert(err.message || 'Failed to sign petition. Please try again.');
    } finally {
      setSigningLoading(false);
    }
  };

  const handleShare = async () => {
    const petitionUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: petition?.title,
          text: `Support this petition: ${petition?.title}`,
          url: petitionUrl,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(petitionUrl);
        alert('Petition link copied to clipboard!');
      } catch (err) {
        setShowShareModal(true);
      }
    }
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

  if (error || !petition) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
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
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Petition Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {error || 'The petition you are looking for does not exist.'}
              </p>
              <Button asChild>
                <Link href="/petitions">Browse Petitions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(
    petition.currentSignatures,
    petition.targetSignatures
  );
  const statusColor = getPetitionStatusColor(petition.status);
  const statusLabel = getPetitionStatusLabel(petition.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Phone Verification Modal */}
      {showSigningFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <PhoneVerification
              onVerificationComplete={handlePhoneVerified}
              onCancel={() => setShowSigningFlow(false)}
              petitionTitle={petition.title}
            />
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Share QR Code
              </h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  className="w-6 h-6"
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
            <QRCodeDisplay
              petition={petition}
              size={250}
              branded={true}
              downloadable={true}
              shareable={true}
            />
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Share Petition
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  className="w-6 h-6"
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Petition URL
                </label>
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied!');
                    setShowShareModal(false);
                  }}
                  className="flex-1"
                >
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <span>/</span>
            <Link href="/petitions" className="hover:text-gray-700">
              Petitions
            </Link>
            <span>/</span>
            <span className="text-gray-900">{petition.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Petition Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {petition.title}
                    </h1>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}
                      >
                        {statusLabel}
                      </span>
                      <span className="text-sm text-gray-500">
                        {petition.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created {petition.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {petition.currentSignatures.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {progress.toFixed(1)}% of{' '}
                      {petition.targetSignatures.toLocaleString()} goal
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {petition.targetSignatures - petition.currentSignatures > 0
                      ? `${(
                          petition.targetSignatures - petition.currentSignatures
                        ).toLocaleString()} more signatures needed`
                      : 'Goal reached! 🎉'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <Button
                    onClick={handleSignPetition}
                    disabled={petition.status !== 'approved' || signingLoading}
                    className="flex-1"
                  >
                    {signingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing...
                      </>
                    ) : (
                      'Sign This Petition'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex items-center gap-2"
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowQRCode(true)}
                    className="flex items-center gap-2"
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    QR Code
                  </Button>
                </div>

                {/* Petition Image */}
                {petition.mediaUrls && petition.mediaUrls.length > 0 && (
                  <div className="mb-6">
                    <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={petition.mediaUrls[0]}
                        alt={petition.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                      />
                    </div>
                  </div>
                )}

                {/* Petition Description */}
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    About this petition
                  </h3>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {petition.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates Section (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle>Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
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
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  <p>No updates yet</p>
                  <p className="text-sm">
                    The petition creator hasn't posted any updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle>Petition Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-lg">
                      U
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">User</h4>
                    <p className="text-sm text-gray-500">Petition Creator</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Petition Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Signatures</span>
                    <span className="font-medium">
                      {petition.currentSignatures.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal</span>
                    <span className="font-medium">
                      {petition.targetSignatures.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">
                      {petition.viewCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shares</span>
                    <span className="font-medium">
                      {petition.shareCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Petitions (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle>Related Petitions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>No related petitions</p>
                  <p className="text-sm">
                    Check back later for similar petitions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}