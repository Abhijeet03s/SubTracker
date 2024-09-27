import { useState } from 'react';
import { useAddToCalendar } from '../hooks/useAddToCalendar';
import { FaCalendarPlus } from 'react-icons/fa';
import { toast } from 'sonner';

interface SubscriptionFormProps {
   onSubmit: (subscription: { serviceName: string; trialEndDate: string }) => void
}

export default function SubscriptionForm({ onSubmit }: Readonly<SubscriptionFormProps>) {
   const [serviceName, setServiceName] = useState('')
   const [trialEndDate, setTrialEndDate] = useState('')
   const { addToCalendar, isAddingToCalendar } = useAddToCalendar();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (serviceName && trialEndDate) {
         onSubmit({ serviceName, trialEndDate })
         try {
            await addToCalendar({ serviceName, trialEndDate });
         } catch (error) {
            toast.error('Failed to add event to calendar. Please try again.');
         }
         setServiceName('')
         setTrialEndDate('')
      }
   };

   return (
      <form onSubmit={handleSubmit} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
         <div className="flex-grow">
            <input
               type="text"
               value={serviceName}
               onChange={(e) => setServiceName(e.target.value)}
               placeholder="Service name"
               className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
               required
            />
         </div>
         <div className="w-48">
            <input
               type="date"
               value={trialEndDate}
               onChange={(e) => setTrialEndDate(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
               required
            />
         </div>
         <button
            type="submit"
            disabled={isAddingToCalendar || !serviceName || !trialEndDate}
            className={`bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center ${(!serviceName || !trialEndDate) ? 'opacity-50 cursor-not-allowed' : ''
               }`}
         >
            <FaCalendarPlus className="mr-2" />
            {isAddingToCalendar ? 'Adding...' : 'Calendar'}
         </button>
      </form>
   )
}
