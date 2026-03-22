import type { Context } from "hono";
import type { LogoutPayloadVariables, SessionPayloadVariables } from "./types.js";
import { logoutService, refreshSessionService } from "./service.js";
import { deleteAuthCookie, setNormalCookie, setRefreshTokenCookie } from "../../lib/cookies.js";
import { tokenExpiry } from "../../lib/tokens.js";

export const refreshSessionController = async (c: Context<{ Variables: SessionPayloadVariables }>) => {
    const { user, deviceId, oldToken } = c.get("sessionPayload")
    const { accessToken, refreshToken, csrfToken, user: userData } = await refreshSessionService({ user, deviceId, oldToken })
    await setRefreshTokenCookie({ c, token: refreshToken, maxAge: tokenExpiry().refreshTokenMaxAge })
    setNormalCookie(c, "csrfToken", csrfToken, tokenExpiry().csrfTokenMaxAge)
    return c.json({ accessToken, user: { email: userData.email } })
}

export const logoutController = async (c: Context<{ Variables: LogoutPayloadVariables }>) => {
    const { user, oldToken } = c.get("logoutPayload")
    await logoutService({ user, oldToken })
    deleteAuthCookie(c, "sid")
    deleteAuthCookie(c, "csrfToken")
    return c.body(null, 204)
}