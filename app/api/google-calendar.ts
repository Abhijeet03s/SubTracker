import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAuthUrl, getTokens, addEventToCalendar } from '@/lib/googleCalendar'

export async function GET(request: NextRequest) {
   const { userId } = auth()
   if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }

   try {
      const authUrl = await getAuthUrl()
      return NextResponse.json({ authUrl })
   } catch (error) {
      console.error('Error getting auth URL:', error)
      return NextResponse.json({ error: 'Failed to get authorization URL' }, { status: 500 })
   }
}

export async function POST(request: NextRequest) {
   const { userId } = auth()
   if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }

   try {
      const { code, subscriptionDetails } = await request.json()

      if (typeof code !== 'string') {
         return NextResponse.json({ error: 'Invalid authorization code' }, { status: 400 })
      }

      const tokens = await getTokens(code)
      const event = await addEventToCalendar(
         tokens.access_token!,
         `Free Trial Reminder: ${subscriptionDetails.serviceName}`,
         `Your free trial is ending soon. Remember to cancel if you don't want to continue.`,
         new Date(subscriptionDetails.trialEndDate).toISOString(),
         new Date(new Date(subscriptionDetails.trialEndDate).getTime() + 24 * 60 * 60 * 1000).toISOString() // End date is 24 hours after start
      )

      return NextResponse.json({ message: 'Event added successfully', event })
   } catch (error) {
      console.error('Error in Google Calendar operation:', error)
      return NextResponse.json({ error: 'Failed to add event to calendar' }, { status: 500 })
   }
}