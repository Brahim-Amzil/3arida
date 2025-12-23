'use client';

import { useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/HeaderWrapper';

export default function FixUsersPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    updated: number;
    alreadyActive: number;
    errors: number;
  } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
    console.log(message);
  };

  const fixUserActiveStatus = async () => {
    try {
      setLoading(true);
      setResults(null);
      setLogs([]);

      addLog('🔍 Fetching all users...');

      const usersSnapshot = await getDocs(collection(db, 'users'));
      addLog(`📊 Found ${usersSnapshot.size} users`);

      let updatedCount = 0;
      let alreadyActiveCount = 0;
      let errorCount = 0;

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();

        try {
          // Check if isActive field is missing or null
          if (userData.isActive === undefined || userData.isActive === null) {
            addLog(
              `✅ Setting isActive=true for user: ${userData.email || userDoc.id}`
            );
            await updateDoc(doc(db, 'users', userDoc.id), {
              isActive: true,
              updatedAt: new Date(),
            });
            updatedCount++;
          } else if (userData.isActive === true) {
            alreadyActiveCount++;
          } else {
            addLog(
              `⚠️  User ${userData.email || userDoc.id} is explicitly inactive`
            );
          }
        } catch (error) {
          addLog(`❌ Error updating user ${userDoc.id}: ${error}`);
          errorCount++;
        }
      }

      addLog('\n✨ Migration complete!');
      setResults({
        total: usersSnapshot.size,
        updated: updatedCount,
        alreadyActive: alreadyActiveCount,
        errors: errorCount,
      });
    } catch (error) {
      addLog(`❌ Error fixing user active status: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Fix User Active Status</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              This tool will set isActive=true for all users who don't have this
              field set. This is useful for fixing users created before the
              isActive field was added.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={fixUserActiveStatus}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Fix User Active Status'}
              </Button>

              {results && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Results:
                  </h3>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>📊 Total users: {results.total}</li>
                    <li>📈 Updated: {results.updated}</li>
                    <li>✓ Already active: {results.alreadyActive}</li>
                    <li>❌ Errors: {results.errors}</li>
                  </ul>
                </div>
              )}

              {logs.length > 0 && (
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Logs:</h3>
                  <div className="space-y-1 text-xs font-mono">
                    {logs.map((log, index) => (
                      <div key={index}>{log}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
