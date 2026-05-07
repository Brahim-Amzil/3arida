'use client';

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'pwa-update-dismissed-at';
const DISMISS_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export default function PwaUpdatePrompt() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let hasReloaded = false;

    const shouldSuppressPrompt = () => {
      const dismissedAt = window.localStorage.getItem(DISMISS_KEY);
      if (!dismissedAt) return false;
      const timestamp = Number(dismissedAt);
      return Number.isFinite(timestamp) && Date.now() - timestamp < DISMISS_WINDOW_MS;
    };

    const showIfAllowed = (worker: ServiceWorker | null) => {
      if (!worker || shouldSuppressPrompt()) return;
      setWaitingWorker(worker);
      setShowPrompt(true);
    };

    const onControllerChange = () => {
      if (hasReloaded) return;
      hasReloaded = true;
      window.location.reload();
    };

    const onRegistration = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) showIfAllowed(registration.waiting);

      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showIfAllowed(registration.waiting || installingWorker);
          }
        });
      });
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) onRegistration(registration);
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const handleUpdateNow = () => {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    setShowPrompt(false);
  };

  const handleLater = () => {
    window.localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 rounded-lg border border-emerald-300 bg-emerald-50 p-4 shadow-lg z-50">
      <p className="text-sm font-semibold text-emerald-900 mb-1">
        New version available
      </p>
      <p className="text-sm text-emerald-800 mb-3">
        A newer app version is ready. Update now to avoid stale screens.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleUpdateNow}
          className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Update now
        </button>
        <button
          onClick={handleLater}
          className="rounded-md border border-emerald-500 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
        >
          Later
        </button>
      </div>
    </div>
  );
}
