// For more information about this file see https://dove.feathersjs.com/guides/cli/log-error.html
import type { HookContext, NextFunction } from '../declarations';
import { logger } from '../logger';

export const logError = async (_context: HookContext, next: NextFunction) => {
    try {
        await next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(error.stack);
        }

        // Log validation errors
        if (error && typeof error === 'object' && 'data' in error) {
            logger.error('Data: %O', error.data);
        }

        throw error;
    }
};
