import type { ErrorDefinitions } from "../../errors/index.js";

export const AUTH_ERROR_CODES = {
    TOKEN_INVALID: "TOKEN_INVALID",
    TOKEN_EXPIRED: "TOKEN_EXPIRED",
    USER_NOT_FOUND: "USER_NOT_FOUND",
} as const

export const AUTH_ERROR_DEF: Record<AuthErrorCodes, ErrorDefinitions> = {
    TOKEN_INVALID: {
        code: "TOKEN_INVALID",
        message: "Invalid token",
        status: 401,
    },
    TOKEN_EXPIRED: {
        code: "TOKEN_EXPIRED",
        message: "Token expired",
        status: 401,
    },
    USER_NOT_FOUND: {
        code: "USER_NOT_FOUND",
        message: "User not found",
        status: 404,
    },
} as const

export type AuthErrorCodes = keyof typeof AUTH_ERROR_CODES