import { redis } from "@/lib/redis";

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  limit: number;
};

/**
 * Fixed-window rate limiter keyed by an identifier (e.g. IP address).
 * Allows up to `limit` requests per `windowSeconds`, backed by a single
 * Redis INCR + EXPIRE so it stays correct under concurrent requests.
 */
export async function rateLimit(
  identifier: string,
  { limit = 5, windowSeconds = 60 }: { limit?: number; windowSeconds?: number } = {}
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }
    return {
      success: count <= limit,
      remaining: Math.max(0, limit - count),
      limit,
    };
  } catch {
    // If Redis is unreachable, fail open rather than blocking legitimate traffic.
    return { success: true, remaining: limit, limit };
  }
}
