import { randomUUID } from "node:crypto";
import { getRedisClient } from "../../configs/redis.js";
import { AppError } from "../../errors/appError.js";
import { prisma } from "../../infra/prisma.js";
import { hashData } from "../../lib/hash.js";
import logger from "../../lib/logger.js";
import { generateAccessToken, generateSessionTokens } from "../../lib/tokens.js";
import type { LogoutParamsService, RefreshSessionParams, SessionCachePayload } from "./types.js";
import { acquireLockOrThrow } from "./utils/redis-acquire-lock.js";
import { getCacheKey } from "./utils/redis-cache-keys.js";
import { releaseLock } from "./utils/redis-release-lock.js";
import { cacheScript } from "./utils/redis-scripts.js";


export const refreshSessionService = async ({ user, deviceId, oldToken }: RefreshSessionParams) => {
    const redis = getRedisClient()

    const oldTokenHashed = hashData(oldToken)
    const oldTokenCacheKey = getCacheKey.sessionToken(oldTokenHashed)
    const requestLockKey = getCacheKey.requestLock(oldTokenHashed)

    const cached = await redis.get<SessionCachePayload>(oldTokenCacheKey)
    if (cached) {
        logger.debug({ userId: user.id, source: 'early_cache_hit' }, 'Refresh session: early cache hit')
        const accessToken = await generateAccessToken({ userId: user.id, deviceId })
        return { ...cached, accessToken, csrfToken: randomUUID() }
    }

    const lockResult = await acquireLockOrThrow({ lockKey: requestLockKey, cacheKey: oldTokenCacheKey, expirySeconds: 15 })
    if (lockResult.type === "cache") {
        const cachePayload = lockResult.cachePayload as SessionCachePayload
        logger.debug({ userId: user.id, source: 'retry_cache_hit' }, 'Refresh session: cache hit during retry')
        const accessToken = await generateAccessToken({ userId: user.id, deviceId })
        return { ...cachePayload, accessToken, csrfToken: randomUUID() }
    }

    try {
        logger.debug({ userId: user.id }, 'Refresh session: lock acquired, generating new token')

        const finalCacheCheck = await redis.get<SessionCachePayload>(oldTokenCacheKey)
        if (finalCacheCheck) {
            logger.debug({ userId: user.id, source: 'final_cache_hit' }, 'Refresh session: final cache check hit')
            const accessToken = await generateAccessToken({ userId: user.id, deviceId })
            return { ...finalCacheCheck, accessToken, csrfToken: randomUUID() }
        }

        const { accessToken, refreshToken: newRefreshToken, refreshTokenExpiry, csrfToken } = await generateSessionTokens({ userId: user.id, deviceId })
        const newRefreshTokenHashed = hashData(newRefreshToken)

        await prisma.$transaction(async (tx) => {
            await tx.session.create({
                data: {
                    userId: user.id,
                    token: newRefreshTokenHashed,
                    expiresAt: new Date(refreshTokenExpiry * 1000),
                }
            });
            await tx.tokenCleanupQueue.create({
                data: {
                    userId: user.id,
                    hashedToken: oldTokenHashed,
                }
            })
        });
        logger.debug({ userId: user.id }, 'Refresh session: new token stored in DB')

        const newTokenCacheKey = getCacheKey.sessionToken(newRefreshTokenHashed)
        const cachePayload: SessionCachePayload = {
            user,
            refreshToken: newRefreshToken
        }
        try {
            await redis.eval(cacheScript(), [oldTokenCacheKey, newTokenCacheKey], [30, 1200, JSON.stringify(cachePayload)])
            logger.debug({ userId: user.id, oldKeyTTL: 30, newKeyTTL: 1200 }, 'Refresh session: dual-key cache written')
        } catch (err) {
            logger.error({ error: err, userId: user.id }, "Failed to cache new session token")
        }

        return { user, accessToken, refreshToken: newRefreshToken, csrfToken }
    } catch (err) {
        logger.error({ error: err, userId: user.id }, "Failed to refresh session")
        throw new AppError("SESSION_REFRESH_FAILED", { field: "session_refresh" })
    } finally {
        await releaseLock({ lockKey: requestLockKey, lockValue: lockResult.lockValue })
    }
}

export const logoutService = async ({ user, oldToken }: LogoutParamsService) => {
    const redis = getRedisClient()
    const oldTokenHashed = hashData(oldToken)
    const oldTokenCacheKey = getCacheKey.sessionToken(oldTokenHashed)
    const requestLockKey = getCacheKey.requestLock(oldTokenHashed)
    try {
        await redis.del(oldTokenCacheKey)
        await redis.del(requestLockKey)
        await prisma.session.deleteMany({
            where: {
                userId: user.id,
                token: oldTokenHashed
            }
        })
    } catch (err) {
        console.error(err)
        logger.error({ error: err, userId: user.id }, "Failed to logout")
        throw new AppError("SESSION_LOGOUT_FAILED", { field: "session_logout" })
    }

}