import { randomUUID } from "crypto"
import { setTimeout as sleep } from "timers/promises"
import { getRedisClient } from "../../../configs/redis.js"
import { AppError } from "../../../errors/appError.js"
import logger from "../../../lib/logger.js"
import type { SessionCachePayload } from "../types.js"

type AcquireLockParams = {
    lockKey: string
    cacheKey: string
    expirySeconds: number
}
type LockResult = {
    type: "cache"
    cachePayload: SessionCachePayload
} | {
    type: "lock"
    lockValue: string
}
export const acquireLockOrThrow = async ({ lockKey, cacheKey, expirySeconds }: AcquireLockParams): Promise<LockResult> => {
    const redis = getRedisClient()
    const lockValue = randomUUID()
    const MAX_RETRIES = 3
    const INITIAL_DELAY_MS = 50
    const MAX_DELAY_MS = 400
    const BACKOFF_MULTIPLIER = 2


    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const cached = await redis.get<SessionCachePayload>(cacheKey)
        if (cached) {
            logger.debug({ attempt, cacheKey }, 'Lock acquisition: cache hit on retry')
            return { type: "cache", cachePayload: cached }
        }

        const lockAcquired = await redis.set(lockKey, lockValue, { nx: true, ex: expirySeconds })
        if (lockAcquired === "OK") {
            logger.debug({ lockKey, attempt }, 'Lock acquisition: lock acquired')
            return { type: "lock", lockValue }
        }

        const recheckCache = await redis.get<SessionCachePayload>(cacheKey)
        if (recheckCache) {
            logger.debug({ attempt, cacheKey }, 'Lock acquisition: cache hit after failed lock')
            return { type: "cache", cachePayload: recheckCache }
        }

        const base = Math.min(INITIAL_DELAY_MS * Math.pow(BACKOFF_MULTIPLIER, attempt), MAX_DELAY_MS)
        const jitter = Math.floor(Math.random() * base)
        logger.debug({ attempt, delayMs: base + jitter }, 'Lock acquisition: retrying')
        await sleep(base + jitter)
    }

    const finalCacheCheck = await redis.get<SessionCachePayload>(cacheKey)
    if (finalCacheCheck) {
        logger.debug({ cacheKey }, 'Lock acquisition: final cache check hit')
        return { type: "cache", cachePayload: finalCacheCheck }
    }

    logger.warn({ lockKey, maxRetries: MAX_RETRIES }, 'Lock acquisition: max retries exceeded')
    throw new AppError("SESSION_LOCK_IN_PROGRESS", { field: "session_lock" })
}