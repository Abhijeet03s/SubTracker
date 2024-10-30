import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

interface AddToCalendarParams {
   serviceName: string;
   startDate: string;
   endDate: string;
   category: string;
   cost: number;
   subscriptionType: string;
   calendarEventId?: string;
}

export const useAddToCalendar = () => {
   const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
   const { getToken } = useAuth();

   const upsertCalendarEvent = async ({
      serviceName,
      startDate,
      category,
      cost,
      subscriptionType,
      calendarEventId,
   }: AddToCalendarParams): Promise<string> => {
      setIsAddingToCalendar(true);
      try {
         const startDateTime = new Date(Date.parse(startDate));
         if (isNaN(startDateTime.getTime())) {
            throw new Error('Invalid start date');
         }

         const daysToAdd = subscriptionType === 'trial' ? 7 : 30;
         const trialEndDate = new Date(startDateTime.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

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
               summary: `Subscription Alert: ${serviceName} ${subscriptionType === 'trial' ? 'Trial' : 'Subscription'} Ending Soon`,
               description: `Your ${subscriptionType === 'trial' ? 'free trial' : 'subscription'} for ${serviceName} ends tomorrow. Please review your subscription status and decide whether to cancel or continue your plan.\n\nCategory: ${category}\nMonthly Cost: $${cost.toFixed(2)}\n\nRemember to make your decision before the ${subscriptionType === 'trial' ? 'trial' : 'subscription'} ends to avoid any unexpected charges.`,
               startDateTime: reminderDateTime.toISOString(),
               endDateTime: endDateTime.toISOString(),
               eventId: calendarEventId,
            }),
         });

         const data = await response.json();

         if (!response.ok) {
            console.error('Error upserting calendar event:', data.error);
            toast.error(`Failed to upsert event in calendar: ${data.error}`);
            throw new Error(`Failed to upsert event in calendar: ${data.error}`);
         }

         return data.eventId;
      } catch (error) {
         console.error('Error upserting calendar event:', error);
         if (error instanceof Error) {
            toast.error(`Failed to upsert reminder in Google Calendar: ${error.message}`);
            throw error;
         } else {
            toast.error('Failed to upsert reminder in Google Calendar. Please try again later.');
            throw new Error('Failed to upsert reminder in Google Calendar.');
         }
      } finally {
         setIsAddingToCalendar(false);
      }
   };

   return { upsertCalendarEvent, isAddingToCalendar };
};