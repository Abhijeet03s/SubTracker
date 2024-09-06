import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUrl, getTokens, addEventToCalendar } from '@/lib/googleCalendar';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { userId } = getAuth(req);

   if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
   }

   if (req.method === 'GET') {
      // Handle GET request to initiate OAuth flow
      const authUrl = await getAuthUrl();
      res.redirect(authUrl);
   } else if (req.method === 'POST') {
      // Handle POST request to add event to calendar
      const { code, summary, description, startDateTime, endDateTime } = req.body;

      try {
         const tokens = await getTokens(code);
         const event = await addEventToCalendar(
            tokens.access_token!,
            summary,
            description,
            startDateTime,
            endDateTime
         );
         res.status(200).json({ message: 'Event added successfully', event });
      } catch (error) {
         console.error('Error adding event to calendar:', error);
         res.status(500).json({ error: 'Failed to add event to calendar' });
      }
   } else {
      res.status(405).json({ error: 'Method not allowed' });
   }
}