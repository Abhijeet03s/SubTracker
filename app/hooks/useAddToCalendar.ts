import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

interface AddToCalendarParams {
   serviceName: string;
   startDate: string;
   trialEndDate: string | null;
   category: string;
   cost: number;
}

export function useAddToCalendar() {
   const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
   const { getToken } = useAuth();

   const upsertCalendarEvent = async ({ serviceName, startDate, trialEndDate, category, cost }: AddToCalendarParams) => {
      setIsAddingToCalendar(true);
      try {

         const startDateTime = new Date(startDate);
         if (isNaN(startDateTime.getTime())) {
            throw new Error('Invalid start date');
         }

         const trialEndDate = new Date(startDateTime.getTime() + 7 * 24 * 60 * 60 * 1000);
         const reminderDateTime = new Date(trialEndDate.getTime() - 24 * 60 * 60 * 1000);
         reminderDateTime.setUTCHours(12, 0, 0, 0);

         const endDateTime = new Date(reminderDateTime.getTime() + 60 * 60 * 1000);

         const token = await getToken({ template: 'oauth_google' });
         if (!token) {
            throw new Error('No Google OAuth token available. Please try reconnecting your Google account.');
         }

         const response = await fetch('/api/upsert-calendar-event', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               summary: `Subscription Alert: ${serviceName} Trial Ending Soon`,
               description: `Your free trial for ${serviceName} ends tomorrow. Please review your subscription status and decide whether to cancel or upgrade your plan.\n\nCategory: ${category}\nMonthly Cost: $${cost.toFixed(2)}\n\nRemember to make your decision before the trial ends to avoid any unexpected charges.`,
               startDateTime: reminderDateTime.toISOString(),
               endDateTime: endDateTime.toISOString(),
            }),
         });

         if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', response.status, errorText);
            throw new Error(`Failed to upsert event in calendar: ${response.status} ${errorText}`);
         }
         toast.success(`Successfully added ${serviceName} to your calendar!`);

      } catch (error) {
         console.error('Error upserting calendar event:', error);
         if (error instanceof Error) {
            toast.error(`Failed to upsert reminder in Google Calendar: ${error.message}`);
         } else {
            toast.error('Failed to upsert reminder in Google Calendar. Please try again later.');
         }
         throw error;
      } finally {
         setIsAddingToCalendar(false);
      }
   };

   return { upsertCalendarEvent, isAddingToCalendar };
}