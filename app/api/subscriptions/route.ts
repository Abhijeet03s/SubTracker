import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

const subscriptionSchema = z.object({
   serviceName: z.string().min(1),
   startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date string",
   }),
   endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date string",
   }),
   category: z.string().min(1),
   cost: z.number().min(0),
   subscriptionType: z.enum(['trial', 'monthly']),
});

export async function GET(request: NextRequest) {
   try {
      const { userId } = auth()
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const subscriptions = await prisma.subscription.findMany({
         where: { userId },
      })
      return NextResponse.json(subscriptions)
   } catch (error) {
      console.error('Error in GET /api/subscriptions:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

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
            startDate: new Date(validatedData.startDate),
            endDate: new Date(validatedData.endDate),
            category: validatedData.category,
            cost: validatedData.cost,
            subscriptionType: validatedData.subscriptionType,
         },
      });

      return NextResponse.json(subscription, { status: 201 });
   } catch (error) {
      console.error('Error in POST /api/subscriptions:', error);
      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}