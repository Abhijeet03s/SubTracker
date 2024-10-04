import { useState } from 'react';
import { useAddToCalendar } from '../hooks/useAddToCalendar';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'sonner';
import { Loader } from '@/app/components/ui/loader';
import { safeFormatDate } from '@/app/utils/dateUtils';

interface SubscriptionFormProps {
   onSubmit: (subscription: { serviceName: string; trialEndDate: string; category: string; cost: number }) => void
}

export default function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
   const [serviceName, setServiceName] = useState('')
   const [startDate, setStartDate] = useState<Date | null>(null)
   const [category, setCategory] = useState('')
   const [cost, setCost] = useState('')
   const { upsertCalendarEvent, isAddingToCalendar } = useAddToCalendar()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!startDate) return;
      const trialEndDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const newSubscription = {
         serviceName,
         startDate: startDate.toISOString(),
         trialEndDate: trialEndDate.toISOString(),
         category: category.charAt(0).toUpperCase() + category.slice(1),
         cost: parseFloat(cost) || 0,
      }
      await onSubmit(newSubscription as any)
      setServiceName('')
      setStartDate(null)
      setCategory('')
      setCost('')
      try {
         await upsertCalendarEvent({
            serviceName,
            startDate: newSubscription.startDate,
            trialEndDate: newSubscription.trialEndDate,
            category,
            cost: parseFloat(cost) || 0
         })
         console.log('Subscription added and calendar event created!')
      } catch (error) {
         console.error('Error adding to calendar:', error)
         toast.error('Failed to create calendar event. Please try again.')
      }
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         <h2 className="text-xl font-semibold mb-4">Add Subscription</h2>
         <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">Service Name</label>
            <input
               id="serviceName"
               type="text"
               value={serviceName}
               onChange={(e) => setServiceName(e.target.value)}
               required
               className="w-full mt-2 p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
               placeholder="Service Name"
            />
         </div>
         <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <div className="relative">
               <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full mt-2 p-2 pr-8 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300 appearance-none"
               >
                  <option value="" disabled>Select Category</option>
                  <option value="ecommerce">Ecommerce</option>
                  <option value="entertainment">Streaming</option>
                  <option value="gaming">Gaming</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="music">Music</option>
                  <option value="other">Other</option>
               </select>
               <FaChevronDown className="absolute right-3 top-[calc(40%+0.6rem)] transform -translate-y-1/2 text-gray-400 pointer-events-none h-3 w-3" />
            </div>
         </div>
         <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Monthly Cost</label>
            <input
               id="cost"
               type="number"
               value={cost}
               onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                     setCost(value);
                  }
               }}
               required
               className="w-full mt-2 p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300 [&::-webkit-inner-spin-button]:appearance-none"
               placeholder="0.00"
            />
         </div>
         <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
               type="date"
               id="startDate"
               value={startDate ? safeFormatDate(startDate.toISOString()) : ''}
               onChange={(e) => setStartDate(new Date(e.target.value))}
               required
               className="w-full mt-2 p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
            />
         </div>
         <div className="mt-6 flex justify-end">
            <button
               type="submit"
               disabled={isAddingToCalendar}
               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
               {isAddingToCalendar ? <Loader size="small" className="animate-spin" /> : 'Add to Calendar'}
            </button>
         </div>
      </form>
   )
}