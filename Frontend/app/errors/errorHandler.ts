import type { FetchError } from 'ofetch'
import type { ErrorResponse, ErrorReturnType } from './types'

export const handleError = <C extends string = string>(
    err: FetchError<ErrorResponse<C>>
): ErrorReturnType<C> => {
    if (!err.response) {
        return {
            retryable: true,
            logout: false,
            message: 'Network error, please check your connection.',
            type: 'offline',
            error: err,
        }
    }

    const status = err.response.status
    const body = err.response._data?.error

    if (err.name === 'AbortError') {
        return {
            retryable: true,
            logout: false,
            message: 'Request timed out.',
            type: 'timeout',
            error: err,
        }
    }
    if (status === 502 || status === 503 || status === 504) {
        return {
            retryable: true,
            logout: false,
            message: 'Service is temporarily unavailable.',
            type: 'unreachable',
            error: err,
        }
    }

    if (status === 401) {
        return {
            retryable: false,
            logout: true,
            message: body?.message ?? 'Session expired.',
            type: 'server_error',
            code: body?.code,
            error: err,
        }
    }

    return {
        retryable: status >= 500,
        logout: false,
        message: body?.message ?? 'Something went wrong.',
        type: 'server_error',
        code: body?.code,
        field: body?.field,
        data: body?.data,
        error: err,
    }
}