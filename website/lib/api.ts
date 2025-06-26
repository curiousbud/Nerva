// API utilities for GitHub Pages deployment

export const getBasePath = () => {
  return process.env.NODE_ENV === 'production' ? '/Nerva' : '';
};

export const getApiUrl = (path: string) => {
  const basePath = getBasePath();
  return `${basePath}${path}`;
};

// Cache for scripts data to avoid refetching
let scriptsCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export async function fetchScriptsData() {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (scriptsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return scriptsCache;
    }

    const response = await fetch(getApiUrl('/data/scripts.json'), {
      // Add cache headers for better performance
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load scripts data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Update cache
    scriptsCache = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Error loading scripts:', error);
    
    // Return cached data if available, even if stale
    if (scriptsCache) {
      console.warn('Using cached data due to fetch error');
      return scriptsCache;
    }
    
    throw error;
  }
}
