import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Add connection pool parameters to the DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
const connectionUrl = databaseUrl ? `${databaseUrl}?connection_limit=50&pool_timeout=60&statement_timeout=60000&idle_in_transaction_session_timeout=60000` : databaseUrl;

// Create a single PrismaClient instance with optimized settings
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: connectionUrl
    }
  }
});

// Ensure we only create one instance in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const MAX_RETRIES = 5;
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
    error?.message?.includes('timeout') ||
    error?.message?.includes('pool') ||
    error?.message?.includes('connection pool')
  );
};

// Improved retry mechanism with exponential backoff
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
      
      // If it's not a connection error or this is the last attempt, throw the error
      if (!isConnectionError(error as Error) || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const baseDelay = initialDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
      const delay = baseDelay + jitter;
      
      console.log(`Retrying operation after ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Wrapper for database operations with retry logic
export const withDbConnection = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> => {
  return withRetry(async () => {
    try {
      return await operation();
    } catch (error) {
      console.error('Database operation failed:', error);
      
      // Add more context to the error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(`Prisma error code: ${error.code}`);
        console.error(`Prisma error message: ${error.message}`);
      }
      
      throw error;
    }
  }, maxRetries);
};

// Helper function to execute a transaction with retry logic
export const withTransaction = async <T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> => {
  return withDbConnection(async () => {
    return prisma.$transaction(operation);
  }, maxRetries);
};

export { prisma }; 