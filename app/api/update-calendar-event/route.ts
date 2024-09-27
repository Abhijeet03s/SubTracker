import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { updateEventInCalendar } from '@/lib/googleCalendar';

export async function POST(request: NextRequest) {
   try {
      const { userId } = auth();

      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const tokens = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_google');

      if (!tokens || tokens.data.length === 0) {
         return NextResponse.json({ error: 'No Google access token found' }, { status: 400 });
      }

      const googleAccessToken = tokens.data[0].token;

      const { summary, description, startDateTime, endDateTime } = await request.json();

      // console.log('Updating calendar event with:', { summary, description, startDateTime, endDateTime });

      const event = await updateEventInCalendar(summary, description, startDateTime, endDateTime, googleAccessToken);

      return NextResponse.json({ success: true, event });
   } catch (error) {
      console.error('Error in update-calendar-event route:', error);
      if (error instanceof Error) {
         return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
         return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
      }
   }
}
