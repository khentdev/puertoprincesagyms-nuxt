import { prisma } from "../infra/prisma.js";
import logger from "../lib/logger.js";
export const startSessionCleanupWorker = () => {
    const CLEANUP_INTERVAL = 5 * 60 * 1000;
    const BATCH_SIZE = 100;
    let stopped = false;
    let interval: NodeJS.Timeout | null = null;
    let timeout: NodeJS.Timeout | null = null;

    const cleanupWorker = async () => {
        if (stopped) return;

        try {
            const now = new Date();

            const queuedSessions = await prisma.tokenCleanupQueue.findMany({
                where: { cleanupAt: { lte: now } },
                take: BATCH_SIZE,
                orderBy: { createdAt: 'asc' }
            });
            const expiredSessions = await prisma.session.findMany({
                where: { expiresAt: { lte: now } },
                take: BATCH_SIZE,
                orderBy: { expiresAt: 'asc' }
            });

            const totalToCleanup = queuedSessions.length + expiredSessions.length;
            if (totalToCleanup === 0) {
                logger.debug("No sessions to cleanup at this time");
                return;
            }

            logger.info({
                queuedSessions: queuedSessions.length,
                expiredSessions: expiredSessions.length,
                total: totalToCleanup
            }, "Starting session cleanup batch");

            if (queuedSessions.length > 0) {
                await prisma.$transaction(async (tx) => {
                    await tx.session.deleteMany({
                        where: {
                            userId: { in: queuedSessions.map(s => s.userId) },
                            token: { in: queuedSessions.map(s => s.hashedToken) }
                        }
                    })
                    await tx.tokenCleanupQueue.deleteMany({
                        where: {
                            id: { in: queuedSessions.map(s => s.id) }
                        }
                    })
                })
                logger.info({ count: queuedSessions.length }, "Queued sessions cleaned up")
            }

            if (expiredSessions.length > 0) {
                await prisma.session.deleteMany({
                    where: {
                        id: { in: expiredSessions.map(s => s.id) }
                    }
                })
                logger.info({ count: expiredSessions.length }, "Expired sessions cleaned up")
            }

            logger.info({
                queuedCount: queuedSessions.length,
                expiredCount: expiredSessions.length,
                total: totalToCleanup
            }, "Session cleanup batch completed")

        } catch (err) {
            logger.error({ error: err }, "Session cleanup worker failed")
        }
    }

    const start = () => {
        stopped = false;
        const initialDelay = Math.floor(Math.random() * 5000);
        interval = setInterval(cleanupWorker, CLEANUP_INTERVAL);
        timeout = setTimeout(cleanupWorker, initialDelay);

        logger.info({
            interval: CLEANUP_INTERVAL,
            batchSize: BATCH_SIZE
        }, "Session cleanup worker started");
    };
    const stop = () => {
        stopped = true;
        if (interval) clearInterval(interval);
        if (timeout) clearTimeout(timeout);
        logger.info("Session cleanup worker stopped");
    };

    return { stop, start };
};