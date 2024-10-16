import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { upsertEventInCalendar } from '@/lib/googleCalendar';

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
      const { userId } = auth();
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const subscriptions = await prisma.subscription.findMany({
         where: { userId },
      });
      return NextResponse.json(subscriptions);
   } catch (error) {
      console.error('Error in GET /api/subscriptions:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

      const tokens = await clerkClient().users.getUserOauthAccessToken(userId, 'oauth_google');
      if (!tokens || tokens.data.length === 0) {
         return NextResponse.json({ error: 'No Google access token found' }, { status: 400 });
      }

      const googleAccessToken = tokens.data[0].token;

      const summary = `Subscription Alert: ${subscription.serviceName} ${subscription.subscriptionType === 'trial' ? 'Trial' : 'Subscription'} Ending Soon`;
      const description = `Your ${subscription.subscriptionType === 'trial' ? 'free trial' : 'subscription'} for ${subscription.serviceName} ends tomorrow. Please review your subscription status and decide whether to cancel or continue your plan.\n\nCategory: ${subscription.category}\nMonthly Cost: $${subscription.cost.toFixed(2)}\n\nRemember to make your decision before the ${subscription.subscriptionType === 'trial' ? 'trial' : 'subscription'} ends to avoid any unexpected charges.`;
      const reminderDateTime = new Date(subscription.endDate.getTime() - 24 * 60 * 60 * 1000);
      reminderDateTime.setUTCHours(12, 0, 0, 0);
      const endDateTime = new Date(reminderDateTime.getTime() + 60 * 60 * 1000);

      const event = await upsertEventInCalendar(
         summary,
         description,
         reminderDateTime.toISOString(),
         endDateTime.toISOString(),
         googleAccessToken
      );

      const updatedSubscription = await prisma.subscription.update({
         where: { id: subscription.id },
         data: { calendarEventId: event.id },
      });

      return NextResponse.json(updatedSubscription, { status: 201 });
   } catch (error) {
      console.error('Error in POST /api/subscriptions:', error);
      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
