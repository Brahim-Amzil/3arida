'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/HeaderWrapper';

export default function AdminSetupPage() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      setMessage('❌ You must be logged in to become an admin');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Create or update user document with admin role
      const userDocRef = doc(db, 'users', user.uid);

      // Check if user document exists
      const userDoc = await getDoc(userDocRef);
      const existingData = userDoc.exists() ? userDoc.data() : {};

      // Update user with admin role
      await setDoc(
        userDocRef,
        {
          ...existingData,
          id: user.uid,
          name:
            existingData.name ||
            user.displayName ||
            user.email?.split('@')[0] ||
            'Admin',
          email: user.email || '',
          role: 'admin',
          verifiedEmail: user.emailVerified || false,
          verifiedPhone: existingData.verifiedPhone || false,
          isActive: true,
          createdAt: existingData.createdAt || new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
        },
        { merge: true }
      );

      setMessage(
        '✅ Success! You are now an admin. Refresh the page to see admin features.'
      );

      // Reload the page after 2 seconds to update the auth context
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error making user admin:', error);
      setMessage('❌ Failed to make you an admin. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const makeUserAdminByEmail = async (email: string) => {
    if (!user || userProfile?.role !== 'admin') {
      setMessage('❌ Only existing admins can promote other users');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // This is a simplified version - in production you'd need to find user by email
      setMessage(
        '⚠️ Feature not implemented yet. Use the "Make Me Admin" button for now.'
      );
    } catch (error) {
      console.error('Error making user admin:', error);
      setMessage('❌ Failed to make user admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              🔧 Admin Setup
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Use this page to set up admin access for petition moderation.
              </p>

              {user ? (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Current User:</strong> {user.email}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Current Role:</strong> {userProfile?.role || 'user'}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <p className="text-yellow-800">
                    ⚠️ You must be logged in to use this page
                  </p>
                </div>
              )}
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes('✅')
                    ? 'bg-green-50 text-green-800'
                    : message.includes('❌')
                      ? 'bg-red-50 text-red-800'
                      : 'bg-yellow-50 text-yellow-800'
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-4">
              <Button
                onClick={makeCurrentUserAdmin}
                disabled={loading || !user}
                className="w-full"
                size="lg"
              >
                {loading ? 'Setting up...' : '👑 Make Me Admin'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  This will give you admin access to approve/reject petitions
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">
                After becoming admin, you can:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  • Access the admin dashboard at <code>/admin</code>
                </li>
                <li>• Approve or reject pending petitions</li>
                <li>• Manage users and their roles</li>
                <li>• View platform statistics</li>
                <li>• Moderate content and comments</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                🚨 Security Note
              </h4>
              <p className="text-sm text-gray-600">
                In production, admin access should be granted through a secure
                process. This setup page is for development/testing purposes
                only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
