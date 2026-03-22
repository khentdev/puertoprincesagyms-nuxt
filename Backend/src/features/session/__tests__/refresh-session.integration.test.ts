import { describe, it, expect, beforeEach, afterAll, afterEach } from "vitest"
import { prisma } from "../../../infra/prisma.js"
import { getRedisClient } from "../../../configs/redis.js"
import { refreshSessionService, logoutService } from "../service.js"
import { generateSessionTokens } from "../../../lib/tokens.js"
import { hashData } from "../../../lib/hash.js"
import { getCacheKey } from "../utils/redis-cache-keys.js"
import type { SessionCachePayload } from "../types.js"
import bcrypt from "bcrypt"

const TEST_USER = {
    username: "refresh_session_test_user",
    email: "refresh_session_test@example.com",
    password: "Test@password123",
}

const TEST_DEVICE_ID = JSON.stringify({
    userAgent: "vitest_browser",
    platform: "vitest_platform",
})

const createTestUser = async () => {
    const hashedPassword = await bcrypt.hash(TEST_USER.password, 10)
    return prisma.user.create({
        data: {
            email: TEST_USER.email,
            hashedPassword,
            emailVerified: true,
            emailVerifiedAt: new Date(),
        },
    })
}

const createTestSession = async (userId: string) => {
    const { refreshToken, refreshTokenExpiry } = await generateSessionTokens({
        userId,
        deviceId: TEST_DEVICE_ID,
    })
    await prisma.session.create({
        data: {
            userId,
            token: hashData(refreshToken),
            expiresAt: new Date(refreshTokenExpiry * 1000),
        },
    })
    return refreshToken
}

const cleanupRedisKeys = async (patterns: string[]) => {
    const redis = getRedisClient()
    for (const pattern of patterns) {
        const keys = await redis.keys(pattern)
        if (keys.length > 0) await redis.del(...keys)
    }
}

const cleanupTestUser = async () => {
    const user = await prisma.user.findUnique({ where: { email: TEST_USER.email } })
    if (!user) return
    await prisma.tokenCleanupQueue.deleteMany({ where: { userId: user.id } })
    await prisma.session.deleteMany({ where: { userId: user.id } })
    await prisma.user.delete({ where: { id: user.id } })
    await cleanupRedisKeys(["*session*", "*lock*"])
}

