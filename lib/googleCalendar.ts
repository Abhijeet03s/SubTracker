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
   accessToken: string,
   eventId?: string
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
      if (eventId) {
         const response = await calendar.events.update({
            calendarId: 'primary',
            eventId,
            requestBody: event,
         });
         return response.data;
      } else {
         const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
         });
         return response.data;
      }
   } catch (error) {
      console.error('Error upserting event in Google Calendar:', error);
      throw error;
   }
}

export async function deleteEventInCalendar(eventId: string, accessToken: string) {
   const oauth2Client = new google.auth.OAuth2();
   oauth2Client.setCredentials({ access_token: accessToken });

   const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

   try {
      await calendar.events.delete({
         calendarId: 'primary',
         eventId,
      });
      console.log(`Deleted Google Calendar event with ID: ${eventId}`);
   } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
   }
}
