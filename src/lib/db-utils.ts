import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Add connection pool parameters to the DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
const connectionUrl = databaseUrl ? `${databaseUrl}?connection_limit=10&pool_timeout=30&statement_timeout=30000&idle_in_transaction_session_timeout=30000` : databaseUrl;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: connectionUrl
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface ErrorWithCause extends Error {
  cause?: {
    code?: number;
  };
}

const isConnectionError = (error: Error | Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError | Prisma.PrismaClientInitializationError): boolean => {
  const errorWithCause = error as ErrorWithCause;
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    (errorWithCause?.cause?.code === 10054) || // Connection reset error
    error?.message?.includes('connection') ||
    error?.message?.includes('timeout')
  );
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  initialDelay: number = INITIAL_RETRY_DELAY
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (!isConnectionError(error as Error) || attempt === maxRetries - 1) {
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`Retrying operation after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export const withDbConnection = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> => {
  return withRetry(async () => {
    try {
      return await operation();
    } catch (error) {
      console.error('Database operation failed:', error);
      throw error;
    }
  }, maxRetries);
};

export { prisma }; 