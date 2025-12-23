'use client';

import { useEffect } from 'react';

export default function DebugComponent() {
  useEffect(() => {
    console.log('🔍 DebugComponent mounted - client-side code is running');
    console.log('🔍 Window object available:', typeof window !== 'undefined');
    console.log('🔍 Current URL:', typeof window !== 'undefined' ? window.location.href : 'N/A');
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'red', 
      color: 'white', 
      padding: '5px', 
      fontSize: '12px',
      zIndex: 9999 
    }}>
      DEBUG: Client-side active
    </div>
  );
}