describe("refreshSessionService", () => {
    const redis = getRedisClient()

    beforeEach(async () => {
        await cleanupTestUser()
    })

    afterEach(async () => {
        await cleanupTestUser()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    describe("Normal refresh flow", () => {
        it("should return accessToken, refreshToken, csrfToken, and user", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)

            const result = await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })

            expect(result).toHaveProperty("accessToken")
            expect(result).toHaveProperty("refreshToken")
            expect(result).toHaveProperty("csrfToken")
            expect(result).toHaveProperty("user")
            expect(result.user.id).toBe(user.id)
        })

        it("should write dual-key cache after successful rotation", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)

            const result = await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })

            const oldCacheKey = getCacheKey.sessionToken(hashData(refreshToken))
            const oldCache = await redis.get(oldCacheKey) as SessionCachePayload | null
            expect(oldCache).not.toBeNull()
            expect(oldCache?.refreshToken).toBe(result.refreshToken)

            const newCacheKey = getCacheKey.sessionToken(hashData(result.refreshToken!))
            const newCache = await redis.get(newCacheKey) as SessionCachePayload | null
            expect(newCache).not.toBeNull()
            expect(newCache?.refreshToken).toBe(result.refreshToken)
        })

        it("should create a new session in DB and queue old token for cleanup", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)
            const oldTokenHashed = hashData(refreshToken)

            await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })

            const cleanupEntry = await prisma.tokenCleanupQueue.findFirst({
                where: { userId: user.id, hashedToken: oldTokenHashed },
            })
            expect(cleanupEntry).not.toBeNull()

            const sessions = await prisma.session.findMany({
                where: { userId: user.id },
            })
            expect(sessions.length).toBeGreaterThanOrEqual(1)
        })

        it("should generate unique csrfToken on every call", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)

            const result1 = await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })
            const result2 = await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: result1.refreshToken!,
            })

            expect(result1.csrfToken).not.toBe(result2.csrfToken)
        })
    })

    describe("Cache hit paths", () => {
        it("should return cached payload on early cache hit (before lock)", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)

            const result1 = await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })

            const result2 = await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })

            expect(result2.refreshToken).toBe(result1.refreshToken)
            expect(result2.accessToken).toBeDefined()
            expect(result2.csrfToken).toBeDefined()
        })

        it("should return unique accessToken on every cache hit", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)

            const result1 = await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })

            const result2 = await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })
            const result3 = await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })

            expect(result2.refreshToken).toBe(result1.refreshToken)
            expect(result3.refreshToken).toBe(result1.refreshToken)
            expect(result2.accessToken).not.toBe(result3.accessToken)
        })
    })

    describe("Concurrent requests with same old token", () => {
        it("should return same refreshToken for all concurrent requests", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)

            const results = await Promise.all(
                Array.from({ length: 5 }, () =>
                    refreshSessionService({
                        user,
                        deviceId: TEST_DEVICE_ID,
                        oldToken: refreshToken,
                    })
                )
            )

            const uniqueRefreshTokens = new Set(results.map(r => r.refreshToken))
            expect(uniqueRefreshTokens.size).toBe(1)
        })

        it("should return unique accessToken and csrfToken per concurrent request", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)

            const results = await Promise.all(
                Array.from({ length: 5 }, () =>
                    refreshSessionService({
                        user,
                        deviceId: TEST_DEVICE_ID,
                        oldToken: refreshToken,
                    })
                )
            )

            const uniqueAccessTokens = new Set(results.map(r => r.accessToken))
            const uniqueCsrfTokens = new Set(results.map(r => r.csrfToken))
            expect(uniqueAccessTokens.size).toBe(5)
            expect(uniqueCsrfTokens.size).toBe(5)
        })

        it("should only create 1 cleanup queue entry for concurrent requests", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)
            const oldTokenHashed = hashData(refreshToken)

            await Promise.all(
                Array.from({ length: 5 }, () =>
                    refreshSessionService({
                        user,
                        deviceId: TEST_DEVICE_ID,
                        oldToken: refreshToken,
                    })
                )
            )

            const cleanupQueue = await prisma.tokenCleanupQueue.findMany({
                where: { userId: user.id, hashedToken: oldTokenHashed },
            })

            expect(cleanupQueue.length).toBe(1)
        })

        it("should write both old and new cache keys after concurrent rotation", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)

            const results = await Promise.all(
                Array.from({ length: 5 }, () =>
                    refreshSessionService({
                        user,
                        deviceId: TEST_DEVICE_ID,
                        oldToken: refreshToken,
                    })
                )
            )

            const newRefreshToken = results[0]!.refreshToken!
            const oldCacheKey = getCacheKey.sessionToken(hashData(refreshToken))
            const newCacheKey = getCacheKey.sessionToken(hashData(newRefreshToken))

            const oldCache = await redis.get(oldCacheKey) as SessionCachePayload | null
            const newCache = await redis.get(newCacheKey) as SessionCachePayload | null

            expect(oldCache).not.toBeNull()
            expect(newCache).not.toBeNull()
            expect(oldCache?.refreshToken).toBe(newRefreshToken)
            expect(newCache?.refreshToken).toBe(newRefreshToken)
        })
    })

    describe("logoutService", () => {
        it("should delete cache and session from DB on logout", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)

            await refreshSessionService({
                user,
                deviceId: TEST_DEVICE_ID,
                oldToken: refreshToken,
            })

            await logoutService({ user, oldToken: refreshToken })

            const oldCacheKey = getCacheKey.sessionToken(hashData(refreshToken))
            const cache = await redis.get(oldCacheKey)
            expect(cache).toBeNull()

            const session = await prisma.session.findFirst({
                where: { userId: user.id, token: hashData(refreshToken) },
            })
            expect(session).toBeNull()
        })

        it("should force release lock key on logout", async () => {
            const user = await createTestUser()
            const refreshToken = await createTestSession(user.id)
            const lockKey = getCacheKey.requestLock(hashData(refreshToken))

            await logoutService({ user, oldToken: refreshToken })

            const lock = await redis.get(lockKey)
            expect(lock).toBeNull()
        })
    })
})