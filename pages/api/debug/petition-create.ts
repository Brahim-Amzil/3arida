import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('=== PETITION CREATE DEBUG ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body type:', typeof req.body);
  console.log('Body:', req.body);
  console.log('Query:', req.query);

  // Check environment variables
  console.log('Environment check:');
  console.log('- FIREBASE_PROJECT_ID:', !!process.env.FIREBASE_PROJECT_ID);
  console.log('- FIREBASE_CLIENT_EMAIL:', !!process.env.FIREBASE_CLIENT_EMAIL);
  console.log('- FIREBASE_PRIVATE_KEY:', !!process.env.FIREBASE_PRIVATE_KEY);

  // Test imports
  try {
    console.log('Testing imports...');
    const { adminAuth, adminDb } = await import('../../../lib/firebase/admin');
    console.log('Firebase admin imported successfully');

    const { PetitionManagementService } = await import(
      '../../../lib/services/petitionService'
    );
    console.log('PetitionManagementService imported successfully');

    const formidable = await import('formidable');
    console.log('Formidable imported successfully');
  } catch (error) {
    console.error('Import error:', error);
    return res
      .status(500)
      .json({ error: 'Import failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }

  res.status(200).json({
    success: true,
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString(),
  });
}
