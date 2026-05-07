'use client';

import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global app error boundary caught:', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-lg">
            <p className="text-sm font-semibold text-amber-400 mb-2">Critical error</p>
            <h1 className="text-xl font-bold mb-2">The app could not render</h1>
            <p className="text-sm text-gray-300 mb-6">
              A critical runtime failure occurred. Retry once, or reload the
              application from the home page.
            </p>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="flex-1 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400"
              >
                Retry
              </button>
              <button
                onClick={() => window.location.assign('/')}
                className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-800"
              >
                Reload home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
