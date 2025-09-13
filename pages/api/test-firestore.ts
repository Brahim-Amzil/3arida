import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing Firestore connection...');

    // Try to write a simple test document
    const testData = {
      message: 'Test document',
      timestamp: serverTimestamp(),
    };

    console.log('Attempting to write to Firestore...');
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('Document written successfully with ID:', docRef.id);

    res.status(200).json({
      success: true,
      message: 'Firestore test successful',
      documentId: docRef.id,
    });
  } catch (error) {
    console.error('Firestore test error:', error);
    res.status(500).json({
      success: false,
      error: 'Firestore test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
