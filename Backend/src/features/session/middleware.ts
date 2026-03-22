import type { Context, Next } from "hono"
import { AppError } from "../../errors/appError.js"
import { prisma } from "../../infra/prisma.js"
import { getNormalCookie, getRefreshTokenCookie } from "../../lib/cookies.js"
import { compareHashes, hashData } from "../../lib/hash.js"
import logger from "../../lib/logger.js"
import { verifyTokenOrThrow } from "../../lib/tokens.js"
import { isValidDeviceFingerprint } from "../../lib/validation.js"
import type { LogoutParamsController, SessionPayloadParams } from "./types.js"

export const validateSession = async (c: Context, next: Next) => {
    const sessionCookie = await getRefreshTokenCookie(c)
    const csrfTokenFromCookie = getNormalCookie(c, "csrfToken")
    const csrfTokenFromHeader = c.req.header("X-CSRF-Token")
    const fingerprint = c.req.header("X-Fingerprint")

    const Unauthorized = (reason: string, field: string): AppError => {
        logger.warn({ reason }, "Session Validation Failed.")
        return new AppError("SESSION_UNAUTHORIZED", { field })
    };

    if (!csrfTokenFromCookie || !csrfTokenFromHeader || !sessionCookie || csrfTokenFromCookie !== csrfTokenFromHeader)
        throw Unauthorized("CSRF or session cookie validation failed", "session_csrf")

    if (!isValidDeviceFingerprint(fingerprint))
        throw Unauthorized("Invalid fingerprint format", "device_fingerprint")

    const payload = await verifyTokenOrThrow(sessionCookie)
    console.debug("Fingerprint compareHashes", { fingerprint, payloadDeviceId: payload.deviceId })
    if (!compareHashes(fingerprint!, payload.deviceId))
        throw Unauthorized("Fingerprint mismatch", "device_fingerprint")

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) throw Unauthorized("User not found for valid token", "user")

    const tokenExists = await prisma.session.findUnique({ where: { userId_token: { token: hashData(sessionCookie), userId: user.id } } })
    if (!tokenExists) throw Unauthorized("Invalid session token", "session_token")

    const sessionPayload: SessionPayloadParams = {
        user,
        deviceId: hashData(fingerprint as string),
        oldToken: sessionCookie
    }
    c.set("sessionPayload", sessionPayload)
    await next()
}

export const validateLogoutSession = async (c: Context, next: Next) => {
    const sessionCookie = await getRefreshTokenCookie(c)
    const csrfTokenFromCookie = getNormalCookie(c, "csrfToken")
    const csrfTokenFromHeader = c.req.header("X-CSRF-Token")
    const fingerprint = c.req.header("X-Fingerprint")

    const Unauthorized = (reason: string, field: string): AppError => {
        logger.warn({ reason }, "Session Validation Failed.")
        return new AppError("SESSION_UNAUTHORIZED", { field })
    };

    if (!csrfTokenFromCookie || !csrfTokenFromHeader || !sessionCookie || csrfTokenFromCookie !== csrfTokenFromHeader)
        throw Unauthorized("CSRF or session cookie validation failed", "session_csrf")

    if (!isValidDeviceFingerprint(fingerprint))
        throw Unauthorized("Invalid fingerprint format", "device_fingerprint")

    const payload = await verifyTokenOrThrow(sessionCookie)

    if (!compareHashes(fingerprint!, payload.deviceId))
        throw Unauthorized("Fingerprint mismatch", "device_fingerprint")

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) throw Unauthorized("User not found for valid token", "user")

    const tokenExists = await prisma.session.findUnique({ where: { userId_token: { token: hashData(sessionCookie), userId: user.id } } })
    if (!tokenExists) throw Unauthorized("Invalid session token", "session_token")

    const sessionPayload: LogoutParamsController = {
        user,
        oldToken: sessionCookie
    }
    c.set("logoutPayload", sessionPayload)
    await next()
}