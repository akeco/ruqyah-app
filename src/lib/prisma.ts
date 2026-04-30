import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

type GlobalForPrisma = {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Create a connection pool
const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
});

// Create the Prisma 7 adapter
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as GlobalForPrisma;

export const prisma =
  globalForPrisma.prisma ||
  (globalForPrisma.prisma = new PrismaClient({
    adapter,
  }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
