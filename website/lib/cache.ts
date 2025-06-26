// Cache utility for storing API responses and improving load times
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class ApiCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly defaultExpiry = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, expiresIn: number = this.defaultExpiry): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn
    };
    this.cache.set(key, item);
    
    // Auto-cleanup expired items periodically
    this.scheduleCleanup();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    // Check if expired
    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  private scheduleCleanup(): void {
    // Clean up expired items every 10 minutes
    setTimeout(() => {
      this.cleanupExpired();
    }, 10 * 60 * 1000);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiresIn) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      totalMemory: JSON.stringify(Array.from(this.cache.values())).length
    };
  }
}

// Create singleton instance
export const apiCache = new ApiCache();

// Cache keys constants
export const CACHE_KEYS = {
  SCRIPTS_DATA: 'scripts_data',
  FEATURED_SCRIPTS: 'featured_scripts',
  LANGUAGE_STATS: 'language_stats'
} as const;

// Cache duration constants (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 2 * 60 * 1000,   // 2 minutes
  MEDIUM: 5 * 60 * 1000,  // 5 minutes  
  LONG: 15 * 60 * 1000,   // 15 minutes
  VERY_LONG: 60 * 60 * 1000 // 1 hour
} as const;
