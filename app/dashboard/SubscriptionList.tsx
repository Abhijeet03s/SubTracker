'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { FaSearch, FaEllipsisH, FaChevronDown } from 'react-icons/fa'
import { EditSubscriptionsModal } from '@/app/components/EditSubscriptionsModal'
import { formatDate } from '@/app/utils/dateUtils'
import { useSubscriptionSuggestions } from '@/app/hooks/useSubscriptionSuggestions'
import { SubscriptionListProps, Subscription } from '@/lib/types'

type SubscriptionType = 'trial' | 'monthly';
type CategoryType = 'ecommerce' | 'entertainment' | 'gaming' | 'lifestyle' | 'music' | 'other';
type DateStatus = 'expired' | 'ending-soon' | 'active' | 'not-applicable';

const categoryColors: Record<CategoryType, string> = {
   ecommerce: 'bg-purple-100 text-purple-800',
   entertainment: 'bg-blue-100 text-blue-800',
   gaming: 'bg-green-100 text-green-800',
   lifestyle: 'bg-yellow-100 text-yellow-800',
   music: 'bg-pink-100 text-pink-800',
   other: 'bg-gray-100 text-gray-800'
};

const subscriptionTypeColors: Record<SubscriptionType, string> = {
   trial: 'bg-red-100 text-red-800',
   monthly: 'bg-emerald-100 text-emerald-800'
};

const dateStatusColors: Record<DateStatus, string> = {
   expired: 'bg-red-50 text-red-700',
   'ending-soon': 'bg-yellow-50 text-yellow-700',
   active: 'bg-green-50 text-green-700',
   'not-applicable': 'bg-gray-50 text-gray-600'
};

const getDateStatus = (endDate: string | null): DateStatus => {
   if (!endDate) return 'not-applicable';

   const end = new Date(endDate);
   const now = new Date();
   const daysUntilEnd = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

   if (daysUntilEnd < 0) return 'expired';
   if (daysUntilEnd <= 7) return 'ending-soon';
   return 'active';
};

export default function SubscriptionList({
   subscriptions,
   onUpdate,
   onDelete,
   onSubscriptionsChange,
   onCalendarUpdate
}: SubscriptionListProps) {
   const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [categoryFilter, setCategoryFilter] = useState('')
   const [subscriptionTypeFilter, setSubscriptionTypeFilter] = useState('')
   const suggestionsRef = useRef<HTMLDivElement>(null)

   const {
      searchTerm,
      suggestions,
      showSuggestions,
      setShowSuggestions,
      handleSearchChange,
      handleSuggestionClick,
      handleKeyDown,
      selectedSuggestionIndex
   } = useSubscriptionSuggestions(subscriptions)

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
            setShowSuggestions(false)
         }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [setShowSuggestions])

   const filteredSubscriptions = useMemo(() => {
      return subscriptions.filter(sub => {
         const matchesSearch = sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
         const matchesCategory = categoryFilter === '' || sub.category.toLowerCase() === categoryFilter.toLowerCase();
         const matchesType = subscriptionTypeFilter === '' || sub.subscriptionType.toLowerCase() === subscriptionTypeFilter.toLowerCase();
         return matchesSearch && matchesCategory && matchesType;
      }).sort((a, b) => {
         if (categoryFilter === 'lowToHigh') return a.cost - b.cost;
         if (categoryFilter === 'highToLow') return b.cost - a.cost;
         return 0;
      });
   }, [subscriptions, searchTerm, categoryFilter, subscriptionTypeFilter]);

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
         <h2 className="text-xl sm:text-2xl font-semibold mb-6">Manage Your Subscriptions</h2>
         <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2 relative">
               <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full p-2 pl-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
               />
               <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
               {showSuggestions && suggestions.length > 0 && (
                  <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                     {suggestions.map((suggestion, index) => (
                        <div
                           key={index}
                           className={`px-4 py-2 cursor-pointer ${index === selectedSuggestionIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
                              }`}
                           onClick={() => handleSuggestionClick(suggestion)}
                        >
                           {suggestion}
                        </div>
                     ))}
                  </div>
               )}
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
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[subscription.category.toLowerCase() as CategoryType] || 'bg-gray-100 text-gray-800'
                                 }`}>
                                 {subscription.category}
                              </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="inline-flex items-center justify-center">
                                 <span className="text-sm font-medium text-gray-900">
                                    ₹{subscription.cost.toFixed(2)}
                                 </span>
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-500">
                                 {formatDate(subscription.startDate)}
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dateStatusColors[getDateStatus(subscription.endDate)]
                                 }`}>
                                 {subscription.endDate ? formatDate(subscription.endDate) : 'N/A'}
                              </span>
                           </td>
                           <td className="px-4 py-4 whitespace-nowrap text-center w-24">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriptionTypeColors[subscription.subscriptionType.toLowerCase() as SubscriptionType] || 'bg-gray-100 text-gray-800'
                                 }`}>
                                 {subscription.subscriptionType.charAt(0).toUpperCase() + subscription.subscriptionType.slice(1)}
                              </span>
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
