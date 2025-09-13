import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TestFirebase() {
  const [status, setStatus] = useState('Testing Firebase connection...');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults((prev) => [...prev, message]);
  };

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test 1: Firebase Config
        addResult('✅ Firebase config loaded');

        // Test 2: Auth connection
        if (auth) {
          addResult('✅ Firebase Auth initialized');
        } else {
          addResult('❌ Firebase Auth failed to initialize');
        }

        // Test 3: Firestore connection
        if (db) {
          addResult('✅ Firestore initialized');

          // Test 4: Try to write to Firestore
          try {
            const testDoc = doc(db, 'test', 'connection');
            await setDoc(testDoc, {
              message: 'Firebase connection test',
              timestamp: new Date(),
            });
            addResult('✅ Firestore write successful');

            // Test 5: Try to read from Firestore
            const docSnap = await getDoc(testDoc);
            if (docSnap.exists()) {
              addResult('✅ Firestore read successful');
            } else {
              addResult('❌ Firestore read failed - document not found');
            }
          } catch (firestoreError: any) {
            addResult(
              `❌ Firestore operation failed: ${firestoreError.message}`
            );
          }
        } else {
          addResult('❌ Firestore failed to initialize');
        }

        setStatus('Firebase tests completed');
      } catch (error: any) {
        addResult(`❌ Firebase test failed: ${error.message}`);
        setStatus('Firebase tests failed');
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      <p className="mb-4">{status}</p>

      <div className="space-y-2">
        {results.map((result, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded">
            {result}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded">
        <h2 className="font-bold">If you see errors:</h2>
        <ul className="list-disc list-inside mt-2">
          <li>Make sure you've enabled Authentication in Firebase Console</li>
          <li>Make sure you've created a Firestore database</li>
          <li>
            Check that your Firebase project ID is correct:{' '}
            <code>arida-c5faf</code>
          </li>
          <li>Verify your environment variables are loaded correctly</li>
        </ul>
      </div>
    </div>
  );
}
