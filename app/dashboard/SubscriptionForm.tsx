import { useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { GoogleConnectButton } from '../components/GoogleConnectButton';

interface SubscriptionFormProps {
   onSubmit: (subscription: { serviceName: string; trialEndDate: string }) => void
}

export default function SubscriptionForm({ onSubmit }: Readonly<SubscriptionFormProps>) {
   const [serviceName, setServiceName] = useState('')
   const [trialEndDate, setTrialEndDate] = useState('')
   const [isAddingToCalendar, setIsAddingToCalendar] = useState(false)
   const { user } = useUser();
   const { getToken } = useAuth();

   const isGoogleConnected = user?.externalAccounts.some(account => account.provider === 'google');

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const isoDate = new Date(trialEndDate).toISOString()
      onSubmit({ serviceName, trialEndDate: isoDate })
      setServiceName('')
      setTrialEndDate('')
   }

   const handleAddToCalendar = async () => {
      try {
         setIsAddingToCalendar(true);

         if (!isGoogleConnected) {
            alert('Please connect your Google account first');
            return;
         }

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
               summary: `Free Trial Ended: ${serviceName}`,
               description: `Your free trial for ${serviceName} has ended. If you haven't already, please cancel your subscription or consider upgrading.`,
               startDateTime: reminderDateTime.toISOString(),
               endDateTime: endDateTime.toISOString(),
            }),
         });

         if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', response.status, errorText);
            throw new Error(`Failed to add event to calendar: ${response.status} ${errorText}`);
         }

         const data = await response.json();
         alert('Reminder added to Google Calendar!');
      } catch (error) {
         console.error('Error adding event to calendar:', error);
         alert(`Failed to add reminder to Google Calendar: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
         setIsAddingToCalendar(false);
      }
   }

   return (
      <div>
         {!isGoogleConnected && (
            <div className="mb-4">
               <p className="text-red-500">Please connect your Google account to add calendar events:</p>
               <GoogleConnectButton />
            </div>
         )}
         <form onSubmit={handleSubmit} className="mb-4">
            <input
               type="text"
               value={serviceName}
               onChange={(e) => setServiceName(e.target.value)}
               placeholder="Service Name"
               className="border p-2 mr-2"
               required
            />
            <input
               type="date"
               value={trialEndDate}
               onChange={(e) => setTrialEndDate(e.target.value)}
               className="border p-2 mr-2"
               required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">
               Add Subscription
            </button>
            <button
               type="button"
               onClick={handleAddToCalendar}
               disabled={isAddingToCalendar || !isGoogleConnected || !serviceName || !trialEndDate}
               className={`bg-green-500 text-white p-2 rounded ${(!isGoogleConnected || !serviceName || !trialEndDate) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
            >
               {isAddingToCalendar ? 'Adding to Calendar...' : 'Add to Google Calendar'}
            </button>
         </form>
      </div>
   )
}