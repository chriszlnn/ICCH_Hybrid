import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Add connection pool parameters to the DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
const connectionUrl = databaseUrl ? `${databaseUrl}?connection_limit=20&pool_timeout=30&statement_timeout=30000&idle_in_transaction_session_timeout=30000&application_name=icch_app` : databaseUrl;

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
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

interface ErrorWithCause extends Error {
  cause?: {
    code?: number;
  };
}

// Helper function to check if an error is a connection error
const isConnectionError = (error: Error | Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError | Prisma.PrismaClientInitializationError): boolean => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2024 is the error code for connection pool timeout
    return error.code === 'P2024';
  }
  
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  
  // Check for network-related errors
  const errorWithCause = error as ErrorWithCause;
  if (errorWithCause.cause && typeof errorWithCause.cause === 'object') {
    const cause = errorWithCause.cause as { code?: number };
    // Add more error codes for connection issues
    return cause.code === 10054 || // Connection reset
           cause.code === 10053 || // Connection aborted
           cause.code === 10060 || // Connection timed out
           cause.code === 10061;   // Connection refused
  }
  
  return false;
};

// Helper function to retry operations with exponential backoff
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  initialDelay: number = INITIAL_RETRY_DELAY
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error('Database operation failed:', error);
      
      // Check if it's a connection error that we should retry
      if (!isConnectionError(error as Error)) {
        throw error;
      }
      
      // If we've reached the maximum number of retries, throw the error
      if (attempt === maxRetries) {
        console.error(`Failed after ${maxRetries} attempts. Giving up.`);
        throw error;
      }
      
      // Calculate delay with exponential backoff and some jitter
      const delay = initialDelay * Math.pow(2, attempt - 1) * (0.5 + Math.random() * 0.5);
      console.log(`Retrying operation after ${Math.round(delay)}ms (attempt ${attempt}/${maxRetries})`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw lastError;
};

// Helper function to execute database operations with retry logic
export const withDbConnection = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> => {
  return withRetry(async () => {
    try {
      return await operation();
    } catch (error) {
      console.error('Database operation failed:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma error code:', error.code);
        console.error('Prisma error message:', error.message);
      }
      
      // If it's a connection error, try to reconnect
      if (isConnectionError(error as Error)) {
        try {
          await prisma.$disconnect();
          await prisma.$connect();
        } catch (reconnectError) {
          console.error('Failed to reconnect to database:', reconnectError);
        }
      }
      
      throw error;
    }
  }, maxRetries);
};

// Helper function to execute transactions with retry logic
export const withTransaction = async <T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> => {
  return withRetry(async () => {
    return prisma.$transaction(async (tx) => {
      return operation(tx);
    });
  }, maxRetries);
};

export { prisma }; 