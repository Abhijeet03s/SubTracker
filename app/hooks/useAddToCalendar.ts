import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface AddToCalendarParams {
   serviceName: string;
   trialEndDate: string;
}

export function useAddToCalendar() {
   const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
   const { getToken } = useAuth();

   const addToCalendar = async ({ serviceName, trialEndDate }: AddToCalendarParams) => {
      setIsAddingToCalendar(true);
      try {
         // Validate the date
         const trialEndDateTime = new Date(trialEndDate);
         if (isNaN(trialEndDateTime.getTime())) {
            throw new Error('Invalid trial end date');
         }

         // Calculate the reminder date (7 days after trial end)
         const reminderDateTime = new Date(trialEndDateTime.getTime() + 7 * 24 * 60 * 60 * 1000);

         // Set the time to noon UTC
         reminderDateTime.setUTCHours(12, 0, 0, 0);

         // Calculate the end time (1 hour after start time)
         const endDateTime = new Date(reminderDateTime.getTime() + 60 * 60 * 1000);

         // Get the Google OAuth token
         const token = await getToken({ template: 'oauth_google' });
         if (!token) {
            throw new Error('No Google OAuth token available. Please try reconnecting your Google account.');
         }

         const response = await fetch('/api/add-calendar-event', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               summary: `Subscription Alert: ${serviceName} Trial Ended`,
               description: `Your free trial for ${serviceName} has ended. Action required: Please review your subscription status and decide whether to cancel or upgrade your plan.`,
               startDateTime: reminderDateTime.toISOString(),
               endDateTime: endDateTime.toISOString(),
            }),
         });

         if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', response.status, errorText);
            throw new Error(`Failed to add event to calendar: ${response.status} ${errorText}`);
         }

         await response.json();
         alert(`Successfully added ${serviceName} to your calendar!`);
      } catch (error) {
         console.error('Error adding to calendar:', error);
         if (error instanceof Error) {
            alert(`Failed to add reminder to Google Calendar: ${error.message}`);
         } else {
            alert('Failed to add reminder to Google Calendar. Please try again later.');
         }
         throw error;
      } finally {
         setIsAddingToCalendar(false);
      }
   };

   return { addToCalendar, isAddingToCalendar };
}
