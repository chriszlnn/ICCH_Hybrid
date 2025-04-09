import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0 && isConnectionError(error)) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return withRetry(operation, retries - 1)
    }
    throw error
  }
}

function isConnectionError(error: unknown): boolean {
  if (error instanceof PrismaClientKnownRequestError) {
    return (
      error.code === 'P2024' || // Connection pool timeout
      error.code === 'P1001' || // Can't reach database server
      error.code === 'P1002' || // Connection timed out
      error.code === 'P1017' // Server closed the connection
    )
  }
  
  const errorMessage = error instanceof Error ? error.message : String(error)
  return errorMessage.includes('connection') || errorMessage.includes('timeout')
}

// Example usage:
// const result = await withRetry(() => prisma.user.findMany()) 