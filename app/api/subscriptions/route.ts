import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const subscriptionSchema = z.object({
   userId: z.string().min(1),
   serviceName: z.string().min(1),
   trialEndDate: z.string().datetime(),
})

export async function POST(request: Request) {
   try {
      const body = await request.json()
      const validatedData = subscriptionSchema.parse(body)

      const subscription = await prisma.subscription.create({
         data: {
            userId: validatedData.userId,
            serviceName: validatedData.serviceName,
            trialEndDate: new Date(validatedData.trialEndDate),
         },
      })
      return NextResponse.json(subscription, { status: 201 })
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: error.errors }, { status: 400 })
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export async function GET(request: Request) {
   try {
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')
      if (!userId) {
         return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }
      const subscriptions = await prisma.subscription.findMany({
         where: { userId },
      })
      return NextResponse.json(subscriptions)
   } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}