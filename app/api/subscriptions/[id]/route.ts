import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { upsertEventInCalendar, deleteEventInCalendar } from '@/lib/googleCalendar'

const updateSubscriptionSchema = z.object({
   serviceName: z.string().min(1).optional(),
   startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date string",
   }).optional(),
   endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date string",
   }).optional(),
   category: z.string().min(1).optional(),
   cost: z.number().min(0).optional(),
   subscriptionType: z.enum(['trial', 'monthly']).optional(),
   calendarEventId: z.string().optional(),
})

export async function GET(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const { userId } = auth()
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const subscription = await prisma.subscription.findUnique({
         where: { id: params.id, userId },
      })
      if (!subscription) {
         return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
      }
      return NextResponse.json(subscription)
   } catch (error) {
      console.error(error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export async function PUT(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const { userId } = auth()
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const body = await request.json()
      const validatedData = updateSubscriptionSchema.parse(body);

      const existingSubscription = await prisma.subscription.findUnique({
         where: { id: params.id, userId },
      })

      if (!existingSubscription) {
         return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
      }

      let startDate = validatedData.startDate ? new Date(validatedData.startDate) : existingSubscription.startDate;
      let endDate = validatedData.endDate ? new Date(validatedData.endDate) : existingSubscription.endDate;

      if (validatedData.startDate || validatedData.subscriptionType) {
         const subscriptionType = validatedData.subscriptionType || existingSubscription.subscriptionType;
         const daysToAdd = subscriptionType === 'trial' ? 6 : 29;
         startDate = startDate || existingSubscription.startDate;
         endDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      }

      const updatedSubscription = await prisma.subscription.update({
         where: { id: params.id },
         data: {
            ...validatedData,
            startDate,
            endDate,
         },
      })

      if (updatedSubscription.calendarEventId) {
         const tokens = await clerkClient().users.getUserOauthAccessToken(userId, 'oauth_google')
         if (tokens && tokens.data.length > 0) {
            const googleAccessToken = tokens.data[0].token

            // Prepare event details
            const summary = `Subscription Alert: ${updatedSubscription.serviceName} ${updatedSubscription.subscriptionType === 'trial' ? 'Trial' : 'Subscription'} Ending Soon`
            const description = `Your ${updatedSubscription.subscriptionType === 'trial' ? 'free trial' : 'subscription'} for ${updatedSubscription.serviceName} ends tomorrow. Please review your subscription status and decide whether to cancel or continue your plan.\n\nCategory: ${updatedSubscription.category}\nMonthly Cost: $${updatedSubscription.cost.toFixed(2)}\n\nRemember to make your decision before the ${updatedSubscription.subscriptionType === 'trial' ? 'trial' : 'subscription'} ends to avoid any unexpected charges.`
            const reminderDateTime = new Date(updatedSubscription.endDate.getTime() - 24 * 60 * 60 * 1000)
            reminderDateTime.setUTCHours(12, 0, 0, 0)
            const endDateTime = new Date(reminderDateTime.getTime() + 60 * 60 * 1000)

            const event = await upsertEventInCalendar(
               summary,
               description,
               reminderDateTime.toISOString(),
               endDateTime.toISOString(),
               googleAccessToken,
               updatedSubscription.calendarEventId
            )

            if (event.id !== updatedSubscription.calendarEventId) {
               await prisma.subscription.update({
                  where: { id: params.id },
                  data: { calendarEventId: event.id },
               })
            }
         }
      }

      return NextResponse.json(updatedSubscription)

   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: error.errors }, { status: 400 })
      }
      console.error(error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const { userId } = auth()
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const subscription = await prisma.subscription.findUnique({
         where: { id: params.id },
      })

      if (!subscription) {
         return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
      }

      const { calendarEventId } = subscription

      if (calendarEventId) {
         const tokens = await clerkClient().users.getUserOauthAccessToken(userId, 'oauth_google')
         if (tokens && tokens.data.length > 0) {
            const googleAccessToken = tokens.data[0].token
            try {
               await deleteEventInCalendar(calendarEventId, googleAccessToken)
            } catch (error) {
               console.error('Error deleting calendar event:', error)
            }
         } else {
            console.warn('No Google access token found for user:', userId)
         }
      }

      await prisma.subscription.delete({
         where: { id: params.id },
      })

      return NextResponse.json({ message: 'Subscription deleted successfully' })
   } catch (error) {
      console.error(error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
