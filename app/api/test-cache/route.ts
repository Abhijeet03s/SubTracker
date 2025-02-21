import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { monitorCache } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
   try {
      // Test Redis connection
      await redis.set('test-key', 'test-value');
      const value = await redis.get('test-key');

      // Get cache statistics
      const stats = await monitorCache.getStats();

      return NextResponse.json({
         status: 'success',
         connection: 'Redis connected',
         testValue: value,
         cacheStats: stats,
      });
   } catch (error) {
      console.error('Redis test error:', error);
      return NextResponse.json({
         status: 'error',
         error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
   }
} 