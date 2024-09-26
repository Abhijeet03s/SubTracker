import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAddToCalendar } from '../hooks/useAddToCalendar';
import { FaCalendarPlus, FaPlus } from 'react-icons/fa';

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
      <div className="bg-white p-4 rounded-lg shadow-md">
         <form onSubmit={handleSubmit} className="flex items-center space-x-4">
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
               className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
            >
               <FaPlus className="mr-2" />
               Add
            </button>
            <button
               type="button"
               onClick={handleAddToCalendar}
               disabled={isAddingToCalendar || !serviceName || !trialEndDate}
               className={`bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center ${(!serviceName || !trialEndDate) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
            >
               <FaCalendarPlus className="mr-2" />
               {isAddingToCalendar ? 'Adding...' : 'Calendar'}
            </button>
         </form>
      </div>
   )
}