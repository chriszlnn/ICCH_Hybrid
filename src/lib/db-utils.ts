import { prisma } from "@/lib/prisma";

/**
 * Executes a database operation with proper connection management
 * This helps prevent connection pool timeouts by ensuring connections are properly released
 * 
 * @param operation The database operation to execute
 * @returns The result of the operation
 */
export async function withDbConnection<T>(operation: () => Promise<T>): Promise<T> {
  try {
    // Execute the operation
    return await operation();
  } catch (error) {
    // Log the error for debugging
    console.error("Database operation error:", error);
    throw error;
  } finally {
    // Ensure the connection is properly released
    // This is a no-op in Prisma, but it's good practice to include it
    // in case we switch to a different ORM in the future
    await prisma.$disconnect();
  }
}

/**
 * Executes a database operation with retry logic for connection pool timeouts
 * 
 * @param operation The database operation to execute
 * @param maxRetries Maximum number of retries (default: 3)
 * @param retryDelay Delay between retries in milliseconds (default: 1000)
 * @returns The result of the operation
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  retryDelay = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await withDbConnection(operation);
    } catch (error) {
      lastError = error;
      
      // Check if this is a connection pool timeout error
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isConnectionPoolError = errorMessage.includes("connection pool") || 
                                   errorMessage.includes("Timed out fetching a new connection");
      
      if (isConnectionPoolError && attempt < maxRetries) {
        console.log(`Connection pool error, retrying (${attempt}/${maxRetries})...`);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // If it's not a connection pool error or we've exhausted retries, throw the error
      throw error;
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw lastError;
} 