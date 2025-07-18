'use client'

import { useEffect } from 'react'

// Custom logger that only shows messages in development
const logger = {
  log: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    // Always log errors, even in production
    console.error(message, ...args);
  }
};

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // For development, we'll unregister any existing service workers first
    // to prevent caching issues during development
    if ('serviceWorker' in navigator) {
      // Force unregister any previous service workers to avoid stale caches
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          logger.log('Unregistering previous service worker');
          registration.unregister();
        }
        
        // Only register in production
        if (process.env.NODE_ENV === 'production') {
          // After unregistering, register the new one
          setTimeout(() => {
            navigator.serviceWorker
              .register('/sw.js')
              .then((registration) => {
                logger.log('[SW] Service Worker registered successfully:', registration.scope);
              })
              .catch((error) => {
                logger.error('[SW] Service Worker registration failed:', error);
              });
          }, 1000);
        }
      });
    }
  }, []);

  return null;
}
