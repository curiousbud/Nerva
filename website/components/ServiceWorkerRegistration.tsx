'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // For development, we'll unregister any existing service workers first
    // to prevent caching issues during development
    if ('serviceWorker' in navigator) {
      // Force unregister any previous service workers to avoid stale caches
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          console.log('Unregistering previous service worker');
          registration.unregister();
        }
        
        // Only register in production
        if (process.env.NODE_ENV === 'production') {
          // After unregistering, register the new one
          setTimeout(() => {
            navigator.serviceWorker
              .register('/sw.js')
              .then((registration) => {
                console.log('[SW] Service Worker registered successfully:', registration.scope);
              })
              .catch((error) => {
                console.error('[SW] Service Worker registration failed:', error);
              });
          }, 1000);
        }
      });
    }
  }, []);

  return null;
}
