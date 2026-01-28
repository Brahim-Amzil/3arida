'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';

import QRCodeDisplay from '@/components/petitions/QRCodeDisplay';
import PetitionProgress from '@/components/petitions/PetitionProgress';
import PetitionShare from '@/components/petitions/PetitionShare';
import PetitionManagement from '@/components/petitions/PetitionManagement';
import PetitionUpdates from '@/components/petitions/PetitionUpdates';
import PetitionSupporters from '@/components/petitions/PetitionSupporters';
import ContactModeratorModal from '@/components/moderation/ContactModeratorModal';
import { useRealtimePetition } from '@/hooks/useRealtimePetition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Using plain div with whitespace-pre-wrap for description display
import { useAuth } from '@/components/auth/AuthProvider';
import {
  getPetitionById,
  signPetition,
  updatePetitionStatus,
  getUserById,
  deletePetitionByCreator,
  archivePetition,
  requestPetitionDeletion,
} from '@/lib/petitions';
import {
  calculateProgress,
  getPetitionStatusColor,
  getPetitionStatusLabel,
} from '@/lib/petition-utils';
import PetitionAdminActions from '@/components/admin/PetitionAdminActions';
import { Petition, User } from '@/types/petition';
import { notifyPetitionStatusChange } from '@/lib/notifications';
import { Check, X, Pause, Play, Archive, Trash2 } from 'lucide-react';
import { isAdmin, isModerator, isModeratorOrAdmin } from '@/lib/auth-guards';
import NotificationAlert, {
  NotificationAlertData,
} from '@/components/notifications/NotificationAlert';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function PetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const petitionId = params?.id as string; // This can be either a full ID or a slug
  const { user, userProfile } = useAuth();
  const { t } = useTranslation();

  const { petition, loading, error } = useRealtimePetition(petitionId);

  const [showQRCode, setShowQRCode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showContactModerator, setShowContactModerator] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [notificationAlert, setNotificationAlert] =
    useState<NotificationAlertData | null>(null);
  const [creator, setCreator] = useState<User | null>(null);
  const [creatorLoading, setCreatorLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'petition' | 'publisher' | 'supporters'
  >('petition');
  const [hasUserSigned, setHasUserSigned] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  // Check if current user is admin/moderator
  const isAdmin =
    userProfile &&
    (userProfile.role === 'admin' || userProfile.role === 'moderator');

  // Fetch creator information when petition is loaded
  useEffect(() => {
    const fetchCreator = async () => {
      if (petition?.creatorId && !creator && !creatorLoading) {
        setCreatorLoading(true);
        try {
          const creatorData = await getUserById(petition.creatorId);
          setCreator(creatorData);
        } catch (error) {
          console.error('Error fetching creator:', error);
        } finally {
          setCreatorLoading(false);
        }
      }
    };

    fetchCreator();
  }, [petition?.creatorId, creator, creatorLoading]);

  // Check if user has already signed this petition
  useEffect(() => {
    const checkUserSignature = async () => {
      if (!petition?.id || !user) {
        setHasUserSigned(false);
        return;
      }

      try {
        const { collection, query, where, getDocs } =
          await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');

        const signaturesRef = collection(db, 'signatures');
        const q = query(
          signaturesRef,
          where('petitionId', '==', petition.id),
          where('userId', '==', user.uid),
        );

        const snapshot = await getDocs(q);
        setHasUserSigned(!snapshot.empty);
      } catch (error) {
        console.error('Error checking user signature:', error);
        setHasUserSigned(false);
      }
    };

    checkUserSignature();
  }, [petition?.id, user]);

  // Check for notification parameters in URL and show alert
  useEffect(() => {
    if (!petition) return;

    const notifType = searchParams.get('notif');
    const notifReason = searchParams.get('reason');

    console.log('🔍 Checking for notification parameters:', {
      notifType,
      notifReason,
      hasSearchParams: !!searchParams,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    if (notifType) {
      console.log('✅ Found notification type:', notifType);
      let alertData: NotificationAlertData | null = null;

      switch (notifType) {
        case 'approved':
          alertData = {
            type: 'approved',
            title: t('notification.approved.title'),
            message: t('notification.approved.message'),
            reason: notifReason || undefined,
            timestamp: new Date(),
          };
          break;

        case 'rejected':
          alertData = {
            type: 'rejected',
            title: t('notification.rejected.title'),
            message: t('notification.rejected.message'),
            reason: notifReason || undefined,
            timestamp: new Date(),
          };
          break;

        case 'paused':
          alertData = {
            type: 'paused',
            title: t('notification.paused.title'),
            message: t('notification.paused.message'),
            reason: notifReason || undefined,
            timestamp: new Date(),
          };
          break;

        case 'deleted':
          alertData = {
            type: 'deleted',
            title: t('notification.deleted.title'),
            message: t('notification.deleted.message'),
            reason: notifReason || undefined,
            timestamp: new Date(),
          };
          break;

        case 'archived':
          alertData = {
            type: 'archived',
            title: t('notification.archived.title'),
            message: t('notification.archived.message'),
            reason: notifReason || undefined,
            timestamp: new Date(),
          };
          break;

        case 'deletion_approved':
          alertData = {
            type: 'deletion_approved',
            title: t('notification.deletion_approved.title'),
            message: t('notification.deletion_approved.message'),
            reason: notifReason || undefined,
            timestamp: new Date(),
          };
          break;

        case 'deletion_denied':
          alertData = {
            type: 'deletion_denied',
            title: t('notification.deletion_denied.title'),
            message: t('notification.deletion_denied.message'),
            reason: notifReason || undefined,
            timestamp: new Date(),
          };
          break;
      }

      if (alertData) {
        console.log('✅ Setting notification alert:', alertData);
        setNotificationAlert(alertData);
        // Clean up URL parameters
        if (typeof window !== 'undefined') {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      } else {
        console.log(
          '❌ No alert data created for notification type:',
          notifType,
        );
      }
    } else {
      console.log('ℹ️ No notification type found in URL');
    }
  }, [petition, searchParams]);

  const handleSignPetition = async () => {
    if (!user) {
      // Redirect to login with return URL using window.location for full page reload
      if (typeof window !== 'undefined') {
        const redirectUrl = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        window.location.href = redirectUrl;
      }
      return;
    }

    // Check if user already signed this petition (MVP: only check by user ID)
    try {
      const { collection, query, where, getDocs } =
        await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      const signaturesRef = collection(db, 'signatures');
      const q = query(
        signaturesRef,
        where('petitionId', '==', petition?.id),
        where('userId', '==', user.uid),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert(
          'لقد قمت بالفعل بالتوقيع على هذه العريضة!\nYou have already signed this petition!',
        );
        return;
      }

      // MVP: Skip phone number duplicate check to avoid friction
      // Phone verification is disabled for MVP, so phone-based duplicate check is not needed
      console.log('ℹ️ MVP: Skipping phone number duplicate check');
    } catch (error) {
      console.error('Error checking existing signature:', error);
      // Continue anyway - the server-side check will catch duplicates
    }

    // reCAPTCHA v3 verification (invisible - runs in background)
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey) {
      try {
        setSigningLoading(true);
        const { executeRecaptcha, verifyRecaptchaToken } =
          await import('@/lib/recaptcha');

        // Execute reCAPTCHA (invisible to user)
        const token = await executeRecaptcha(siteKey, 'sign_petition');

        // Verify with backend
        const verification = await verifyRecaptchaToken(token);

        if (!verification.success) {
          alert('Security verification failed. Please try again.');
          setSigningLoading(false);
          return;
        }

        console.log('✅ reCAPTCHA passed with score:', verification.score);
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        // Continue anyway - don't block users if reCAPTCHA fails
      } finally {
        setSigningLoading(false);
      }
    }

    // Sign petition directly - no SMS verification for MVP
    // Only logged-in users can sign (authentication already verified above)
    await handleDirectSignature();
  };

  const handleDirectSignature = async () => {
    if (!petition || !user) return;

    try {
      setSigningLoading(true);

      console.log(
        '✍️ Signing petition directly (MVP - no SMS verification)...',
        {
          userId: user.uid,
          petitionId: petition.id,
          userName: userProfile?.name || user.displayName || 'Anonymous',
        },
      );

      await signPetition(
        petition.id,
        {
          name: userProfile?.name || user.displayName || 'Anonymous',
          phone: userProfile?.phone || '', // Use existing phone if available, empty if not
          location: {
            country: 'Morocco',
          },
          comment: '',
        },
        user.uid,
      );

      // Update button state immediately after successful signing
      setHasUserSigned(true);

      // Show success message
      setShowSuccessMessage(true);

      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    } catch (err: any) {
      console.error('Error signing petition:', err);

      // Show more specific error messages
      let errorMessage =
        'فشل التوقيع على العريضة. يرجى المحاولة مرة أخرى.\nFailed to sign petition. Please try again.';

      if (
        err.message?.includes('already been used') ||
        err.message?.includes('already signed')
      ) {
        errorMessage =
          'لقد قمت بالفعل بالتوقيع على هذه العريضة!\nYou have already signed this petition!';
      } else if (err.message?.includes('not available')) {
        errorMessage =
          'هذه العريضة غير متاحة للتوقيع حاليًا.\nThis petition is not available for signing.';
      } else if (err.message?.includes('reached its signature goal')) {
        errorMessage =
          'لقد وصلت هذه العريضة إلى هدفها من التوقيعات!\nThis petition has reached its signature goal!';
      }

      alert(errorMessage);
    } finally {
      setSigningLoading(false);
    }
  };

  const handleShare = () => {
    // Always show the comprehensive share modal
    setShowShareModal(true);
  };

  // Admin function to update petition status
  const handleUpdatePetitionStatus = async (
    newStatus: 'approved' | 'rejected' | 'paused' | 'deleted' | 'archived',
  ) => {
    if (!isModeratorOrAdmin(userProfile) || !petition || !userProfile) return;

    setAdminActionLoading(true);
    try {
      await updatePetitionStatus(petition.id, newStatus, userProfile.id);

      // Send notification about status change (don't fail if this errors)
      try {
        await notifyPetitionStatusChange(
          petition.id,
          petition.creatorId,
          petition.title,
          newStatus,
        );
      } catch (notifError) {
        console.warn(
          'Failed to send notification, but status updated:',
          notifError,
        );
      }

      alert(`Petition ${newStatus} successfully!`);

      // Refresh the page to show updated status
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating petition:', error);
      alert('Error updating petition status');
      setAdminActionLoading(false);
    }
  };

  // Archive petition function (admin)
  const archivePetitionAdmin = async () => {
    if (!isModeratorOrAdmin(userProfile)) return;

    if (confirm('Are you sure you want to archive this petition?')) {
      await handleUpdatePetitionStatus('archived');
    }
  };

  // Delete petition function
  const deletePetition = async () => {
    if (!isModeratorOrAdmin(userProfile)) return;

    if (
      confirm(
        'Are you sure you want to delete this petition? This action cannot be undone.',
      )
    ) {
      await handleUpdatePetitionStatus('deleted');
    }
  };

  // Creator functions for petition management
  const handleCreatorDelete = async () => {
    if (!user || !petition) return;

    try {
      await deletePetitionByCreator(petition.id, user.uid);
      alert('Petition deleted successfully');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error deleting petition:', error);
      alert(error.message || 'Failed to delete petition');
    }
  };

  const handleCreatorArchive = async () => {
    if (!user || !petition) return;

    try {
      await archivePetition(petition.id, user.uid);
      alert('Petition archived successfully');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error archiving petition:', error);
      alert(error.message || 'Failed to archive petition');
    }
  };

  const handleCreatorRequestDeletion = async (reason: string) => {
    if (!user || !petition) return;

    try {
      await requestPetitionDeletion(petition.id, user.uid, reason);

      // Notify admins of the deletion request
      try {
        const { notifyAdminsOfDeletionRequest } =
          await import('@/lib/notifications');
        await notifyAdminsOfDeletionRequest(
          petition.id,
          petition.title,
          user.uid,
          reason,
          petition.currentSignatures,
        );
      } catch (notifError) {
        console.error('Error sending notification to admins:', notifError);
      }
    } catch (error: any) {
      console.error('Error requesting deletion:', error);
      throw error;
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
    petition.targetSignatures,
  );
  const statusColor = getPetitionStatusColor(petition.status);

  // Get translated status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return t('dashboard.filter.all'); // Draft not in filters, using fallback
      case 'pending':
        return t('dashboard.filter.pending');
      case 'approved':
        return t('dashboard.filter.active');
      case 'paused':
        return t('dashboard.filter.paused');
      case 'deleted':
        return t('dashboard.filter.deleted');
      case 'archived':
        return t('dashboard.filter.archived');
      default:
        return status;
    }
  };
  const statusLabel = getStatusLabel(petition.status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                شارِك رمز QR الخاص بالعريضة
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
              creator={
                creator ||
                (petition.creatorName ? { name: petition.creatorName } : null)
              }
              size={250}
              branded={true}
              downloadable={true}
              shareable={true}
              onShare={() => {
                setShowQRCode(false);
                setShowShareModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <PetitionShare
            petition={petition}
            onClose={() => setShowShareModal(false)}
          />
        </div>
      )}

      {/* Contact Moderator Modal */}
      {showContactModerator && (
        <ContactModeratorModal
          petition={petition}
          onClose={() => setShowContactModerator(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">
              {t('common.home')}
            </Link>
            <span>/</span>
            <Link href="/petitions" className="hover:text-gray-700">
              {t('petitions.title')}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{petition.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Main Content */}
          <div className="w-full min-w-0 space-y-6">
            {/* Notification Alert (if coming from notification) */}
            {notificationAlert && (
              <NotificationAlert
                data={notificationAlert}
                onClose={() => setNotificationAlert(null)}
              />
            )}

            {/* Petition Header */}
            <Card
              className="w-full"
              style={{ width: '100%', maxWidth: '100%' }}
            >
              <CardContent className="p-6" style={{ width: '100%' }}>
                {/* 1. Title + Meta (Author, Date) */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {petition.title}
                </h1>

                <div className="flex items-center gap-3 mb-6 w-full">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}
                  >
                    {statusLabel}
                  </span>
                  <span className="text-sm text-gray-500">
                    {petition.category}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">
                    {t('common.by')}{' '}
                    <span className="font-medium">
                      {creatorLoading
                        ? t('common.loading')
                        : creator?.name || 'Unknown User'}
                    </span>
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {petition.createdAt.toLocaleDateString()}
                  </span>
                </div>

                {/* 2. Petition Media (Images only - videos appear after description) */}
                {petition.mediaUrls && petition.mediaUrls.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {/* Images and Videos from mediaUrls */}
                    {petition.mediaUrls.map((url, index) => {
                      const isVideo =
                        url.includes('.mp4') ||
                        url.includes('.webm') ||
                        url.includes('.ogg') ||
                        url.includes('video');

                      return isVideo ? (
                        <video
                          key={index}
                          controls
                          className="w-full rounded-lg"
                        >
                          <source src={url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div
                          key={index}
                          className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={url}
                            alt={petition.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Rejected Alert */}
                {petition.status === 'rejected' && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <X className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-red-800">
                          Petition Rejected
                        </h3>
                        <p className="mt-1 text-sm text-red-700">
                          This petition has been rejected by our moderation team
                          and cannot accept signatures.
                        </p>
                        {/* Show rejection reason from moderationNotes or latest resubmission history */}
                        {(petition.moderationNotes ||
                          (petition.resubmissionHistory &&
                            petition.resubmissionHistory.length > 0)) && (
                          <div className="mt-2 p-2 bg-red-100 rounded">
                            <p className="text-sm font-medium text-red-800">
                              Reason:
                            </p>
                            <p className="text-sm text-red-700">
                              {petition.moderationNotes ||
                                (petition.resubmissionHistory &&
                                petition.resubmissionHistory.length > 0
                                  ? petition.resubmissionHistory[
                                      petition.resubmissionHistory.length - 1
                                    ].reason
                                  : 'No reason provided')}
                            </p>
                          </div>
                        )}
                        {/* Show Edit & Resubmit button if user is creator and hasn't exceeded limit */}
                        {user &&
                          petition.creatorId === user.uid &&
                          (petition.resubmissionCount || 0) < 3 && (
                            <div className="mt-3">
                              <Button
                                size="sm"
                                onClick={() =>
                                  router.push(`/petitions/${petition.id}/edit`)
                                }
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Edit & Resubmit (
                                {3 - (petition.resubmissionCount || 0)} attempts
                                left)
                              </Button>
                            </div>
                          )}
                        {user &&
                          petition.creatorId === user.uid &&
                          (petition.resubmissionCount || 0) >= 3 && (
                            <div className="mt-3">
                              <p className="text-sm text-red-600 font-medium">
                                Maximum resubmission attempts reached (3/3)
                              </p>
                              <Button
                                size="sm"
                                onClick={() => setShowContactModerator(true)}
                                className="mt-2 bg-orange-600 hover:bg-orange-700"
                              >
                                Contact Moderator
                              </Button>
                            </div>
                          )}
                        {/* Contact Moderator button for all creators with rejected petitions */}
                        {user && petition.creatorId === user.uid && (
                          <div className="mt-3">
                            <Button
                              size="sm"
                              onClick={() => setShowContactModerator(true)}
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                              </svg>
                              Contact Moderator
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Paused Alert */}
                {petition.status === 'paused' && (
                  <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Pause className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-orange-800">
                          Petition Temporarily Paused
                        </h3>
                        <p className="mt-1 text-sm text-orange-700">
                          This petition is currently paused and cannot accept
                          new signatures at this time. It may be under review or
                          temporarily suspended by moderators.
                        </p>
                        {petition.moderationNotes && (
                          <div className="mt-2 p-2 bg-orange-100 rounded">
                            <p className="text-sm font-medium text-orange-800">
                              Reason:
                            </p>
                            <p className="text-sm text-orange-700">
                              {petition.moderationNotes}
                            </p>
                          </div>
                        )}
                        {/* Contact Moderator button for creators with paused petitions */}
                        {user && petition.creatorId === user.uid && (
                          <div className="mt-3">
                            <Button
                              size="sm"
                              onClick={() => setShowContactModerator(true)}
                              variant="outline"
                              className="border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                              </svg>
                              Contact Moderator
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Signatures Progress Bar */}
                <div className="mb-6 w-full">
                  {/* Verified Signatures Badge */}
                  <div className="mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm">
                      <svg
                        className="w-4 h-4 text-green-600 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-green-700 whitespace-nowrap">
                        {t('petition.verifiedSignatures')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {petition.currentSignatures.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {progress.toFixed(1)}% of{' '}
                      {petition.targetSignatures.toLocaleString()} goal
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-300 ${
                        progress < 30
                          ? 'bg-gray-500'
                          : progress < 60
                            ? 'bg-yellow-600'
                            : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {petition.targetSignatures - petition.currentSignatures > 0
                      ? t('petition.moreSignaturesNeeded', {
                          count: (
                            petition.targetSignatures -
                            petition.currentSignatures
                          ).toLocaleString(),
                        })
                      : t('petition.goalReached')}
                  </p>
                </div>

                {/* Success Message */}
                {showSuccessMessage && (
                  <div className="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
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
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-green-900 mb-1">
                          {t('petition.thankYouSigning')}
                        </h4>
                        <p className="text-sm text-green-700 mb-3">
                          {t('petition.signatureRecorded')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={handleShare}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
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
                            {t('petition.sharePetition')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveTab('supporters')}
                            className="border-green-600 text-green-700 hover:bg-green-50"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            {t('petition.viewDiscussion')}
                          </Button>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSuccessMessage(false)}
                        className="flex-shrink-0 text-green-600 hover:text-green-800 p-1"
                      >
                        <svg
                          className="w-5 h-5"
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
                  </div>
                )}

                {/* 6. Action Buttons */}
                <div className="space-y-3 mb-6 w-full">
                  {/* Row 1: Sign Button + Badge */}
                  <div className="flex gap-3 w-full">
                    <Button
                      onClick={handleSignPetition}
                      disabled={
                        petition.status !== 'approved' ||
                        signingLoading ||
                        hasUserSigned
                      }
                      className="flex-1"
                    >
                      {signingLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('status.saving')}
                        </>
                      ) : hasUserSigned ? (
                        <>
                          <svg
                            className="w-5 h-5 mr-2 inline"
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
                          {t('petition.alreadySigned')}
                        </>
                      ) : (
                        t('petition.signPetition')
                      )}
                    </Button>
                    {/* Security Badge - Clickable */}
                    <Button
                      variant="outline"
                      className={`w-12 h-12 p-0 flex-shrink-0 transition-colors ${
                        showSecurityInfo
                          ? 'bg-blue-50 border-blue-300 text-blue-600'
                          : 'hover:bg-blue-50 hover:border-blue-300'
                      }`}
                      onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                      title="Security Information"
                    >
                      <svg
                        className={`w-6 h-6 transition-colors ${
                          showSecurityInfo ? 'text-blue-600' : 'text-blue-500'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </Button>
                  </div>

                  {/* Row 2: Share and QR Code buttons */}
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex-1 flex items-center justify-center gap-2"
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
                      {t('common.share')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowQRCode(true)}
                      className="flex-1 flex items-center justify-center gap-2"
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
                      {t('petitions.qrCode')}
                    </Button>
                  </div>
                </div>

                {/* Security Information - Toggleable */}
                {showSecurityInfo && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg relative">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <div className="text-sm flex-1 pr-12">
                        <p className="font-medium text-blue-900 mb-2">
                          {t('petition.securityInfo')}
                        </p>
                        <p className="text-blue-700 mb-2">
                          {t('petition.securityDescription')}
                        </p>
                        <p className="text-blue-700 font-medium">
                          {t('petition.allSignaturesVerified')}
                        </p>
                      </div>
                      {/* Dismiss Button */}
                      <button
                        onClick={() => setShowSecurityInfo(false)}
                        className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-100"
                        title="Close security information"
                      >
                        <svg
                          className="w-5 h-5"
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
                  </div>
                )}

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex justify-between">
                    <button
                      onClick={() => setActiveTab('petition')}
                      className={`flex-1 pb-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'petition'
                          ? 'border-green-600 text-green-600'
                          : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {t('petition.aboutPetition')}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('supporters')}
                      className={`flex-1 pb-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'supporters'
                          ? 'border-green-600 text-green-600'
                          : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {t('petition.supporters')}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('publisher')}
                      className={`flex-1 pb-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'publisher'
                          ? 'border-green-600 text-green-600'
                          : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {t('petition.publisher')}
                      </span>
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px] w-full">
                  {activeTab === 'petition' && (
                    <div className="space-y-6 w-full">
                      {/* Petition Info Box - Moved above description */}
                      <div className="bg-gray-50 border border-gray-300 rounded-md p-3">
                        <div className="space-y-1.5">
                          {/* Publisher */}
                          <div className="flex items-start">
                            <span className="text-sm font-normal text-gray-600 min-w-[90px]">
                              {t('petition.publisher')}:
                            </span>
                            <span className="text-sm text-gray-900 font-medium">
                              {petition.publisherName ||
                                (creatorLoading
                                  ? t('status.loading')
                                  : creator?.name || 'Unknown User')}
                            </span>
                          </div>

                          {/* Target (Addressed To) */}
                          {(petition.addressedToSpecific ||
                            petition.addressedToType) && (
                            <div className="flex items-start">
                              <span className="text-sm font-normal text-gray-600 min-w-[90px]">
                                {t('petition.target')}:
                              </span>
                              <span className="text-sm text-gray-900 font-medium">
                                {petition.addressedToSpecific ||
                                  petition.addressedToType}
                              </span>
                            </div>
                          )}

                          {/* Subject */}
                          <div className="flex items-start">
                            <span className="text-sm font-normal text-gray-600 min-w-[90px]">
                              {t('petition.subject')}:
                            </span>
                            <span className="text-sm text-gray-900 font-medium">
                              {petition.title}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Petition Description - FIRST */}
                      <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {t('petition.aboutPetition')}
                        </h3>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {petition.description}
                        </div>
                      </div>

                      {/* Video - RIGHT AFTER description */}
                      {petition.youtubeVideoUrl && (
                        <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden">
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={
                              petition.youtubeVideoUrl.includes('embed')
                                ? petition.youtubeVideoUrl
                                : `https://www.youtube.com/embed/${
                                    petition.youtubeVideoUrl
                                      .split('v=')[1]
                                      ?.split('&')[0] ||
                                    petition.youtubeVideoUrl.split('/').pop()
                                  }`
                            }
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}

                      {/* Hashtags - AFTER video */}
                      {petition.tags &&
                        typeof petition.tags === 'string' &&
                        petition.tags.trim() && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {(() => {
                              console.log('🏷️ Raw tags data:', petition.tags);
                              console.log(
                                '🏷️ Tags type:',
                                typeof petition.tags,
                              );
                              const splitTags = petition.tags.split(',');
                              console.log('🏷️ Split tags:', splitTags);
                              const trimmedTags = splitTags.map((tag: string) =>
                                tag.trim(),
                              );
                              console.log('🏷️ Trimmed tags:', trimmedTags);
                              const filteredTags = trimmedTags.filter(
                                (tag: string) => tag.length > 0,
                              );
                              console.log('🏷️ Filtered tags:', filteredTags);

                              return filteredTags.map(
                                (tag: string, index: number) => (
                                  <Link
                                    key={index}
                                    href={`/petitions?search=${encodeURIComponent(tag)}`}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer"
                                    title={`Search for petitions tagged with "${tag}"`}
                                  >
                                    #{tag}
                                  </Link>
                                ),
                              );
                            })()}
                          </div>
                        )}
                    </div>
                  )}

                  {/* Publisher Tab */}
                  {activeTab === 'publisher' && (
                    <div className="space-y-6 w-full">
                      {/* Creator Profile */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {creator?.photoURL ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              <Image
                                src={creator.photoURL}
                                alt={creator.name || 'User'}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-green-600 font-bold text-2xl">
                                {creator?.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {creator?.name || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {creator?.email}
                            </p>
                            <div className="text-sm text-gray-500">
                              <p>
                                {t('publisher.memberSince')}{' '}
                                {creator?.createdAt
                                  ? typeof creator.createdAt === 'string'
                                    ? new Date(
                                        creator.createdAt,
                                      ).toLocaleDateString()
                                    : (creator.createdAt as any).toDate
                                      ? (creator.createdAt as any)
                                          .toDate()
                                          .toLocaleDateString()
                                      : new Date(
                                          creator.createdAt as any,
                                        ).toLocaleDateString()
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Edit Button - Only show if current user is the creator */}
                        {user && petition.creatorId === user.uid && (
                          <Link href="/profile?tab=profile">
                            <Button
                              variant="outline"
                              size="sm"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              {t('publisher.editBio')}
                            </Button>
                          </Link>
                        )}
                      </div>

                      {/* About the Publisher */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {t('publisher.aboutPublisher')}
                        </h4>
                        {creator?.bio ? (
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {creator.bio}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">
                            {user && petition.creatorId === user.uid
                              ? t('publisher.noBioYet')
                              : t('publisher.userNoBio').replace(
                                  '{name}',
                                  creator?.name || t('publisher.thisUser'),
                                )}
                          </p>
                        )}
                      </div>

                      {/* Publisher Information */}
                      {(petition.publisherType || petition.publisherName) && (
                        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="text-base font-bold text-blue-700 mb-3">
                            {t('publisher.publisherInformation')}
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {petition.publisherType && (
                              <div>
                                <p className="text-xs text-blue-700">
                                  {t('publisher.type')}
                                </p>
                                <p className="text-sm font-medium text-blue-900">
                                  {petition.publisherType}
                                </p>
                              </div>
                            )}
                            {petition.publisherName && (
                              <div>
                                <p className="text-xs text-blue-700">
                                  {t('publisher.name')}
                                </p>
                                <p className="text-sm font-medium text-blue-900">
                                  {petition.publisherName}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Petition Details */}
                      {(petition.petitionType ||
                        petition.addressedToType ||
                        petition.addressedToSpecific ||
                        petition.referenceCode) && (
                        <div className="w-full bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h3 className="text-base font-bold text-purple-700 mb-3">
                            {t('publisher.petitionDetails')}
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {/* Type */}
                            {petition.petitionType && (
                              <div>
                                <p className="text-xs text-purple-700 mb-1">
                                  {t('publisher.type')}
                                </p>
                                <p className="text-sm font-medium text-purple-900">
                                  {petition.petitionType}
                                </p>
                              </div>
                            )}

                            {/* Addressed To */}
                            {petition.addressedToType && (
                              <div>
                                <p className="text-xs text-purple-700 mb-1">
                                  {t('publisher.addressedTo')}
                                </p>
                                <p className="text-sm font-medium text-purple-900">
                                  {petition.addressedToType}
                                </p>
                              </div>
                            )}

                            {/* Specific Target - Full Width */}
                            {petition.addressedToSpecific && (
                              <div className="col-span-1">
                                <p className="text-xs text-purple-700 mb-1">
                                  {t('publisher.specificTarget')}
                                </p>
                                <p className="text-sm font-medium text-purple-900">
                                  {petition.addressedToSpecific}
                                </p>
                              </div>
                            )}

                            {/* Reference Code */}
                            {petition.referenceCode && (
                              <div
                                className={
                                  petition.addressedToSpecific
                                    ? ''
                                    : 'col-start-2'
                                }
                              >
                                <p className="text-xs text-purple-700 mb-1">
                                  {t('publisher.referenceCode')}
                                </p>
                                <p className="text-lg font-bold text-purple-900 font-mono tracking-wider">
                                  {petition.referenceCode}
                                </p>
                                <p className="text-xs text-purple-600 mt-1">
                                  {t('publisher.useCodeForSupport')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Supporters Tab - Unified Comments & Signatures */}
                  {activeTab === 'supporters' && (
                    <div className="w-full">
                      <PetitionSupporters petitionId={petition.id} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Updates Section */}
            <PetitionUpdates
              petitionId={petition.id}
              isCreator={user?.uid === petition.creatorId}
            />
          </div>

          {/* Sidebar */}
          <div className="w-full space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>{t('stats.petitionStats')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t('stats.signatures')}
                    </span>
                    <span className="font-medium">
                      {petition.currentSignatures.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('stats.goal')}</span>
                    <span className="font-medium">
                      {petition.targetSignatures.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('stats.progress')}</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('stats.views')}</span>
                    <span className="font-medium">
                      {petition.viewCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('stats.shares')}</span>
                    <span className="font-medium">
                      {petition.shareCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Management - Show only to petition creator */}
            {user &&
              petition.creatorId === user.uid &&
              petition.status !== 'deleted' && (
                <PetitionManagement
                  petition={petition}
                  onDelete={handleCreatorDelete}
                  onArchive={handleCreatorArchive}
                  onRequestDeletion={handleCreatorRequestDeletion}
                />
              )}

            {/* Resubmission History - Show to admins if petition has been resubmitted */}
            {isAdmin &&
              petition.resubmissionHistory &&
              petition.resubmissionHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-600">
                      {t('resubmission.history')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        This petition has been resubmitted{' '}
                        <strong>{petition.resubmissionCount || 0}</strong>{' '}
                        time(s).
                      </p>
                      {petition.resubmissionHistory.map((history, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-orange-300 pl-3 py-2"
                        >
                          <p className="text-xs text-gray-500 mb-1">
                            {t('resubmission.attempt')} {index + 1}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>{t('resubmission.rejected')}:</strong>{' '}
                            {new Date(history.rejectedAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>{t('resubmission.reason')}:</strong>{' '}
                            {history.reason || t('resubmission.noReason')}
                          </p>
                          {history.resubmittedAt && (
                            <p className="text-sm text-gray-700">
                              <strong>{t('resubmission.resubmitted')}:</strong>{' '}
                              {new Date(
                                history.resubmittedAt,
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Admin Controls */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.adminActions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Approve/Reject - Show for pending or rejected petitions */}
                    {(petition.status === 'pending' ||
                      petition.status === 'rejected') && (
                      <Button
                        onClick={() => handleUpdatePetitionStatus('approved')}
                        disabled={adminActionLoading}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {petition.status === 'rejected'
                          ? t('admin.approveReverseRejection')
                          : t('admin.approvePetition')}
                      </Button>
                    )}

                    {(petition.status === 'pending' ||
                      petition.status === 'approved' ||
                      petition.status === 'paused') && (
                      <Button
                        onClick={() => handleUpdatePetitionStatus('rejected')}
                        disabled={adminActionLoading}
                        variant="destructive"
                        className="w-full"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t('admin.rejectPetition')}
                      </Button>
                    )}

                    {/* Pause/Resume */}
                    {petition.status === 'approved' && (
                      <Button
                        onClick={() => handleUpdatePetitionStatus('paused')}
                        disabled={adminActionLoading}
                        variant="outline"
                        className="w-full"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        {t('admin.pausePetition')}
                      </Button>
                    )}

                    {petition.status === 'paused' && (
                      <Button
                        onClick={() => handleUpdatePetitionStatus('approved')}
                        disabled={adminActionLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {t('admin.resumePetition')}
                      </Button>
                    )}

                    {/* Archive */}
                    {(petition.status === 'approved' ||
                      petition.status === 'paused' ||
                      petition.status === 'rejected') && (
                      <Button
                        onClick={archivePetitionAdmin}
                        disabled={adminActionLoading}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        {t('admin.archivePetition')}
                      </Button>
                    )}

                    {/* Unarchive */}
                    {petition.status === 'archived' && (
                      <Button
                        onClick={() => handleUpdatePetitionStatus('approved')}
                        disabled={adminActionLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {t('admin.unarchiveApprove')}
                      </Button>
                    )}

                    {/* Delete - Always available to admin */}
                    {petition.status !== 'deleted' && (
                      <Button
                        onClick={deletePetition}
                        disabled={adminActionLoading}
                        variant="destructive"
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('admin.deletePetition')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Petition QR Code */}
            <div
              onClick={() => setShowQRCode(true)}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <QRCodeDisplay
                petition={petition}
                creator={
                  creator ||
                  (petition.creatorName ? { name: petition.creatorName } : null)
                }
                size={200}
                variant="card"
                branded={false}
                downloadable={true}
                shareable={false}
              />
            </div>

            {/* Share Button */}
            <Button
              onClick={handleShare}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              {t('qr.shareThisPetitionButton')}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
