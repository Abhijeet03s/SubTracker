import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
   process.env.GOOGLE_CLIENT_ID,
   process.env.GOOGLE_CLIENT_SECRET,
   process.env.GOOGLE_REDIRECT_URI
)

export async function getGoogleAuthUrl() {
   const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar'
   ];

   const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
   });

   return authUrl;
}

export async function getTokens(code: string) {
   const { tokens } = await oauth2Client.getToken(code)
   return tokens
}

export async function addEventToCalendar(
   accessToken: string,
   summary: string,
   description: string,
   startDateTime: string,
   endDateTime: string
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
