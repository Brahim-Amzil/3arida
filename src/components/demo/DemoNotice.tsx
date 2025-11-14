'use client';

import React from 'react';
import { isDemoMode } from '@/lib/demo-data';

export default function DemoNotice() {
  if (!isDemoMode()) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <div className="w-5 h-5 text-blue-400">🎭</div>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Demo Mode:</strong> This is a demonstration of the 3arida
            petition platform. Authentication and data submission are disabled.
            You can explore the interface and see sample petitions.
          </p>
        </div>
      </div>
    </div>
  );
}
