import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedis() {
  const client = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    // Fail fast instead of queueing: when Redis is down, commands reject
    // immediately and callers fall back to the database, rather than every
    // request waiting through reconnect retries.
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
    commandTimeout: 1000,
    retryStrategy: (times) => Math.min(times * 1000, 30_000),
  });

  // Without a listener ioredis logs every failed reconnect as an unhandled
  // error. Log once per outage instead.
  let reported = false;
  client.on("error", (err) => {
    if (reported) return;
    reported = true;
    console.warn(`[redis] unavailable, serving uncached: ${err.message}`);
  });
  client.on("ready", () => {
    reported = false;
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedis();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
