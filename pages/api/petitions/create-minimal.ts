import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('=== MINIMAL PETITION CREATE API CALLED ===');
  console.log('Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log(
    'Authorization:',
    req.headers.authorization ? 'Present' : 'Missing'
  );

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Just return success for now
    res.status(200).json({
      success: true,
      message: 'Minimal API working',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in minimal API:', error);
   return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
