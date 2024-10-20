'use client'

import { useState, useMemo } from 'react'
import { FaSearch, FaEllipsisH, FaChevronDown } from 'react-icons/fa'
import { EditSubscriptionsModal } from '../components/EditSubscriptionsModal'
import { formatDate } from '../utils/dateUtils'

interface Subscription {
   id: string;
   serviceName: string;
   startDate: string;
   endDate: string;
   category: string;
   cost: number;
   subscriptionType: string;
   calendarEventId?: string;
}

interface SubscriptionListProps {
   subscriptions: Subscription[]
   onUpdate: (id: string, data: Partial<Subscription>) => Promise<void>
   onDelete: (id: string) => Promise<void>
   onSubscriptionsChange: (updatedSubscriptions: Subscription[]) => void
   onCalendarUpdate: (subscription: Subscription) => Promise<void>
}

export default function SubscriptionList({
   subscriptions,
   onUpdate,
   onDelete,
   onSubscriptionsChange,
   onCalendarUpdate
}: SubscriptionListProps) {
   const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [searchTerm, setSearchTerm] = useState('')
   const [categoryFilter, setCategoryFilter] = useState('')
   const [costFilter, setCostFilter] = useState('')
   const [subscriptionTypeFilter, setSubscriptionTypeFilter] = useState('')

   const filteredSubscriptions = useMemo(() => {
      let filtered = subscriptions.filter(sub => {
         const matchesSearch = sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
         const matchesCategory = categoryFilter === '' || sub.category.toLowerCase() === categoryFilter.toLowerCase();
         const matchesType = subscriptionTypeFilter === '' || sub.subscriptionType.toLowerCase() === subscriptionTypeFilter.toLowerCase();
         return matchesSearch && matchesCategory && matchesType;
      });

      if (costFilter === 'lowToHigh') {
         filtered.sort((a, b) => a.cost - b.cost);
      } else if (costFilter === 'highToLow') {
         filtered.sort((a, b) => b.cost - a.cost);
      }

      return filtered;
   }, [subscriptions, searchTerm, categoryFilter, costFilter, subscriptionTypeFilter]);

   const handleOpenModal = (subscription: Subscription) => {
      setEditingSubscription(subscription)
      setIsModalOpen(true)
   }

   const handleCloseModal = () => {
      setEditingSubscription(null)
      setIsModalOpen(false)
   }

   const handleUpdate = async (updatedSubscription: Subscription) => {
      try {
         await onUpdate(updatedSubscription.id, updatedSubscription);
         const updatedSubscriptions = subscriptions.map(sub =>
            sub.id === updatedSubscription.id ? updatedSubscription : sub
         );
         onSubscriptionsChange(updatedSubscriptions);
         await onCalendarUpdate(updatedSubscription);
      } catch (error) {
         console.error('Error updating subscription:', error);
      }
   };

   const handleDelete = async (id: string) => {
      try {
         await onDelete(id);
         const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
         onSubscriptionsChange(updatedSubscriptions);
      } catch (error) {
         console.error('Error deleting subscription:', error);
      }
   };

   return (
      <div className="w-full mx-auto space-y-4">
         <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2 relative">
               <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
               />
               <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>

            <div className="w-full md:w-1/2 flex space-x-4">
               <div className="relative w-1/3">
                  <div className="relative">
                     <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full p-2 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 appearance-none text-center cursor-pointer"
                     >
                        <option value="" className="text-center">All Categories</option>
                        <option value="ecommerce">Ecommerce</option>
                        <option value="entertainment">Streaming</option>
                        <option value="gaming">Gaming</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="music">Music</option>
                        <option value="other">Other</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <FaChevronDown className="h-3 w-3" />
                     </div>
                  </div>
               </div>
               <div className="relative w-1/3">
                  <div className="relative">
                     <select
                        value={subscriptionTypeFilter}
                        onChange={(e) => setSubscriptionTypeFilter(e.target.value)}
                        className="w-full p-2 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 appearance-none text-center cursor-pointer"
                     >
                        <option value="" className="text-center">All Types</option>
                        <option value="trial">Trial</option>
                        <option value="monthly">Monthly</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <FaChevronDown className="h-3 w-3" />
                     </div>
                  </div>
               </div>
               <div className="relative w-1/3">
                  <select
                     value={costFilter}
                     onChange={(e) => setCostFilter(e.target.value)}
                     className="w-full p-2 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 appearance-none text-center cursor-pointer"
                  >
                     <option value="" className="text-center">All Costs</option>
                     <option value="lowToHigh">Low to High</option>
                     <option value="highToLow">High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                     <FaChevronDown className="h-3 w-3" />
                  </div>
               </div>
            </div>
         </div>

         {filteredSubscriptions.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">No subscriptions found</p>
         ) : (
            <div className="mt-8 overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Service
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Cost
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Start Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                           End Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-52">
                           Subscription Type
                        </th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {filteredSubscriptions.map((subscription) => (
                        <tr key={subscription.id} className="hover:bg-gray-100">
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm font-medium text-gray-900">{subscription.serviceName.charAt(0).toUpperCase() + subscription.serviceName.slice(1)}</div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-500">{subscription.category}</div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-500">₹{subscription.cost.toFixed(2)}</div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-500">
                                 {formatDate(subscription.startDate)}
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-500">
                                 {subscription.endDate ? formatDate(subscription.endDate) : 'N/A'}
                              </div>
                           </td>
                           <td className="px-4 py-4 whitespace-nowrap text-center w-24">
                              <div className="text-sm text-gray-500">
                                 {subscription.subscriptionType.charAt(0).toUpperCase() + subscription.subscriptionType.slice(1)}
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                              <button
                                 onClick={() => handleOpenModal(subscription)}
                                 className="text-gray-600 hover:text-gray-900"
                              >
                                 <FaEllipsisH className="h-3 w-3 rotate-90" />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         <EditSubscriptionsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            subscription={editingSubscription}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
         />
      </div>
   )
}
