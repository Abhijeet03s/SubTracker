import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const updateSubscriptionSchema = z.object({
   serviceName: z.string().min(1).optional(),
   trialEndDate: z.string().datetime().optional(),
})

export async function GET(
   request: Request,
   { params }: { params: { id: string } }
) {
   try {
      const subscription = await prisma.subscription.findUnique({
         where: { id: params.id },
      })
      if (!subscription) {
         return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
      }
      return NextResponse.json(subscription)
   } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export async function PUT(
   request: Request,
   { params }: { params: { id: string } }
) {
   try {
      const body = await request.json()
      const validatedData = updateSubscriptionSchema.parse(body)

      const updatedSubscription = await prisma.subscription.update({
         where: { id: params.id },
         data: {
            serviceName: validatedData.serviceName,
            trialEndDate: validatedData.trialEndDate ? new Date(validatedData.trialEndDate) : undefined,
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
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export async function DELETE(
   request: Request,
   { params }: { params: { id: string } }
) {
   try {
      await prisma.subscription.delete({
         where: { id: params.id },
      })
      return new NextResponse(null, { status: 204 })
   } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
         return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}