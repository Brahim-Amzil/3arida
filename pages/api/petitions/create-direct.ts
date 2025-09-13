import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('=== DIRECT PETITION CREATE ===');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test direct import - exact same as working test
    console.log('Testing direct import...');
    const { adminDb } = await import('../../../lib/firebase/admin');
    console.log('adminDb imported:', !!adminDb);
    console.log('adminDb type:', typeof adminDb);

    if (!adminDb) {
      throw new Error('adminDb is undefined');
    }

    // Test collection method
    console.log('Testing collection method...');
    const petitionsCollection = adminDb.collection('petitions');
    console.log('Collection created:', !!petitionsCollection);

    // Create a simple petition document
    const petitionDoc = {
      title: 'Test Petition',
      description: 'This is a test petition created directly',
      category: 'Environment',
      createdBy: 'test-user',
      createdAt: new Date(),
      status: 'active',
      signatureCount: 0,
    };

    console.log('Adding petition to Firestore...');
    const docRef = await petitionsCollection.add(petitionDoc);
    console.log('Document created with ID:', docRef.id);

    res.status(200).json({
      success: true,
      message: 'Direct petition creation successful',
      petitionId: docRef.id,
    });
  } catch (error) {
    console.error('Direct petition creation error:', error);
   return res.status(500).json({
      success: false,
      error: 'Direct petition creation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
