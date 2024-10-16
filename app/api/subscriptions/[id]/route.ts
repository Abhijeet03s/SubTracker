import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

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

      let startDate = validatedData.startDate ? new Date(validatedData.startDate) : undefined;
      let endDate = validatedData.endDate ? new Date(validatedData.endDate) : undefined;

      if (startDate && validatedData.subscriptionType) {
         const daysToAdd = validatedData.subscriptionType === 'trial' ? 6 : 29;
         endDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      }

      const updatedSubscription = await prisma.subscription.update({
         where: { id: params.id, userId },
         data: {
            ...validatedData,
            startDate,
            endDate,
         },
      })
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

      await prisma.subscription.delete({
         where: { id: params.id, userId },
      })
      return NextResponse.json({ message: 'Subscription deleted successfully' })
   } catch (error) {
      console.error(error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
