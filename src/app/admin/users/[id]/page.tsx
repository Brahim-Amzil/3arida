'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, ShieldOff, Ban, CheckCircle } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

interface User {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  isActive: boolean;
  createdAt: any;
  lastLoginAt?: any;
  petitionCount?: number;
  signatureCount?: number;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user] = useAuthState(getAuth());
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const userId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchUser();
  }, [user, userId]);

  const fetchUser = async () => {
    try {
      // Fetch user data
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        console.error('User not found');
        router.push('/admin/users');
        return;
      }

      const userData = { id: userDoc.id, ...userDoc.data() } as User;

      // Fetch user's petition count
      const petitionsQuery = query(
        collection(db, 'petitions'),
        where('creatorId', '==', userId)
      );
      const petitionsSnapshot = await getDocs(petitionsQuery);
      userData.petitionCount = petitionsSnapshot.size;

      // Fetch user's signature count
      const signaturesQuery = query(
        collection(db, 'signatures'),
        where('userId', '==', userId)
      );
      const signaturesSnapshot = await getDocs(signaturesQuery);
      userData.signatureCount = signaturesSnapshot.size;

      setTargetUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (newRole: string) => {
    if (!targetUser) return;

    setUpdating(true);
    try {
      await updateDoc(doc(db, 'users', targetUser.id), {
        role: newRole,
        updatedAt: new Date(),
      });

      setTargetUser({ ...targetUser, role: newRole });
      alert(`User role updated to ${newRole} successfully!`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    } finally {
      setUpdating(false);
    }
  };

  const toggleUserStatus = async () => {
    if (!targetUser) return;

    setUpdating(true);
    try {
      const newStatus = !targetUser.isActive;
      await updateDoc(doc(db, 'users', targetUser.id), {
        isActive: newStatus,
        updatedAt: new Date(),
      });

      setTargetUser({ ...targetUser, isActive: newStatus });
      alert(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status');
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

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            User Not Found
          </h1>
          <Button onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>

          <div className="flex items-center gap-2">
            <Badge className={getRoleColor(targetUser.role)}>
              {targetUser.role.toUpperCase()}
            </Badge>
            <Badge
              className={
                targetUser.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }
            >
              {targetUser.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
        </div>

        {/* User Details */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {targetUser.displayName || 'No Display Name'}
              </h1>
              <p className="text-gray-600">{targetUser.email}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-mono text-sm">{targetUser.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-medium">
                  {targetUser.createdAt
                    ? new Date(
                        targetUser.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium">
                  {targetUser.lastLoginAt
                    ? new Date(
                        targetUser.lastLoginAt.seconds * 1000
                      ).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  {targetUser.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Petitions Created</p>
                <p className="text-2xl font-bold text-green-600">
                  {targetUser.petitionCount || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Petitions Signed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {targetUser.signatureCount || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Admin Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Admin Actions</h2>

          <div className="space-y-4">
            {/* Role Management */}
            <div>
              <h3 className="text-md font-medium mb-2">Role Management</h3>
              <div className="flex flex-wrap gap-2">
                {targetUser.role !== 'admin' && (
                  <Button
                    onClick={() => updateUserRole('admin')}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Make Admin
                  </Button>
                )}
                {targetUser.role !== 'moderator' && (
                  <Button
                    onClick={() => updateUserRole('moderator')}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                  >
                    <ShieldOff className="w-4 h-4 mr-2" />
                    Make Moderator
                  </Button>
                )}
                {targetUser.role !== 'user' && (
                  <Button
                    onClick={() => updateUserRole('user')}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                  >
                    Remove Privileges
                  </Button>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div>
              <h3 className="text-md font-medium mb-2">Account Status</h3>
              <Button
                onClick={toggleUserStatus}
                disabled={updating}
                variant={targetUser.isActive ? 'destructive' : 'default'}
                size="sm"
              >
                {targetUser.isActive ? (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Deactivate User
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate User
                  </>
                )}
              </Button>
            </div>
          </div>

          {updating && (
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              Updating user...
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
