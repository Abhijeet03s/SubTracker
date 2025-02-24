import { NextResponse } from 'next/server';
import { redis, CACHE_TTL, CACHE_KEYS } from './redis';

interface CacheOptions {
   ttl?: number;
   invalidateOn?: string[];
}

export async function withCache(
   req: Request,
   cacheKey: string,
   fetchData: () => Promise<any>,
   options: CacheOptions = {}
) {
   const { ttl = CACHE_TTL, invalidateOn = [] } = options;

   // Skip cache for non-GET requests
   if (req.method !== 'GET') {
      const data = await fetchData();

      // Invalidate related cache entries
      if (invalidateOn.length > 0) {
         await Promise.all(
            invalidateOn.map(key => redis.del(key))
         );
      }

      return NextResponse.json(data);
   }

   try {
      // Try to get data from cache
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
         console.log('Cache HIT:', cacheKey);
         return NextResponse.json(JSON.parse(cachedData));
      }

      console.log('Cache MISS:', cacheKey);
      // If not in cache, fetch and cache the data
      const data = await fetchData();
      await redis.setex(cacheKey, ttl, JSON.stringify(data));

      return NextResponse.json(data);
   } catch (error) {
      console.error('Cache middleware error:', error);
      // Fallback to direct data fetch on cache error
      const data = await fetchData();
      return NextResponse.json(data);
   }
} 