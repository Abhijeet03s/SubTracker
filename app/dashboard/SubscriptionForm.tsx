import { useState } from 'react';
import { useAddToCalendar } from '../hooks/useAddToCalendar';
import { FaCalendarPlus, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface SubscriptionFormProps {
   onSubmit: (subscription: { serviceName: string; trialEndDate: string; category: string; cost: number }) => void
}

export default function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
   const [serviceName, setServiceName] = useState('')
   const [trialEndDate, setTrialEndDate] = useState<Date | null>(null)
   const [category, setCategory] = useState('')
   const [cost, setCost] = useState('')
   const { addToCalendar, isAddingToCalendar } = useAddToCalendar()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const newSubscription = {
         serviceName,
         trialEndDate: trialEndDate ? trialEndDate.toISOString().split('T')[0] : '',
         category,
         cost: parseFloat(cost) || 0,
      }
      await onSubmit(newSubscription)
      setServiceName('')
      setTrialEndDate(null)
      setCategory('')
      setCost('')
      try {
         await addToCalendar({ serviceName, trialEndDate: newSubscription.trialEndDate })
         console.log('Subscription added and calendar event created!')
      } catch (error) {
         console.error('Error adding to calendar:', error)
         toast.error('Failed to create calendar event. Please try again.')
      }
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input id="serviceName" type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               placeholder="Service name" />
         </div>
         <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               placeholder="Category" />
         </div>
         <div className="flex space-x-4">
            <div className="flex-1">
               <label htmlFor="trialEndDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
               <div className="relative">
                  <DatePicker
                     id="trialEndDate"
                     selected={trialEndDate}
                     onChange={(date) => setTrialEndDate(date)}
                     dateFormat="yyyy-MM-dd"
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholderText="Select date"
                  />
                  <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
               </div>
            </div>
            <div className="flex-1">
               <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">Monthly Cost</label>
               <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                     id="cost"
                     type="text"
                     value={cost}
                     onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                           setCost(value);
                        }
                     }}
                     required
                     className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholder="0.00"
                  />
               </div>
            </div>
         </div>
         <button type="submit" disabled={isAddingToCalendar}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
            {isAddingToCalendar ? (
               <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
               <FaCalendarPlus className="h-5 w-5 mr-2" />
            )}
            Add to Calendar
         </button>
      </form>
   )
}