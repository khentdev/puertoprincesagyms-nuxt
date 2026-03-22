
import { Hono } from "hono";
import sessionRoutes from "../features/session/route.js";
/**
 * e.g import authRoutes from "../auth/routes.js"
 */
export function registerAppRoutes(app: Hono) {
    app.get("/", (c) => c.redirect("/health-check"))
    app.get("/health-check", (c) => c.json({ status: "Server status is good." }, 200))
    app.route("/", sessionRoutes)

    // /**
    //  * e.g. app.route("/",authRoutes)
    //  */
}

    