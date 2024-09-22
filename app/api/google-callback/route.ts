import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { addEventToCalendar } from '@/lib/googleCalendar';

const oauth2Client = new google.auth.OAuth2(
   process.env.GOOGLE_CLIENT_ID,
   process.env.GOOGLE_CLIENT_SECRET,
   process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const code = searchParams.get('code');

   if (!code) {
      return NextResponse.json({ error: 'No authorization code found' }, { status: 400 });
   }

   try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Added a test event to the calendar
      const eventAdded = await addEventToCalendar(
         tokens.access_token!,
         'Test Event',
         'This is a test event added by the application',
         new Date().toISOString(),
         // 1 hour from now
         new Date(Date.now() + 3600000).toISOString()
      );

      console.log('Event added:', eventAdded);

      // Redirect to the calendar-connected page
      return NextResponse.redirect(new URL('/calendar-connected', request.url));
   } catch (error) {
      console.error('Error exchanging code for tokens or adding event:', error);
      return NextResponse.json({ error: 'Failed to authenticate with Google or add event' }, { status: 500 });
   }
}
