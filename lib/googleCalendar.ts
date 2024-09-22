import { google } from 'googleapis';

export async function addEventToCalendar(
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
      const response = await calendar.events.insert({
         calendarId: 'primary',
         requestBody: event,
      });
      return response.data;
   } catch (error) {
      console.error('Error adding event to calendar:', error);
      throw error;
   }
}