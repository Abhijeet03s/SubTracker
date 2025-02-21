import { redis } from './redis';

export const monitorCache = {
   async getStats() {
      const info = await redis.info();
      return {
         info,
         memoryUsage: await redis.info('memory'),
         hitRate: await this.calculateHitRate(),
      };
   },

   async calculateHitRate() {
      const hits = await redis.info('stats');
      // Parse hits and misses from stats
      // Return hit rate calculation
      return hits;
   },
}; 