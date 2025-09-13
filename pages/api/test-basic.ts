import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Basic test endpoint called');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);

  res.status(200).json({
    success: true,
    message: 'Basic API working',
    method: req.method,
    timestamp: new Date().toISOString(),
  });
}
