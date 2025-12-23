'use client';

import { useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MigrateCreatorNamesPage() {
  const { userProfile } = useAuth();
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [summary, setSummary] = useState<{
    updated: number;
    skipped: number;
    errors: number;
    total: number;
  } | null>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
    console.log(message);
  };

  const runMigration = async () => {
    if (userProfile?.role !== 'admin') {
      alert('Only admins can run this migration');
      return;
    }

    setRunning(true);
    setLogs([]);
    setSummary(null);

    try {
      addLog('🔄 Starting migration to add creator names to petitions...\n');

      // Get all petitions
      const petitionsSnapshot = await getDocs(collection(db, 'petitions'));
      addLog(`📊 Found ${petitionsSnapshot.size} petitions to process\n`);

      let updated = 0;
      let skipped = 0;
      let errors = 0;

      for (const petitionDoc of petitionsSnapshot.docs) {
        const petition = petitionDoc.data();
        const petitionId = petitionDoc.id;

        // Skip if already has creator name
        if (petition.creatorName) {
          addLog(
            `⏭️  Skipping ${petitionId} - already has creator name: ${petition.creatorName}`
          );
          skipped++;
          continue;
        }

        try {
          // Get creator user document
          const userDocRef = doc(db, 'users', petition.creatorId);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            addLog(
              `⚠️  Warning: User ${petition.creatorId} not found for petition ${petitionId}`
            );
            errors++;
            continue;
          }

          const userData = userDoc.data();
          const creatorName = userData.name || 'Anonymous';

          // Update petition with creator name
          await updateDoc(doc(db, 'petitions', petitionId), {
            creatorName: creatorName,
            updatedAt: new Date(),
          });

          addLog(
            `✅ Updated petition ${petitionId} with creator name: ${creatorName}`
          );
          updated++;
        } catch (error: any) {
          addLog(
            `❌ Error processing petition ${petitionId}: ${error.message}`
          );
          errors++;
        }
      }

      const finalSummary = {
        updated,
        skipped,
        errors,
        total: petitionsSnapshot.size,
      };

      setSummary(finalSummary);
      addLog('\n📊 Migration Summary:');
      addLog(`   ✅ Updated: ${updated}`);
      addLog(`   ⏭️  Skipped: ${skipped}`);
      addLog(`   ❌ Errors: ${errors}`);
      addLog(`   📝 Total: ${petitionsSnapshot.size}`);
      addLog('\n✨ Migration complete!');
    } catch (error: any) {
      addLog(`❌ Migration failed: ${error.message}`);
    } finally {
      setRunning(false);
    }
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              Access denied. Only admins can access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Migrate Creator Names</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              This migration will add creator names to all existing petitions
              that don't have them.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runMigration}
              disabled={running}
              className="w-full"
            >
              {running ? 'Running Migration...' : 'Run Migration'}
            </Button>

            {summary && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>✅ Updated:</span>
                    <span className="font-medium">{summary.updated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⏭️ Skipped:</span>
                    <span className="font-medium">{summary.skipped}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>❌ Errors:</span>
                    <span className="font-medium">{summary.errors}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span>📝 Total:</span>
                    <span className="font-medium">{summary.total}</span>
                  </div>
                </div>
              </div>
            )}

            {logs.length > 0 && (
              <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-auto max-h-96">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
