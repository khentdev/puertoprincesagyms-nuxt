import type { ContentfulStatusCode } from "hono/utils/http-status";
import { AUTH_ERROR_CODES, AUTH_ERROR_DEF } from "../features/auth/errors.js";
import { SESSION_ERROR_CODES, SESSION_ERROR_DEF } from "../features/session/errors.js";

export type ErrorDefinitions = {
    code: ErrorCodes,
    status: ContentfulStatusCode,
    message: string,
}

export type AppErrorOptions = {
    cause?: string,
    field?: string,
    data?: Record<string, any>
    messageOverride?: string
}

export const FEATURE_ERROR_CODES = {
    // Spread Error Codes here from features
    ...AUTH_ERROR_CODES,
    ...SESSION_ERROR_CODES,
    SERVER_ERROR: "SERVER_ERROR"
} as const

export const FEATURE_ERROR_DEFINITIONS: Record<ErrorCodes, ErrorDefinitions> = {
    /**
     * e.g. ...AUTH_ERROR_DEF
     */
    ...AUTH_ERROR_DEF,
    ...SESSION_ERROR_DEF,
    SERVER_ERROR: {
        code: "SERVER_ERROR",
        status: 500,
        message: "Server error."
    }
}

export type ErrorCodes = (typeof FEATURE_ERROR_CODES)[keyof typeof FEATURE_ERROR_CODES]