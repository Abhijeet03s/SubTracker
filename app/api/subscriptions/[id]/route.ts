import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

const updateSubscriptionSchema = z.object({
   serviceName: z.string().min(1).optional(),
   trialEndDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date string",
   }).optional(),
   category: z.string().min(1).optional(),
   cost: z.number().min(0).optional(),
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
      const validatedData = updateSubscriptionSchema.parse(body)

      const updatedSubscription = await prisma.subscription.update({
         where: { id: params.id, userId },
         data: {
            serviceName: validatedData.serviceName,
            trialEndDate: validatedData.trialEndDate ? new Date(validatedData.trialEndDate) : undefined,
            category: validatedData.category,
            cost: validatedData.cost,
         },
      })
      return NextResponse.json(updatedSubscription)
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: error.errors }, { status: 400 })
      }
      if (error instanceof Error && error.message.includes("Record to update not found")) {
         return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
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