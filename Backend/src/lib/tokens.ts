import { env } from "../configs/env.js";
import loadEnv from "../configs/loadEnv.js";
import { sign, verify } from "hono/jwt"
import {
    JwtAlgorithmNotImplemented, JwtTokenExpired, JwtTokenInvalid, JwtTokenIssuedAt,
    JwtTokenNotBefore, JwtTokenSignatureMismatched
} from 'hono/utils/jwt/types';
import { randomUUID } from 'node:crypto';
import { AppError } from "../errors/appError.js";
import { FEATURE_ERROR_CODES } from "../errors/index.js";
import { SESSION_ERROR_CODES, type SessionErrorCode } from "../features/session/errors.js";
import type { JwtErrorConstructor, TokenPayload, TokenPayloadNoIss } from "../features/session/types.js";

export function tokenExpiry() {
    const now = Math.floor(Date.now() / 1000);

    const accessTokenDuration = parseInt(loadEnv("JWT_ACCESS_TOKEN_EXPIRES_IN", "3600"), 10);
    const refreshTokenDuration = parseInt(loadEnv("JWT_REFRESH_TOKEN_EXPIRES_IN", "2592000"), 10);

    return {
        accessTokenExpiry: now + accessTokenDuration,
        refreshTokenExpiry: now + refreshTokenDuration,
        refreshTokenMaxAge: refreshTokenDuration,
        csrfTokenMaxAge: refreshTokenDuration,
    }
}

export async function generateAccessToken(payload: TokenPayloadNoIss) {
    const { accessTokenExpiry } = tokenExpiry()
    const now = Math.floor(Date.now() / 1000)
    return sign({
        ...payload,
        iat: now,
        exp: accessTokenExpiry,
        iss: env.JWT_ISSUER,
        nonce: randomUUID().slice(0, 8)
    }, env.JWT_SECRET, "HS512")
}

export async function generateRefreshToken(payload: TokenPayloadNoIss) {
    const { refreshTokenExpiry } = tokenExpiry()
    const now = Math.floor(Date.now() / 1000)
    return sign({
        ...payload,
        iat: now,
        exp: refreshTokenExpiry,
        iss: env.JWT_ISSUER,
        nonce: randomUUID().slice(0, 8)
    }, env.JWT_SECRET, "HS512")
}

export async function generateSessionTokens(payload: TokenPayloadNoIss) {
    const { refreshTokenExpiry } = tokenExpiry()
    const accessToken = await generateAccessToken(payload)
    const refreshToken = await generateRefreshToken(payload)
    const csrfToken = randomUUID()
    return { accessToken, refreshToken, csrfToken, refreshTokenExpiry }
}

export async function verifyTokenOrThrow(token: string) {
    try {
        const payload = await verify(token, env.JWT_SECRET, 'HS512') as TokenPayload;
        if (payload.iss !== env.JWT_ISSUER) throw new AppError(FEATURE_ERROR_CODES.TOKEN_INVALID);
        return payload
    } catch (err) {
        if (err instanceof Error) throw mapTokenError(err);
        throw new AppError(FEATURE_ERROR_CODES.TOKEN_INVALID);
    }
};

const errMap = new Map<JwtErrorConstructor, SessionErrorCode>([
    [JwtAlgorithmNotImplemented, SESSION_ERROR_CODES.TOKEN_INVALID],
    [JwtTokenInvalid, SESSION_ERROR_CODES.TOKEN_INVALID],
    [JwtTokenSignatureMismatched, SESSION_ERROR_CODES.TOKEN_INVALID],
    [JwtTokenNotBefore, SESSION_ERROR_CODES.TOKEN_INVALID],
    [JwtTokenIssuedAt, SESSION_ERROR_CODES.TOKEN_INVALID],
    [JwtTokenExpired, SESSION_ERROR_CODES.TOKEN_EXPIRED],
]);

const mapTokenError = (err: Error) => {
    const code = errMap.get(err.constructor as JwtErrorConstructor);
    if (code) return new AppError(code);
    return new AppError(FEATURE_ERROR_CODES.TOKEN_INVALID);
};
