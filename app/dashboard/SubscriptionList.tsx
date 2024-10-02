'use client'

import { useState, useMemo, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Loader } from '../components/ui/loader'

interface Subscription {
   id: string
   serviceName: string
   trialEndDate: string
   category: string
   cost: number
}

interface SubscriptionListProps {
   subscriptions: Subscription[]
   onUpdate: (id: string, data: Partial<Subscription>) => void
   onDelete: (id: string) => void
   onSubscriptionsChange: (updatedSubscriptions: Subscription[]) => void
   onCalendarUpdate: (subscription: Subscription) => void
}

export default function SubscriptionList({ subscriptions, onUpdate, onDelete, onSubscriptionsChange, onCalendarUpdate }: Readonly<SubscriptionListProps>) {
   const [isClient, setIsClient] = useState(false);
   const [editId, setEditId] = useState<string | null>(null)
   const [editName, setEditName] = useState('')
   const [editDate, setEditDate] = useState('')
   const [editCategory, setEditCategory] = useState('')
   const [editCost, setEditCost] = useState('')
   const [isUpdating, setIsUpdating] = useState(false)
   const [isDeleting, setIsDeleting] = useState<string | null>(null)
   const [searchTerm, setSearchTerm] = useState('')
   const [categoryFilter, setCategoryFilter] = useState('')
   const [costFilter, setCostFilter] = useState('')

   const filteredSubscriptions = useMemo(() => {
      return subscriptions.filter(sub => {
         const matchesSearch = sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
         const matchesCategory = categoryFilter === '' || sub.category.toLowerCase() === categoryFilter.toLowerCase();
         const matchesCost = costFilter === '' ||
            (costFilter === 'low' && sub.cost < 10) ||
            (costFilter === 'medium' && sub.cost >= 10 && sub.cost < 50) ||
            (costFilter === 'high' && sub.cost >= 50);

         return matchesSearch && matchesCategory && matchesCost;
      });
   }, [subscriptions, searchTerm, categoryFilter, costFilter]);

   useEffect(() => {
      setIsClient(true);
   }, []);

   const handleEdit = (subscription: Subscription) => {
      setEditId(subscription.id)
      setEditName(subscription.serviceName)
      setEditDate(new Date(subscription.trialEndDate).toISOString().split('T')[0])
      setEditCategory(subscription.category)
      setEditCost(subscription.cost.toString())
   }

   const handleUpdate = async () => {
      if (editId) {
         setIsUpdating(true)
         try {
            const isoDateFormatted = new Date(editDate).toISOString()
            const updatedSubscription = {
               serviceName: editName,
               trialEndDate: isoDateFormatted,
               category: editCategory,
               cost: parseFloat(editCost)
            }
            const response = await fetch(`/api/subscriptions/${editId}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(updatedSubscription),
            });
            if (response.ok) {
               const updatedSubscriptionFromServer = await response.json();
               const updatedSubscriptions = subscriptions.map(sub =>
                  sub.id === editId ? { ...sub, ...updatedSubscriptionFromServer } : sub
               )
               onSubscriptionsChange(updatedSubscriptions)
               onCalendarUpdate(updatedSubscriptionFromServer)
               setEditId(null)
            } else {
               console.error('Failed to update subscription', await response.text());
            }
         } catch (error) {
            console.error('Error updating subscription:', error);
         } finally {
            setIsUpdating(false)
         }
      }
   }

   const handleDelete = async (id: string) => {
      setIsDeleting(id)
      try {
         await onDelete(id)
         const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id)
         onSubscriptionsChange(updatedSubscriptions)
      } finally {
         setIsDeleting(null)
      }
   }

   if (!isClient) {
      return null;
   }

   return (
      <>
         <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2 relative">
               <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
               />
               <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>

            <div className="w-full md:w-1/2 flex space-x-4">
               <div className="relative w-3/5">
                  <div className="relative">
                     <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full p-2 pr-8 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 appearance-none text-center cursor-pointer"
                     >
                        <option value="" className="text-center">All Categories</option>
                        <option value="ecommerce">Ecommerce</option>
                        <option value="entertainment">Streaming</option>
                        <option value="gaming">Gaming</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="music">Music</option>
                        <option value="other">Other</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                     </div>
                  </div>
               </div>
               <div className="relative w-2/5">
                  <select
                     value={costFilter}
                     onChange={(e) => setCostFilter(e.target.value)}
                     className="w-full p-2 pr-8 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 appearance-none text-center"
                  >
                     <option value="" className="text-center">All Costs</option>
                     <option value="low">Low (&lt; $10)</option>
                     <option value="medium">Medium ($10 - $50)</option>
                     <option value="high">High (&gt; $50)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                     </svg>
                  </div>
               </div>
            </div>
         </div>

         {filteredSubscriptions.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No subscriptions found matching your criteria.</p>
         ) : (
            <div className="overflow-x-auto rounded-t">
               <table className="w-full text-sm text-gray-500 table-fixed">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                     <tr>
                        {['Service', 'Category', 'Cost', 'Actions'].map((header) => (
                           <th key={header} scope="col" className="px-6 py-3 text-center w-1/4">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     {filteredSubscriptions.map((subscription, index) => (
                        <tr key={subscription.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b`}>
                           <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap overflow-hidden text-center">
                              {subscription.id === editId ? (
                                 <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full p-2 bg-slate-50 border-b-2 border-slate-300 focus:outline-none focus:border-slate-500 transition-colors duration-300 text-center"
                                    autoFocus
                                 />
                              ) : (
                                 subscription.serviceName
                              )}
                           </td>
                           <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap overflow-hidden text-center">
                              {subscription.id === editId ? (
                                 <input
                                    type="text"
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    className="w-full p-2 bg-slate-50 border-b-2 border-slate-300 focus:outline-none focus:border-slate-500 transition-colors duration-300 text-center"
                                 />
                              ) : (
                                 subscription.category
                              )}
                           </td>
                           <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap overflow-hidden text-center">
                              {subscription.id === editId ? (
                                 <input
                                    type="number"
                                    value={editCost}
                                    onChange={(e) => setEditCost(e.target.value)}
                                    className="w-full p-2 bg-slate-50 border-b-2 border-slate-300 focus:outline-none focus:border-slate-500 transition-colors duration-300 text-center [&::-webkit-inner-spin-button]:appearance-none"
                                 />
                              ) : (
                                 `$${subscription.cost.toFixed(2)}`
                              )}
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex justify-center space-x-2">
                                 {subscription.id === editId ? (
                                    <>
                                       <button
                                          onClick={handleUpdate}
                                          disabled={isUpdating}
                                          className="px-3 py-2 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:ring-2 focus:outline-none focus:ring-green-300"
                                       >
                                          {isUpdating ? <Loader size="small" className="animate-spin" /> : 'Save'}
                                       </button>
                                       <button
                                          onClick={() => setEditId(null)}
                                          disabled={isUpdating}
                                          className="px-3 py-2 text-xs font-medium text-gray-900 bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200"
                                       >
                                          Cancel
                                       </button>
                                    </>
                                 ) : (
                                    <>
                                       <button
                                          onClick={() => handleEdit(subscription)}
                                          className="px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300"
                                       >
                                          Edit
                                       </button>
                                       <button
                                          onClick={() => handleDelete(subscription.id)}
                                          disabled={isDeleting === subscription.id}
                                          className="px-3 py-2 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-300"
                                       >
                                          {isDeleting === subscription.id ? (
                                             <Loader size="small" className="animate-spin" />
                                          ) : (
                                             'Delete'
                                          )}
                                       </button>
                                    </>
                                 )}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )
         }
      </>
   )
}