'use client';

import { useEffect } from 'react';

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error('App route error boundary caught:', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-xl border border-red-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-red-600 mb-2">Something went wrong</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          We hit an unexpected error
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          The page failed to load correctly. Try again now, or refresh the app.
        </p>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.assign('/')}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
