// Database Query Optimization and Connection Management
import { Pool } from '@neondatabase/serverless';

class DatabaseOptimizer {
  private queryCache = new Map<string, { result: any; timestamp: number; ttl: number }>();
  private connectionPool: Pool;
  private queryStats = {
    totalQueries: 0,
    cacheHits: 0,
    slowQueries: 0,
    errors: 0,
  };

  constructor(connectionString: string) {
    this.connectionPool = new Pool({
      connectionString,
      max: 15, // Reduced from 20
      min: 3,  // Increased from 2
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000, // Faster timeout
    });

    // Monitor pool events
    this.connectionPool.on('error', (err) => {
      console.error('Database pool error:', err);
      this.queryStats.errors++;
    });

    // Disable cache clearing during optimization
    // setInterval(() => {
    //   this.clearExpiredCache();
    // }, 600000); // Every 10 minutes when enabled
  }

  // Cached query execution
  async executeCachedQuery<T>(
    query: string, 
    params: any[] = [], 
    ttl: number = 300000 // 5 minutes default
  ): Promise<T> {
    const cacheKey = `${query}:${JSON.stringify(params)}`;
    this.queryStats.totalQueries++;

    // Check cache first
    const cached = this.queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      this.queryStats.cacheHits++;
      return cached.result;
    }

    // Execute query
    const start = performance.now();
    try {
      const result = await this.connectionPool.query(query, params);

      const duration = performance.now() - start;
      if (duration > 1000) {
        this.queryStats.slowQueries++;
        console.warn(`Slow query (${duration.toFixed(2)}ms):`, query.substring(0, 100));
      }

      // Cache the result
      this.queryCache.set(cacheKey, {
        result: result.rows,
        timestamp: Date.now(),
        ttl,
      });

      return result.rows as T;
    } catch (error) {
      this.queryStats.errors++;
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Batch operations for better performance
  async executeBatchQueries(queries: { query: string; params: any[] }[]): Promise<any[]> {
    const results: any[] = [];

    try {
      await this.connectionPool.query('BEGIN');
      
      for (const { query, params } of queries) {
        const result = await this.connectionPool.query(query, params);
        results.push(result.rows);
      }
      
      await this.connectionPool.query('COMMIT');
      return results;
    } catch (error) {
      await this.connectionPool.query('ROLLBACK');
      this.queryStats.errors++;
      throw error;
    }
  }

  // Optimized pagination
  async getPaginatedResults<T>(
    baseQuery: string,
    params: any[],
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: T[]; total: number; hasMore: boolean }> {
    const offset = (page - 1) * limit;
    
    // Count query for total
    const countQuery = baseQuery.replace(/SELECT .+ FROM/, 'SELECT COUNT(*) as total FROM');
    const countResult = await this.executeCachedQuery<{ total: number }[]>(countQuery, params, 60000);
    const total = countResult[0]?.total || 0;

    // Data query with pagination
    const dataQuery = `${baseQuery} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    const data = await this.executeCachedQuery<T[]>(dataQuery, [...params, limit, offset], 300000);

    return {
      data,
      total,
      hasMore: offset + limit < total,
    };
  }

  // Clear expired cache entries
  private clearExpiredCache() {
    const now = Date.now();
    let cleared = 0;

    for (const [key, entry] of this.queryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.queryCache.delete(key);
        cleared++;
      }
    }

    if (cleared > 0) {
      console.log(`Database cache: Cleared ${cleared} expired entries`);
    }
  }

  // Get performance statistics
  getStats() {
    return {
      ...this.queryStats,
      cacheSize: this.queryCache.size,
      cacheHitRate: this.queryStats.totalQueries > 0 
        ? Math.round((this.queryStats.cacheHits / this.queryStats.totalQueries) * 100) 
        : 0,
      poolStats: {
        totalCount: this.connectionPool.totalCount,
        idleCount: this.connectionPool.idleCount,
        waitingCount: this.connectionPool.waitingCount,
      },
    };
  }

  // Cleanup resources
  async destroy() {
    this.queryCache.clear();
    await this.connectionPool.end();
  }
}

export const createDatabaseOptimizer = (connectionString: string) => {
  return new DatabaseOptimizer(connectionString);
};