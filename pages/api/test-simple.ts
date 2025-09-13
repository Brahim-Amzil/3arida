import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Test endpoint hit');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);

  if (req.method === 'POST') {
    console.log('Body:', req.body);
  }

  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    method: req.method,
    timestamp: new Date().toISOString(),
  });
}
