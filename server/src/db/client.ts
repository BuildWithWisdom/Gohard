import 'dotenv/config';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

// Use the `ws` WebSocket implementation so Neon connection failures
// surface real error messages instead of blank DOM ErrorEvents.
neonConfig.webSocketConstructor = ws;
// Route pooled queries over HTTPS fetch instead of WebSockets: on networks
// with broken IPv6, the `ws` stack picks the dead IPv6 address and hangs,
// while fetch (with ipv4first DNS order) connects reliably over IPv4.
neonConfig.poolQueryViaFetch = true;

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({ adapter });

// Neon free-tier projects sleep after ~5 min idle. The first query that
// wakes the project often fails with a blank ErrorEvent, then the next one
// succeeds. So transient connection failures are retried, not fatal.
export function isTransientDbError(err: unknown): boolean {
  const name = (err as any)?.constructor?.name;
  if (name === 'ErrorEvent') return true;
  const code = (err as any)?.code as string | undefined;
  return code === 'P1001' || code === 'P1002' || code === 'P1017';
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function withDbRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isTransientDbError(err) || i === attempts) throw err;
      // Cold-start wake-up: wait progressively longer (2s, 4s) and retry.
      await sleep(i * 2000);
    }
  }
  throw lastErr;
}

// Fire-and-forget at server boot so the first real request isn't the cold one.
export async function warmDatabaseConnection(): Promise<void> {
  try {
    await withDbRetry(() => prisma.$queryRaw`SELECT 1`, 2);
    console.log('[DB] Warmup OK — Neon connection ready.');
  } catch (err) {
    console.warn('[DB] Warmup failed (will retry on first request):', (err as any)?.constructor?.name);
  }
}
