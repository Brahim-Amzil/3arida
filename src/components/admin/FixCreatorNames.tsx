'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';

export default function FixCreatorNames() {
  const { user, userProfile } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    updated: number;
    skipped: number;
    errors: number;
    total: number;
  } | null>(null);

  // Only show to admins
  if (!userProfile || userProfile.role !== 'admin') {
    return null;
  }

  const fixCreatorNames = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      console.log('🔄 Starting migration to add creator names to petitions...');

      // Import Firebase functions
      const { collection, getDocs, doc, updateDoc, getDoc } =
        await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // Get all petitions
      const petitionsSnapshot = await getDocs(collection(db, 'petitions'));
      console.log(`📊 Found ${petitionsSnapshot.size} petitions to process`);

      let updated = 0;
      let skipped = 0;
      let errors = 0;

      for (const petitionDoc of petitionsSnapshot.docs) {
        const petition = petitionDoc.data();
        const petitionId = petitionDoc.id;

        // Skip if already has creator name and it's not Anonymous
        if (petition.creatorName && petition.creatorName !== 'Anonymous') {
          console.log(
            `⏭️  Skipping ${petitionId} - already has creator name: ${petition.creatorName}`
          );
          skipped++;
          continue;
        }

        try {
          // Check if petition has a valid creatorId
          if (!petition.creatorId) {
            console.log(
              `⚠️  Warning: Petition ${petitionId} has no creatorId - setting to Anonymous`
            );

            // Update petition with Anonymous creator name
            await updateDoc(doc(db, 'petitions', petitionId), {
              creatorName: 'Anonymous',
              updatedAt: new Date(),
            });

            console.log(
              `✅ Updated petition ${petitionId} with creator name: Anonymous`
            );
            updated++;
            continue;
          }

          // Get creator user document
          const userDocRef = doc(db, 'users', petition.creatorId);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            console.log(
              `⚠️  Warning: User ${petition.creatorId} not found for petition ${petitionId} - setting to Anonymous`
            );

            // Update petition with Anonymous creator name since user doesn't exist
            await updateDoc(doc(db, 'petitions', petitionId), {
              creatorName: 'Anonymous',
              updatedAt: new Date(),
            });

            console.log(
              `✅ Updated petition ${petitionId} with creator name: Anonymous`
            );
            updated++;
            continue;
          }

          const userData = userDoc.data();
          const creatorName =
            userData.name || userData.displayName || 'Anonymous';

          // Update petition with creator name
          await updateDoc(doc(db, 'petitions', petitionId), {
            creatorName: creatorName,
            updatedAt: new Date(),
          });

          console.log(
            `✅ Updated petition ${petitionId} with creator name: ${creatorName}`
          );
          updated++;

          // Add small delay to avoid overwhelming Firestore
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error: any) {
          console.error(`❌ Error processing petition ${petitionId}:`, error);

          // Check if it's a permissions error
          if (
            error.code === 'permission-denied' ||
            error.message?.includes('permissions')
          ) {
            console.log(
              '💡 Permissions error detected. Consider using the server-side script instead.'
            );
          }

          errors++;
        }
      }

      setResults({
        updated,
        skipped,
        errors,
        total: petitionsSnapshot.size,
      });

      console.log('\n📊 Migration Summary:');
      console.log(`   ✅ Updated: ${updated}`);
      console.log(`   ⏭️  Skipped: ${skipped}`);
      console.log(`   ❌ Errors: ${errors}`);
      console.log(`   📝 Total: ${petitionsSnapshot.size}`);
      console.log('\n✨ Migration complete!');
    } catch (error: any) {
      console.error('❌ Migration failed:', error);

      if (
        error.code === 'permission-denied' ||
        error.message?.includes('permissions')
      ) {
        alert(
          'Permission denied. Please use the server-side script instead:\n\nRun: node fix-creator-names.js\n\nThis script has admin privileges and can update all petitions.'
        );
      } else {
        alert('Migration failed. Check console for details.');
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <div className="flex items-start">
        <svg
          className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-yellow-900 mb-2">
            Fix Creator Names
          </h3>
          <p className="text-sm text-yellow-700 mb-4">
            Some petitions are showing "Created by Anonymous" instead of the
            actual creator names. This tool will update all petitions with the
            correct creator names from the user database.
          </p>

          {results && (
            <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
              <h4 className="font-medium text-gray-900 mb-2">
                Migration Results:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-green-600 font-medium">
                    ✅ Updated:
                  </span>
                  <div className="text-lg font-bold text-green-700">
                    {results.updated}
                  </div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">⏭️ Skipped:</span>
                  <div className="text-lg font-bold text-blue-700">
                    {results.skipped}
                  </div>
                </div>
                <div>
                  <span className="text-red-600 font-medium">❌ Errors:</span>
                  <div className="text-lg font-bold text-red-700">
                    {results.errors}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">📝 Total:</span>
                  <div className="text-lg font-bold text-gray-700">
                    {results.total}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={fixCreatorNames}
            disabled={isRunning}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Fixing Creator Names...
              </>
            ) : (
              'Fix Creator Names'
            )}
          </Button>

          {results && (
            <p className="text-sm text-green-700 mt-2">
              ✅ Migration completed! Refresh the petitions page to see the
              updated creator names.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
