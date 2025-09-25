'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Petition } from '@/types/petition';
import { generateQRCodeDataURL, downloadQRCode } from '@/lib/qr-service';
import { incrementPetitionShares } from '@/lib/petitions';

interface QRCodeDisplayProps {
  petition: Petition;
  size?: number;
  variant?: 'default' | 'card' | 'modal';
  branded?: boolean;
  downloadable?: boolean;
  shareable?: boolean;
  className?: string;
  onShare?: () => void;
  onDownload?: () => void;
}

export default function QRCodeDisplay({
  petition,
  size = 256,
  variant = 'default',
  branded = false,
  downloadable = true,
  shareable = true,
  className = '',
  onShare,
  onDownload,
}: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  // Generate QR code on component mount
  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Use existing QR code if available, otherwise generate new one
        if (petition.qrCodeUrl && !branded) {
          setQrCodeUrl(petition.qrCodeUrl);
        } else {
          const dataUrl = await generateQRCodeDataURL(petition.id, {
            size,
            branded,
            includeAnalytics: true,
          });
          setQrCodeUrl(dataUrl);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [petition.id, petition.qrCodeUrl, size, branded]);

  const handleDownload = async () => {
    if (!qrCodeUrl) return;

    try {
      await downloadQRCode(petition.id, petition.title, 'png', {
        size: 512,
        branded,
      });

      // Track download
      await incrementPetitionShares(petition.id);

      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const handleShare = async () => {
    if (!qrCodeUrl) return;

    try {
      // Check if Web Share API is available
      if (navigator.share) {
        // Convert data URL to blob for sharing
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `${petition.title}_qr_code.png`, {
          type: 'image/png',
        });

        await navigator.share({
          title: `${petition.title} - QR Code`,
          text: `Scan this QR code to support: ${petition.title}`,
          files: [file],
        });
      } else {
        // Fallback: copy petition URL to clipboard
        const petitionUrl = `${window.location.origin}/petitions/${petition.id}`;
        await navigator.clipboard.writeText(petitionUrl);

        // Show temporary feedback
        alert('Petition link copied to clipboard!');
      }

      // Track share
      await incrementPetitionShares(petition.id);

      if (onShare) {
        onShare();
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  const handleQRClick = () => {
    if (variant === 'default') {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Default variant
  if (variant === 'default') {
    return (
      <>
        <div className={`text-center ${className}`}>
          {isLoading ? (
            <div
              className="flex items-center justify-center bg-gray-100 rounded-lg"
              style={{ width: size, height: size }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div
              className="flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              style={{ width: size, height: size }}
            >
              {error}
            </div>
          ) : (
            <div
              className="inline-block cursor-pointer"
              onClick={handleQRClick}
            >
              <Image
                src={qrCodeUrl}
                alt={`QR Code for ${petition.title}`}
                width={size}
                height={size}
                className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
              />
            </div>
          )}

          {!isLoading && !error && (downloadable || shareable) && (
            <div className="flex gap-2 justify-center mt-3">
              {downloadable && (
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-colors flex items-center gap-2 font-medium"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download
                </button>
              )}

              {shareable && (
                <button
                  onClick={handleShare}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2 font-medium"
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
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-lg max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Petition QR Code
                </h3>
                <button
                  onClick={handleCloseModal}
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

              <div className="text-center">
                {isLoading ? (
                  <div
                    className="flex items-center justify-center bg-gray-100 rounded-lg mx-auto"
                    style={{ width: 300, height: 300 }}
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : error ? (
                  <div
                    className="flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mx-auto"
                    style={{ width: 300, height: 300 }}
                  >
                    {error}
                  </div>
                ) : (
                  <div className="inline-block mb-4">
                    <Image
                      src={qrCodeUrl}
                      alt={`QR Code for ${petition.title}`}
                      width={300}
                      height={300}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                )}

                <div className="text-sm text-gray-600 mb-6">
                  <p className="font-medium text-gray-900">{petition.title}</p>
                  <p>Scan to view and support this petition</p>
                </div>

                {!isLoading && !error && (
                  <div className="flex gap-3">
                    {downloadable && (
                      <button
                        onClick={handleDownload}
                        className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
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
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download
                      </button>
                    )}

                    {shareable && (
                      <button
                        onClick={handleShare}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
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
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Card variant with petition info
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Share this Petition
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Scan the QR code to view and support this petition
          </p>

          {isLoading ? (
            <div
              className="flex items-center justify-center bg-gray-100 rounded-lg mx-auto"
              style={{ width: size, height: size }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div
              className="flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mx-auto"
              style={{ width: size, height: size }}
            >
              {error}
            </div>
          ) : (
            <div
              className="inline-block mb-4 cursor-pointer"
              onClick={handleQRClick}
            >
              <Image
                src={qrCodeUrl}
                alt={`QR Code for ${petition.title}`}
                width={size}
                height={size}
                className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
              />
            </div>
          )}

          <div className="text-sm text-gray-600 mb-4">
            <p className="font-medium">{petition.title}</p>
            <p>Created by User</p>
          </div>

          {!isLoading && !error && (
            <div className="flex gap-2 justify-center">
              {downloadable && (
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-colors flex items-center justify-center gap-2"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download
                </button>
              )}

              {shareable && (
                <button
                  onClick={handleShare}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
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
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
