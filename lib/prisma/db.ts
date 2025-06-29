import { PrismaClient } from '../generated/prisma'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
        // Remove datasources - this should be handled by your schema.prisma
    })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db
}

// Better shutdown handling
if (process.env.NODE_ENV === 'production') {
    const gracefulShutdown = async () => {
        await db.$disconnect()
        process.exit(0)
    }
    
    process.on('SIGINT', gracefulShutdown)
    process.on('SIGTERM', gracefulShutdown)
    process.on('beforeExit', gracefulShutdown)
}