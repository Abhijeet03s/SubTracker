import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getGoogleAuthUrl, getTokens, upsertEventInCalendar } from '@/lib/googleCalendar'

export async function GET(request: NextRequest) {
   const { userId } = auth()
   if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }

   try {
      const authUrl = getGoogleAuthUrl()
      return NextResponse.json({ authUrl })
   } catch (error) {
      console.error('Error getting Google Calendar auth URL:', error)
      return NextResponse.json({ error: 'Failed to get Google Calendar authorization URL' }, { status: 500 })
   }
}

export async function POST(request: NextRequest) {
   const { userId } = auth()
   if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }

   try {
      const { authCode, subscriptionDetails } = await request.json()

      if (typeof authCode !== 'string') {
         return NextResponse.json({ error: 'Invalid authorization code' }, { status: 400 })
      }

      const tokens = await getTokens(authCode)
      const event = await upsertEventInCalendar(
         `Free Trial Reminder: ${subscriptionDetails.serviceName}`,
         `Your free trial is ending soon. Remember to cancel if you don't want to continue.`,
         new Date(subscriptionDetails.trialEndDate).toISOString(),
         new Date(new Date(subscriptionDetails.trialEndDate).getTime() + 24 * 60 * 60 * 1000).toISOString(),
         tokens.access_token!,
         subscriptionDetails.calendarEventId
      )

      return NextResponse.json({ message: 'Event added successfully', event })
   } catch (error) {
      console.error('Error in Google Calendar operation:', error)
      return NextResponse.json({ error: 'Failed to add event to calendar' }, { status: 500 })
   }
}
