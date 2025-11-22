import * as functions from 'firebase-functions';
import next from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const server = next({
  dev: isDev,
  conf: { distDir: '.next' },
});

const handle = server.getRequestHandler();

export const nextjsFunc = functions
  .runWith({
    memory: '1GB',
    timeoutSeconds: 60,
  })
  .https.onRequest(async (req, res) => {
    console.log('Request:', req.method, req.url);

    try {
      await server.prepare();
      return handle(req, res);
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).send('Internal Server Error');
    }
  });
