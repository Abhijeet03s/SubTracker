import { useState } from 'react';
import { useAddToCalendar } from '../hooks/useAddToCalendar';
import { FaCalendarPlus } from 'react-icons/fa';
import { toast } from 'sonner';

interface SubscriptionFormProps {
   onSubmit: (subscription: { serviceName: string; trialEndDate: string; category: string; cost: number }) => void
}

export default function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
   const [serviceName, setServiceName] = useState('')
   const [trialEndDate, setTrialEndDate] = useState('')
   const [category, setCategory] = useState('')
   const [cost, setCost] = useState('')
   const { addToCalendar, isAddingToCalendar } = useAddToCalendar()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (serviceName && trialEndDate && category && cost) {
         onSubmit({ serviceName, trialEndDate, category, cost: parseFloat(cost) })
         setServiceName('')
         setTrialEndDate('')
         setCategory('')
         setCost('')
         try {
            await addToCalendar({ serviceName, trialEndDate })
            toast.success('Subscription added and calendar event created!')
         } catch (error) {
            console.error('Error adding to calendar:', error)
            toast.error('Failed to create calendar event. Please try again.')
         }
      }
   }

   return (
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-4">
         <div className="flex flex-wrap items-center gap-3">
            <div className="flex-grow min-w-[200px]">
               <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Service name"
               />
            </div>
            <div className="w-36">
               <input
                  type="date"
                  value={trialEndDate}
                  onChange={(e) => setTrialEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border-b border-gray-300 focus:border-blue-500 focus:outline-none"
               />
            </div>
            <div className="w-32">
               <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Category"
               />
            </div>
            <div className="w-24">
               <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input
                     type="number"
                     value={cost}
                     onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                           setCost(e.target.value);
                        }
                     }}
                     required
                     min="0"
                     step="0.1"
                     className="w-full pl-6 pr-2 py-2 text-sm border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                     placeholder="0.00"
                  />
               </div>
            </div>
            <button
               type="submit"
               disabled={isAddingToCalendar}
               className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
            >
               {isAddingToCalendar ? (
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
               ) : (
                  <FaCalendarPlus className="h-5 w-5 mr-2" />
               )}
               Calendar
            </button>
         </div>
      </form>
   )
}
