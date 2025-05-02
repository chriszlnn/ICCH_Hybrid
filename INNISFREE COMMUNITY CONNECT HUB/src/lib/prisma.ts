import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Ensure connection is established
if (process.env.NODE_ENV !== 'production') {
  // Test the connection
  prisma.$queryRaw`SELECT 1`
    .then(() => console.log('Database connection established'))
    .catch(err => console.error('Database connection failed:', err));
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
