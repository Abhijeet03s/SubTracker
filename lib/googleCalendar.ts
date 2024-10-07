import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
   process.env.GOOGLE_CLIENT_ID,
   process.env.GOOGLE_CLIENT_SECRET,
   process.env.GOOGLE_REDIRECT_URI
);

export function getGoogleAuthUrl() {
   const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar'
   ];

   const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
   });

   return url;
}

export async function getTokens(authCode: string) {
   try {
      const { tokens } = await oauth2Client.getToken(authCode);
      oauth2Client.setCredentials(tokens);
      return tokens;
   } catch (error) {
      console.error('Error retrieving access token', error);
      throw error;
   }
}

export async function upsertEventInCalendar(
   summary: string,
   description: string,
   startDateTime: string,
   endDateTime: string,
   accessToken: string
) {
   const oauth2Client = new google.auth.OAuth2();
   oauth2Client.setCredentials({ access_token: accessToken });

   const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

   const event = {
      summary,
      description,
      start: {
         dateTime: startDateTime,
         timeZone: 'UTC',
      },
      end: {
         dateTime: endDateTime,
         timeZone: 'UTC',
      },
      reminders: {
         useDefault: false,
         overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
         ],
      },
   };

   try {
      // Find the existing event
      const existingEvents = await calendar.events.list({
         calendarId: 'primary',
         q: summary,
         timeMin: new Date().toISOString(),
         maxResults: 1,
         singleEvents: true,
         orderBy: 'startTime',
      });

      if (existingEvents.data.items && existingEvents.data.items.length > 0) {
         const existingEvent = existingEvents.data.items[0];
         console.log('Updating existing event:', existingEvent.id);
         // Update the existing event
         const response = await calendar.events.update({
            calendarId: 'primary',
            eventId: existingEvent.id!,
            requestBody: event,
         });
         return response.data;
      } else {
         console.log('Creating new event');
         // If no existing event found, create a new one
         const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
         });
         return response.data;
      }
   } catch (error) {
      console.error('Error upserting event in calendar:', error);
      if (error instanceof Error) {
         throw new Error(`Failed to upsert calendar event: ${error.message}`);
      } else {
         throw new Error('Failed to upsert calendar event: Unknown error');
      }
   }
}