'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import QRUpgrade from '@/components/petitions/QRUpgrade';
import QRCodeDisplay from '@/components/petitions/QRCodeDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAuthGuard } from '@/lib/auth-guards';
import { getPetitionById } from '@/lib/petitions';
import { Petition } from '@/types/petition';

export default function PetitionQRPage() {
  const router = useRouter();
  const params = useParams();
  const petitionId = params?.id as string;

  const { user } = useAuthGuard();
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Load petition data
  useEffect(() => {
    const loadPetition = async () => {
      if (!petitionId) return;

      try {
        setLoading(true);
        setError('');

        const petitionData = await getPetitionById(petitionId);
        if (!petitionData) {
          setError('Petition not found');
          return;
        }

        // Check if user owns this petition
        if (petitionData.createdBy !== user?.uid) {
          setError('You can only manage QR codes for your own petitions');
          return;
        }

        setPetition(petitionData);
      } catch (err: any) {
        console.error('Error loading petition:', err);
        setError('Failed to load petition');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadPetition();
    }
  }, [petitionId, user]);

  const handleUpgradeComplete = (qrCodeUrl: string) => {
    if (petition) {
      setPetition({
        ...petition,
        qrCodeUrl,
        hasQrCode: true,
        hasQrUpgrade: true,
      });
    }
    setShowUpgrade(false);
  };

  const handleBackToPetition = () => {
    router.push(`/petitions/${petitionId}`);
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
                Error
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!petition) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={handleBackToPetition}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Petition
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QR Code Management
          </h1>
          <p className="text-lg text-gray-600">{petition.title}</p>
        </div>

        {showUpgrade ? (
          <QRUpgrade
            petition={petition}
            onUpgradeComplete={handleUpgradeComplete}
            onCancel={() => setShowUpgrade(false)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Status */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Current QR Code Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {petition.hasQrUpgrade ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Premium QR Code Active
                      </div>
                      <p className="text-sm text-gray-600">
                        You have a premium QR code with branding and high
                        resolution.
                      </p>

                      {/* QR Code Display */}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <QRCodeDisplay
                          petition={petition}
                          size={200}
                          branded={true}
                          downloadable={true}
                          shareable={true}
                        />
                      </div>
                    </div>
                  ) : petition.hasQrCode ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-blue-600">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Basic QR Code Available
                      </div>
                      <p className="text-sm text-gray-600">
                        You have a basic QR code. Upgrade to get a premium
                        version with branding.
                      </p>

                      {/* Basic QR Code Display */}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <QRCodeDisplay
                          petition={petition}
                          size={200}
                          branded={false}
                          downloadable={true}
                          shareable={true}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-500">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        No QR Code Yet
                      </div>
                      <p className="text-sm text-gray-600">
                        You don't have a QR code for this petition yet. Upgrade
                        to get a premium QR code.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upgrade Options */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Upgrade</CardTitle>
                </CardHeader>
                <CardContent>
                  {petition.hasQrUpgrade ? (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          You're All Set!
                        </h3>
                        <p className="text-gray-600">
                          You already have a premium QR code for this petition.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Premium QR Code Features
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-600 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            High-resolution (512x512px)
                          </li>
                          <li className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-600 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Professional 3arida branding
                          </li>
                          <li className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-600 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Perfect for printing
                          </li>
                          <li className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-600 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Analytics tracking
                          </li>
                        </ul>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            10 MAD
                          </div>
                          <div className="text-sm text-green-700">
                            One-time payment
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setShowUpgrade(true)}
                        className="w-full"
                      >
                        Upgrade QR Code for 10 MAD
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        Secure payment processed by Stripe
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Usage Tips */}
        {!showUpgrade && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>How to Use Your QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Download</h3>
                    <p className="text-sm text-gray-600">
                      Download your QR code as a high-resolution PNG file
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Print</h3>
                    <p className="text-sm text-gray-600">
                      Add to flyers, posters, and promotional materials
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
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
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Share</h3>
                    <p className="text-sm text-gray-600">
                      Share on social media and messaging apps
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
