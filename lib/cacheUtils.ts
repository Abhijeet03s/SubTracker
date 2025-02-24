import prisma from './prisma';
import { redis, CACHE_KEYS, CACHE_TTL } from './redis';

export const cacheUtils = {
   async invalidateUserCache(userId: string) {
      const keys = [
         CACHE_KEYS.USER_SUBSCRIPTIONS(userId),
         CACHE_KEYS.USER_ANALYTICS(userId),
      ];
      await Promise.all(keys.map(key => redis.del(key)));
   },

   async invalidateSubscriptionCache(subscriptionId: string, userId: string) {
      const keys = [
         CACHE_KEYS.SUBSCRIPTION_DETAIL(subscriptionId),
         CACHE_KEYS.USER_SUBSCRIPTIONS(userId),
      ];
      await Promise.all(keys.map(key => redis.del(key)));
   },

   async warmUpCache(userId: string) {
      // Pre-cache frequently accessed data
      const subscriptions = await prisma.subscription.findMany({
         where: { userId },
      });
      await redis.setex(
         CACHE_KEYS.USER_SUBSCRIPTIONS(userId),
         CACHE_TTL,
         JSON.stringify(subscriptions)
      );
   },
}; 