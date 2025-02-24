import Redis from 'ioredis';

const getRedisUrl = () => {
   if (process.env.REDIS_URL) {
      return process.env.REDIS_URL;
   }

   throw new Error('REDIS_URL is not defined');
};

export const redis = new Redis(getRedisUrl(), {
   reconnectOnError: (err) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
         return true;
      }
      return false;
   },
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));

// Cache TTL in seconds
export const CACHE_TTL = 60 * 5;

// Cache keys
export const CACHE_KEYS = {
   USER_SUBSCRIPTIONS: (userId: string) => `user:${userId}:subscriptions`,
   SUBSCRIPTION_DETAIL: (subscriptionId: string) => `subscription:${subscriptionId}`,
   USER_ANALYTICS: (userId: string) => `user:${userId}:analytics`,
}; 