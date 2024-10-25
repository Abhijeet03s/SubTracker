import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { upsertEventInCalendar } from '@/lib/googleCalendar';

const client = clerkClient()

export async function POST(request: NextRequest) {
   try {
      const { userId } = auth();

      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { summary, description, startDateTime, endDateTime, eventId } = await request.json();
      if (
         typeof summary !== 'string' ||
         typeof description !== 'string' ||
         typeof startDateTime !== 'string' ||
         typeof endDateTime !== 'string'
      ) {
         return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
      }

      const tokens = await client.users.getUserOauthAccessToken(userId, 'oauth_google');

      if (!tokens || tokens.data.length === 0) {
         return NextResponse.json({ error: 'No Google access token found' }, { status: 400 });
      }

      const googleAccessToken = tokens.data[0].token;

      const googleEvent = await upsertEventInCalendar(
         summary,
         description,
         startDateTime,
         endDateTime,
         googleAccessToken,
         eventId
      );

      return NextResponse.json({ success: true, event: googleEvent, eventId: googleEvent.id });

   } catch (error) {
      console.error('Error in upsert-calendar-event route:', error);
      if (error instanceof Error) {
         return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
         return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
      }
   }
}
