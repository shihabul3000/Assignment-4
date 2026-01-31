import { PrismaClient } from '@prisma/client';

// Sanitize DATABASE_URL to remove quotes if present
const databaseUrl = process.env.DATABASE_URL?.replace(/^["']|["']$/g, '');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});

export default prisma;
