import { redis } from "@/lib/redis";

const TAG_PREFIX = "tag:";

/**
 * Reads `key` from Redis, or computes it with `fn` and caches it for `ttlSeconds`.
 * `tags` are indexed so a whole group of keys can be invalidated together
 * (e.g. every cache entry touched by the "news" content type).
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
  tags: string[] = []
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached) as T;
  } catch {
    // Redis unavailable — fall through to computing fresh data.
  }

  const value = await fn();

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
