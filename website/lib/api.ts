/**
 * API Utilities for Nerva Website
 * 
 * This module handles data fetching with multi-layer caching for optimal performance:
 * 1. Memory cache (fastest, lost on page refresh)
 * 2. Session storage (survives page refresh, lost on tab close)
 * 3. Network fetch (fresh data from server)
 * 
 * The caching strategy ensures fast loading while keeping data fresh.
 */

// API utilities for static export deployment with advanced caching
import { apiCache, CACHE_KEYS, CACHE_DURATION } from './cache';

/**
 * Get Base Path for API Requests
 * 
 * Returns the base path for all API requests based on deployment platform:
 * - Netlify/Vercel/Firebase: '' (empty, serves from root)
 * - GitHub Pages: '/Nerva' (repository name as base path)
 * - Custom subdirectory: '/your-path'
 */
export const getBasePath = () => {
  // For Netlify deployment - no base path needed
  return '';
  
  // For GitHub Pages deployment, uncomment the line below:
  // return process.env.NODE_ENV === 'production' ? '/Nerva' : '';
  
  // For custom subdirectory deployment:
  // return '/your-subdirectory';
};

/**
 * Build Complete API URL
 * 
 * Combines base path with the requested path to create a full URL
 * for fetching data files.
 * 
 * @param path - Relative path to the data file (e.g., '/data/scripts.json')
 * @returns Complete URL for the API request
 */
export const getApiUrl = (path: string) => {
  const basePath = getBasePath();
  return `${basePath}${path}`;
};

/**
 * Fetch Scripts Data with Advanced Caching
 * 
 * This function implements a three-tier caching strategy:
 * 1. Memory Cache: Instant access, cleared on page refresh
 * 2. Session Storage: Survives page refresh, cleared on tab close  
 * 3. Network Fetch: Fresh data from server
 * 
 * The function tries each cache layer in order, falling back to the next
 * if data is not found or expired. This ensures optimal performance while
 * keeping data reasonably fresh.
 * 
 * @returns Promise<any> - The scripts data object
 * @throws Error if all cache layers fail and network fetch fails
 */
// Enhanced caching with multiple strategies
export async function fetchScriptsData() {
  const cacheKey = CACHE_KEYS.SCRIPTS_DATA;
  
  try {
    // === TIER 1: MEMORY CACHE ===
    // Fastest access, but lost on page refresh
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log('[API] Scripts data loaded from memory cache');
      return cachedData;
    }

    // === TIER 2: SESSION STORAGE CACHE ===
    // Survives page refreshes, lost on tab close
    const sessionData = getSessionCache('scripts_data');
    if (sessionData) {
      console.log('[API] Scripts data loaded from session cache');
      // Re-populate memory cache for faster subsequent access
      apiCache.set(cacheKey, sessionData, CACHE_DURATION.MEDIUM);
      return sessionData;
    }

    console.log('[API] Fetching fresh scripts data...');
    
    // === TIER 3: NETWORK FETCH ===
    // Add a timeout to prevent hanging forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(getApiUrl('/data/scripts.json'), {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes browser cache
        }
      });
      
      clearTimeout(timeoutId);
      
      // Handle 304 Not Modified
      if (response.status === 304) {
        console.log('[API] Scripts data not modified (304), using cached version');
        const fallbackData = getSessionCache('scripts_data');
        if (fallbackData) {
          apiCache.set(cacheKey, fallbackData, CACHE_DURATION.MEDIUM);
          return fallbackData;
        }
      }
      
      // Check if response is successful
      if (!response.ok) {
        throw new Error(`Failed to load scripts data: ${response.status} ${response.statusText}`);
      }
      
      // Parse JSON response
      const data = await response.json();
      
      // Cache the fresh data
      apiCache.set(cacheKey, data, CACHE_DURATION.MEDIUM);
      setSessionCache('scripts_data', data);
      
      console.log('[API] Scripts data fetched and cached');
      return data;
      
    } catch (fetchError) {
      console.error('[API] Fetch error:', fetchError);
      clearTimeout(timeoutId);
      throw fetchError;
    }
    
  } catch (error) {
    console.error('[API] Error loading scripts:', error);
    
    // === FALLBACK: USE STALE CACHE ===
    // If all else fails, try to return any cached data (even if stale)
    const staleData = apiCache.get(cacheKey) || getSessionCache('scripts_data');
    if (staleData) {
      console.warn('[API] Using stale cached data due to fetch error');
      return staleData;
    }
    
    // Last resort: return empty data structure
    console.warn('[API] No cached data available, returning empty structure');
    return {
      lastUpdated: "",
      totalScripts: 0,
      languages: {}
    };
  }
}

/**
 * Session Storage Cache Helper Functions
 * 
 * These functions manage the session storage cache layer, which:
 * - Survives page refreshes (unlike memory cache)
 * - Is cleared when the browser tab is closed
 * - Has expiration timestamps to prevent stale data
 */

/**
 * Get Data from Session Storage Cache
 * 
 * Retrieves cached data from browser session storage with expiration check.
 * Returns null if data is not found, expired, or if running on server-side.
 * 
 * @param key - Cache key to retrieve
 * @returns Cached data or null if not found/expired
 */
function getSessionCache(key: string): any {
  // Check if we're running in a browser environment
  if (typeof window === 'undefined') return null;
  
  try {
    // Attempt to retrieve cached data
    const cached = sessionStorage.getItem(`nerva_${key}`);
    if (!cached) return null;
    
    // Parse the cached data structure
    const { data, timestamp } = JSON.parse(cached);
    
    // Check if the cache has expired (15 minutes for session cache)
    if (Date.now() - timestamp > CACHE_DURATION.LONG) {
      // Remove expired cache entry
      sessionStorage.removeItem(`nerva_${key}`);
      return null;
    }
    
    return data;
  } catch {
    // If any error occurs (parsing, etc.), return null
    return null;
  }
}

/**
 * Store Data in Session Storage Cache
 * 
 * Saves data to browser session storage with current timestamp for expiration.
 * Silently fails if running on server-side or if storage is full.
 * 
 * @param key - Cache key to store under
 * @param data - Data to cache
 */
function setSessionCache(key: string, data: any): void {
  // Check if we're running in a browser environment
  if (typeof window === 'undefined') return;
  
  try {
    // Create cache entry with timestamp
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    
    // Store in session storage with prefixed key
    sessionStorage.setItem(`nerva_${key}`, JSON.stringify(cacheData));
  } catch (error) {
    // Log warning but don't throw - caching is optional
    console.warn('Failed to set session cache:', error);
  }
}

/**
 * Preload Scripts Data for Instant Access
 * 
 * This function can be called early in the application lifecycle to
 * pre-populate caches, ensuring instant access when the data is needed.
 * 
 * Used for performance optimization - call this when the app starts
 * to have data ready before users navigate to pages that need it.
 * 
 * @returns Promise<void> - Resolves when preload is complete (success or failure)
 */
export async function preloadScriptsData(): Promise<void> {
  try {
    await fetchScriptsData();
    console.log('🚀 Scripts data preloaded successfully');
  } catch (error) {
    // Log warning but don't throw - preloading is optional
    console.warn('⚠️ Failed to preload scripts data:', error);
  }
}
