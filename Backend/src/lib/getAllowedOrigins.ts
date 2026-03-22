import loadEnvVar from "../configs/loadEnv.js";


export const getAllowedOrigins = (): string[] => {
    const isDev = loadEnvVar("NODE_ENV", "development") === "development";

    if (isDev) {
        return [
            "http://localhost:5173",
            "http://localhost:4173",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:4173",
        ];
    }

    const frontendUrl = loadEnvVar("FRONTEND_PROD_URL");
    return [frontendUrl];
};
