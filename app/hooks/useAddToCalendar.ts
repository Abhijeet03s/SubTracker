import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { addDaysToDate } from '../utils/dateUtils';

interface AddToCalendarParams {
   serviceName: string;
   startDate: string;
   endDate: string;
   category: string;
   cost: number;
   subscriptionType: string;
}

export function useAddToCalendar() {
   const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
   const { getToken } = useAuth();

   const upsertCalendarEvent = async ({ serviceName, startDate, category, cost, subscriptionType }: AddToCalendarParams) => {
      setIsAddingToCalendar(true);
      try {
         const startDateTime = new Date(startDate);
         if (isNaN(startDateTime.getTime())) {
            throw new Error('Invalid start date');
         }

         const trialEndDate = addDaysToDate(startDateTime, subscriptionType === 'trial' ? 7 : 30);
         const reminderDateTime = addDaysToDate(trialEndDate, -1);
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
      } finally {
         setIsAddingToCalendar(false);
      }
   };

   return { upsertCalendarEvent, isAddingToCalendar };
}
