import { useAuth } from '@/lib/firebase/AuthContext';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export interface ModeratorPermissions {
  approve: boolean;
  pause: boolean;
  delete: boolean;
  statsAccess: boolean;
}

export interface RoleAccess {
  isUser: boolean;
  isModerator: boolean;
  isAdmin: boolean;
  moderatorPermissions: ModeratorPermissions | null;
  canCreatePetition: boolean;
  canSignPetition: boolean;
  hasPermission: (permission: keyof ModeratorPermissions) => boolean;
}

export const useRoleAccess = (): RoleAccess => {
  const { user, userDocument } = useAuth();
  const [moderatorPermissions, setModeratorPermissions] =
    useState<ModeratorPermissions | null>(null);

  useEffect(() => {
    const fetchModeratorPermissions = async () => {
      if (user && userDocument?.role === 'moderator') {
        try {
          const moderatorsRef = collection(db, 'moderators');
          const q = query(moderatorsRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const moderatorData = querySnapshot.docs[0].data();
            setModeratorPermissions(
              moderatorData.permissions || {
                approve: false,
                pause: false,
                delete: false,
                statsAccess: false,
              }
            );
          }
        } catch (error) {
          console.error('Error fetching moderator permissions:', error);
          setModeratorPermissions(null);
        }
      } else {
        setModeratorPermissions(null);
      }
    };

    fetchModeratorPermissions();
  }, [user, userDocument]);

  const isUser = userDocument?.role === 'user';
  const isModerator = userDocument?.role === 'moderator';
  const isAdmin = userDocument?.role === 'admin';

  const canCreatePetition = user && userDocument?.verifiedEmail === true;
  const canSignPetition = user && userDocument?.verifiedPhone === true;

  const hasPermission = (permission: keyof ModeratorPermissions): boolean => {
    if (isAdmin) return true;
    if (isModerator && moderatorPermissions) {
      return moderatorPermissions[permission] === true;
    }
    return false;
  };

  return {
    isUser,
    isModerator,
    isAdmin,
    moderatorPermissions,
    canCreatePetition: !!canCreatePetition,
    canSignPetition: !!canSignPetition,
    hasPermission,
  };
};

export default useRoleAccess;
