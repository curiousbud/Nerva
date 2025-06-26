// API utilities for GitHub Pages deployment with advanced caching
import { apiCache, CACHE_KEYS, CACHE_DURATION } from './cache';

export const getBasePath = () => {
  return process.env.NODE_ENV === 'production' ? '/Nerva' : '';
};

export const getApiUrl = (path: string) => {
  const basePath = getBasePath();
  return `${basePath}${path}`;
};

// Enhanced caching with multiple strategies
export async function fetchScriptsData() {
  const cacheKey = CACHE_KEYS.SCRIPTS_DATA;
  
  try {
    // 1. Try memory cache first (fastest)
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log('📦 Scripts data loaded from memory cache');
      return cachedData;
    }

    // 2. Try sessionStorage cache (survives page refreshes)
    const sessionData = getSessionCache('scripts_data');
    if (sessionData) {
      console.log('💾 Scripts data loaded from session cache');
      // Re-populate memory cache
      apiCache.set(cacheKey, sessionData, CACHE_DURATION.MEDIUM);
      return sessionData;
    }

    console.log('🌐 Fetching fresh scripts data...');
    
    // 3. Fetch fresh data
    const response = await fetch(getApiUrl('/data/scripts.json'), {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes browser cache
        'If-None-Match': getETag('scripts_data'), // Conditional request
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load scripts data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store in multiple cache layers
    apiCache.set(cacheKey, data, CACHE_DURATION.MEDIUM);
    setSessionCache('scripts_data', data);
    setETag('scripts_data', response.headers.get('etag') || '');
    
    console.log('✅ Scripts data fetched and cached');
    return data;
    
  } catch (error) {
    console.error('❌ Error loading scripts:', error);
    
    // Fallback: try to return any cached data (even if stale)
    const staleData = apiCache.get(cacheKey) || getSessionCache('scripts_data');
    if (staleData) {
      console.warn('⚠️ Using stale cached data due to fetch error');
      return staleData;
    }
    
    throw error;
  }
}

// Session storage cache helpers
function getSessionCache(key: string): any {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = sessionStorage.getItem(`nerva_${key}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    // Check if expired (15 minutes for session cache)
    if (Date.now() - timestamp > CACHE_DURATION.LONG) {
      sessionStorage.removeItem(`nerva_${key}`);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

function setSessionCache(key: string, data: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    sessionStorage.setItem(`nerva_${key}`, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to set session cache:', error);
  }
}

// ETag helpers for conditional requests
function getETag(key: string): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(`nerva_etag_${key}`) || '';
}

function setETag(key: string, etag: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`nerva_etag_${key}`, etag);
  } catch (error) {
    console.warn('Failed to set ETag:', error);
  }
}

// Preload data for instant access
export async function preloadScriptsData(): Promise<void> {
  try {
    await fetchScriptsData();
    console.log('🚀 Scripts data preloaded successfully');
  } catch (error) {
    console.warn('⚠️ Failed to preload scripts data:', error);
  }
}
