/**
 * Redis/Valkey client for caching, rate limiting, and session management
 */
import Redis from 'ioredis'

let redis: Redis | null = null

/**
 * Get Redis client instance (lazy initialization)
 * Returns null if REDIS_URL is not configured
 */
export function getRedisClient(): Redis | null {
  if (redis) return redis

  const redisUrl = process.env.REDIS_URL

  if (!redisUrl) {
    console.warn('[Redis] REDIS_URL not configured - rate limiting and caching disabled')
    return null
  }

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy(times) {
        const delay = Math.min(times * 100, 3000)
        return delay
      },
    })

    redis.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message)
    })

    redis.on('connect', () => {
      console.log('[Redis] Connected successfully')
    })

    return redis
  } catch (error) {
    console.error('[Redis] Failed to create client:', error)
    return null
  }
}

/**
 * Check if Redis is available and connected
 */
export async function isRedisAvailable(): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.ping()
    return true
  } catch {
    return false
  }
}

/**
 * Close Redis connection gracefully
 */
export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    await redis.quit()
    redis = null
  }
}

export { redis }
