import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

const subscriptionSchema = z.object({
   serviceName: z.string().min(1),
   trialEndDate: z.string().datetime(),
});

export async function POST(request: NextRequest) {
   try {
      const { userId } = auth();
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const body = await request.json();
      const validatedData = subscriptionSchema.parse(body);

      const subscription = await prisma.subscription.create({
         data: {
            userId,
            serviceName: validatedData.serviceName,
            trialEndDate: new Date(validatedData.trialEndDate),
         },
      });

      return NextResponse.json(subscription, { status: 201 });
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

export async function GET(request: NextRequest) {
   try {
      const { userId } = auth()
      console.log('Authenticated User ID:', userId);
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const subscriptions = await prisma.subscription.findMany({
         where: { userId: 'known-user-id' },
      })
      return NextResponse.json(subscriptions)
   } catch (error) {
      console.error(error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}