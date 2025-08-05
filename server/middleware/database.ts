import { Pool } from '@neondatabase/serverless';
import { Request, Response, NextFunction } from 'express';

// Database connection configuration
export const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 20, // Maximum number of clients in the pool
  min: 2,  // Minimum number of clients in the pool
};

// Database connection pool
let dbPool: Pool | null = null;

export const initializeDatabase = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  dbPool = new Pool(dbConfig);
  
  // Handle pool errors
  dbPool.on('error', (err) => {
    console.error('Database pool error:', err);
  });

  console.log('Database pool initialized');
  return dbPool;
};

export const getDbPool = (): Pool => {
  if (!dbPool) {
    throw new Error('Database pool not initialized');
  }
  return dbPool;
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (!dbPool) return false;
    
    const client = await dbPool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Database middleware for request context
export const databaseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add database pool to request context
  (req as any).db = dbPool;
  next();
};

// Connection monitoring
export const monitorDatabaseConnections = () => {
  if (!dbPool) return;

  setInterval(() => {
    console.log('Database pool status:', {
      totalCount: dbPool.totalCount,
      idleCount: dbPool.idleCount,
      waitingCount: dbPool.waitingCount,
    });
  }, 60000); // Log every minute
};

// Graceful shutdown
export const closeDatabasePool = async () => {
  if (dbPool) {
    await dbPool.end();
    console.log('Database pool closed');
  }
};