import { useState } from 'react';
import { useAddToCalendar } from '../hooks/useAddToCalendar';
import { FaChevronDown, FaPlus } from 'react-icons/fa';
import { Loader } from '@/app/components/ui/loader';
import { parseDate } from '@/app/utils/dateUtils';

interface SubscriptionFormProps {
   onSubmit: (subscription: { serviceName: string; startDate: string; endDate: string; category: string; cost: number; subscriptionType: string }) => void
}

export default function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
   const [serviceName, setServiceName] = useState('')
   const [startDate, setStartDate] = useState('')
   const [category, setCategory] = useState('')
   const [cost, setCost] = useState('')
   const [subscriptionType, setSubscriptionType] = useState('trial')
   const { isAddingToCalendar } = useAddToCalendar()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!startDate) return;
      const startDateISO = parseDate(startDate);
      const endDateISO = parseDate(new Date(new Date(startDate).getTime() + (subscriptionType === 'trial' ? 6 : 29) * 24 * 60 * 60 * 1000).toISOString());
      const newSubscription = {
         serviceName,
         startDate: startDateISO,
         endDate: endDateISO,
         category: category.charAt(0).toUpperCase() + category.slice(1),
         cost: parseFloat(cost) || 0,
         subscriptionType,
      }
      await onSubmit(newSubscription)
      setServiceName('')
      setStartDate('')
      setCategory('')
      setCost('')
      setSubscriptionType('trial')
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Add Subscription</h2>
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
               value={startDate}
               onChange={(e) => setStartDate(e.target.value)}
               required
               className="w-full mt-2 p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
            />
         </div>
         <div>
            <label htmlFor="subscriptionType" className="block text-sm font-medium text-gray-700">Subscription Type</label>
            <select
               id="subscriptionType"
               value={subscriptionType}
               onChange={(e) => setSubscriptionType(e.target.value)}
               required
               className="w-full mt-2 p-2 pr-8 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300 appearance-none"
            >
               <option value="trial">7 Days Trial</option>
               <option value="monthly">30 Days Subscription</option>
            </select>
         </div>
         <div className="mt-8">
            <button
               type="submit"
               disabled={isAddingToCalendar}
               className="w-full px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
            >
               {isAddingToCalendar ? <Loader size="small" className="animate-spin mr-2" /> : <FaPlus className="mr-2" />}
               {isAddingToCalendar ? 'Adding to Calendar...' : 'Add Subscription'}
            </button>
         </div>
      </form>
   )
}
