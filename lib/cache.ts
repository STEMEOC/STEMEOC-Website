import { redis } from "@/lib/redis";

const TAG_PREFIX = "tag:";

// In-process layer in front of Redis. It saves a network round trip on hot
// reads and keeps pages fast when Redis is down. Its TTL stays short because
// invalidateTag only clears the memory of the instance that runs it; other
// server instances catch up within MEMORY_TTL_MS.
const MEMORY_TTL_MS = 30_000;
const memory = new Map<string, { value: unknown; expires: number; tags: string[] }>();

/**
 * Reads `key` from memory, then Redis, or computes it with `fn` and caches it
 * for `ttlSeconds`. `tags` are indexed so a whole group of keys can be
 * invalidated together (e.g. every cache entry touched by the "news" content type).
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
  tags: string[] = []
): Promise<T> {
  const hit = memory.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;

  const remember = (value: T) =>
    memory.set(key, {
      value,
      expires: Date.now() + Math.min(MEMORY_TTL_MS, ttlSeconds * 1000),
      tags,
    });

  try {
    const cached = await redis.get(key);
    if (cached) {
      const value = JSON.parse(cached) as T;
      remember(value);
      return value;
    }
  } catch {
    // Redis unavailable — fall through to computing fresh data.
  }

  const value = await fn();
  remember(value);

  try {
    const pipeline = redis.pipeline();
    pipeline.set(key, JSON.stringify(value), "EX", ttlSeconds);
    for (const tag of tags) {
      pipeline.sadd(`${TAG_PREFIX}${tag}`, key);
    }
    await pipeline.exec();
  } catch {
    // Best-effort caching — a write failure shouldn't break the request.
  }

  return value;
}

/** Invalidates every cache key previously tagged with `tag`. */
export async function invalidateTag(tag: string): Promise<void> {
  for (const [key, entry] of memory) {
    if (entry.tags.includes(tag)) memory.delete(key);
  }

  try {
    const setKey = `${TAG_PREFIX}${tag}`;
    const keys = await redis.smembers(setKey);
    if (keys.length > 0) {
      await redis.del(...keys, setKey);
    } else {
      await redis.del(setKey);
    }
  } catch {
    // Best-effort invalidation.
  }
}
