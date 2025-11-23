'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/HeaderWrapper';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import PhoneVerification from '@/components/auth/PhoneVerification';
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadProfileImage, deleteProfileImage } from '@/lib/image-upload';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'account' | 'profile' | 'security' | 'preferences'
  >('account');

  // Check URL parameter for tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (
      tabParam &&
      ['account', 'profile', 'security', 'preferences'].includes(tabParam)
    ) {
      setActiveTab(
        tabParam as 'account' | 'profile' | 'security' | 'preferences'
      );
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: userProfile?.name || user?.displayName || '',
    email: user?.email || '',
    phone: userProfile?.phone || '',
    bio: (userProfile as any)?.bio || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Update form data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      console.log('🔄 Syncing form data from userProfile:', {
        name: userProfile.name,
        phone: userProfile.phone,
        bio: (userProfile as any)?.bio,
        fullProfile: userProfile,
      });
      setFormData({
        name: userProfile.name || user?.displayName || '',
        email: user?.email || '',
        phone: userProfile.phone || '',
        bio: (userProfile as any)?.bio || '',
      });
    }
  }, [userProfile, user]);

  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    (userProfile as any)?.photoURL || user?.photoURL || null
  );

  // Update profile image when userProfile changes
  useEffect(() => {
    if (userProfile || user) {
      setProfileImage((userProfile as any)?.photoURL || user?.photoURL || null);
    }
  }, [userProfile, user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('📝 Updating profile with data:', {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
      });

      // Update Firebase Auth profile
      if (formData.name !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.name,
        });
      }

      // Update Firestore user profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        updatedAt: new Date(),
      });

      console.log('✅ Profile updated successfully');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('❌ Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email!,
        passwordForm.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordForm.newPassword);

      setSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating password:', err);
      let errorMessage = 'Failed to update password.';
      if (err.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    if (fieldName === 'bio') {
      console.log('✏️ Bio field changed:', fieldValue);
    }

    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    setError('');

    try {
      // Delete old image if exists
      if (profileImage) {
        await deleteProfileImage(profileImage);
      }

      // Upload new image
      const imageUrl = await uploadProfileImage(user.uid, file);
      setProfileImage(imageUrl);

      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        photoURL: imageUrl,
        updatedAt: new Date(),
      });

      // Update Firebase Auth profile
      await updateProfile(user, {
        photoURL: imageUrl,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle redirect on client side only
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Success/Error Message */}
        {(success || error) && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              success
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {success ? 'Changes saved successfully!' : error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('account')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'account'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Status
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'security'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'preferences'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preferences
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Account Status Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Account Status Overview
                  </h3>
                  <div className="space-y-4">
                    {/* Account Type */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 mr-3 flex-shrink-0 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-500"
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
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            Account Type
                          </span>
                          <p className="text-sm text-gray-500 capitalize">
                            {userProfile?.role || 'user'} Account
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                        {userProfile?.role || 'User'}
                      </span>
                    </div>

                    {/* Email Verification */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 mr-3 flex-shrink-0 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            Email Verification
                          </span>
                          <p className="text-sm text-gray-500">
                            {user.emailVerified
                              ? 'Your email is verified'
                              : 'Please verify your email'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.emailVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>

                    {/* Phone Verification */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 mr-3 flex-shrink-0 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            Phone Verification
                          </span>
                          <p className="text-sm text-gray-500">
                            {userProfile?.verifiedPhone
                              ? 'Verify phone to create and sign petitions'
                              : 'Verify phone to create and sign petitions'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          userProfile?.verifiedPhone
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {userProfile?.verifiedPhone ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Required Section */}
                {!userProfile?.verifiedPhone && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Action Required
                    </h3>
                    <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-yellow-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">
                          Phone Verification Required
                        </p>
                        <p className="text-sm text-yellow-600">
                          You must verify your phone number to create or sign
                          petitions.
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowPhoneVerification(true)}
                        className="ml-4 bg-yellow-600 hover:bg-yellow-700 flex-shrink-0"
                      >
                        Verify Phone
                      </Button>
                    </div>
                  </div>
                )}

                {/* Account Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Account Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Member Since
                        </p>
                        <p className="text-sm text-gray-500">
                          {userProfile?.createdAt?.toLocaleDateString() ||
                            'Recently'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Email Address
                        </p>
                        <p className="text-sm text-gray-500">
                          {formData.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Picture Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Profile Picture
                  </h3>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {profileImage ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={profileImage}
                            alt="Profile"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-bold text-3xl">
                            {user?.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="profile-image"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        {uploadingImage ? 'Uploading...' : 'Change Photo'}
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        JPG, PNG or GIF. Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+212 6XX XXX XXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        minLength={6}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Account Actions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Download Account Data
                        </h4>
                        <p className="text-sm text-gray-600">
                          Export your account information
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-900">
                          Delete Account
                        </h4>
                        <p className="text-sm text-red-700">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-100"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Phone Verification Modal */}
        {showPhoneVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <PhoneVerification
                onVerified={async (phoneNumber) => {
                  // Update user profile with verified phone
                  if (user) {
                    try {
                      const userRef = doc(db, 'users', user.uid);
                      console.log(
                        '📱 Updating user profile with verified phone:',
                        {
                          userId: user.uid,
                          phoneNumber,
                        }
                      );

                      await updateDoc(userRef, {
                        phone: phoneNumber,
                        verifiedPhone: true,
                        updatedAt: new Date(),
                      });

                      console.log('✅ Phone verified and saved successfully');
                      setSuccess(true);
                      setShowPhoneVerification(false);

                      // Real-time listener will update the UI automatically
                      // No need to reload
                    } catch (err) {
                      console.error('❌ Error updating phone:', err);
                      setError('Failed to update phone number');
                      setShowPhoneVerification(false);
                    }
                  }
                }}
                onCancel={() => setShowPhoneVerification(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
