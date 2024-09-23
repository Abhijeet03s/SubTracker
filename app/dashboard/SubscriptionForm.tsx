import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAddToCalendar } from '../hooks/useAddToCalendar';

interface SubscriptionFormProps {
   onSubmit: (subscription: { serviceName: string; trialEndDate: string }) => void
}

export default function SubscriptionForm({ onSubmit }: Readonly<SubscriptionFormProps>) {
   const [serviceName, setServiceName] = useState('')
   const [trialEndDate, setTrialEndDate] = useState('')
   const { user } = useUser();
   const { addToCalendar, isAddingToCalendar } = useAddToCalendar();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const isoDateFormatted = new Date(trialEndDate).toISOString()
      onSubmit({ serviceName, trialEndDate: isoDateFormatted })
   }

   const handleAddToCalendar = async () => {
      try {
         await addToCalendar({ serviceName, trialEndDate });
         setServiceName('');
         setTrialEndDate('');
      } catch (error) {
         console.error('Error adding to calendar:', error);
         alert('Failed to add event to calendar. Please try again later.');
      }
   }

   return (
      <div>
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
               disabled={isAddingToCalendar || !serviceName || !trialEndDate}
               className={`bg-green-500 text-white p-2 rounded ${(!serviceName || !trialEndDate) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
            >
               {isAddingToCalendar ? 'Adding to Calendar...' : 'Add to Google Calendar'}
            </button>
         </form>
      </div>
   )
}