import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, verified } = req.body;

  if (!phoneNumber || typeof verified !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    // Simple response for phone verification
    // In a real app, you might want to store this verification status
    res.status(200).json({
      success: true,
      message: 'Phone verification completed',
      phoneNumber,
      verified,
    });
  } catch (error) {
    console.error('Phone verification API error:', error);
    res.status(500).json({ error: 'Phone verification failed' });
  }
}