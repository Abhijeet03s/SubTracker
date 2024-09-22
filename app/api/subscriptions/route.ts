import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

const subscriptionSchema = z.object({
   serviceName: z.string().min(1),
   trialEndDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date string",
   }),
});

export async function POST(request: NextRequest) {
   try {
      const { userId } = auth();
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const body = await request.json();
      const validatedData = subscriptionSchema.parse(body);

      console.log('Adding subscription for user:', userId);
      console.log('Subscription data:', validatedData);

      const subscription = await prisma.subscription.create({
         data: {
            userId,
            serviceName: validatedData.serviceName,
            trialEndDate: new Date(validatedData.trialEndDate),
         },
      });

      console.log('Created subscription:', subscription);

      return NextResponse.json(subscription, { status: 201 });
   } catch (error) {
      console.error('Error in POST /api/subscriptions:', error);
      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

export async function GET(request: NextRequest) {
   try {
      const { userId } = auth()
      console.log('Fetching subscriptions for user:', userId);
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const subscriptions = await prisma.subscription.findMany({
         where: { userId },
      })
      console.log('Found subscriptions:', subscriptions);
      return NextResponse.json(subscriptions)
   } catch (error) {
      console.error('Error in GET /api/subscriptions:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}