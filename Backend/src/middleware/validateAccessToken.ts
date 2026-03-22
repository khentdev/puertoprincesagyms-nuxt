import type { Context, Next } from "hono";
import type { User } from "../../generated/prisma/client.js";
import { AppError } from "../errors/appError.js";
import { prisma } from "../infra/prisma.js";
import { verifyTokenOrThrow as verifyToken } from "../lib/tokens.js";

export type VerifyTokenVariables = { verifyTokenVariables: { user: User } }
async function validateAccessToken(c: Context, next: Next) {
    const header = c.req.header("Authorization")
    const token = header?.startsWith("Bearer ") ? header?.split(" ")[1] : undefined
    if (!token) throw new AppError("TOKEN_INVALID", { field: "access_token" })

    const payload = await verifyToken(token)
    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId
        }
    })
    if (!user) throw new AppError("USER_NOT_FOUND", { field: "access_token" })
    c.set("verifyTokenVariables", { user })
    await next()
}
export default validateAccessToken
