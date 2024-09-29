import React, { useState, useMemo } from 'react'
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
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

   const categories = useMemo(() => {
      return Array.from(new Set(subscriptions.map(sub => sub.category)));
   }, [subscriptions]);

   const filteredSubscriptions = useMemo(() => {
      return subscriptions.filter(sub => {
         const matchesSearch = sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
         const matchesCategory = categoryFilter === '' || sub.category === categoryFilter;
         const matchesCost = costFilter === '' ||
            (costFilter === 'low' && sub.cost < 10) ||
            (costFilter === 'medium' && sub.cost >= 10 && sub.cost < 50) ||
            (costFilter === 'high' && sub.cost >= 50);

         return matchesSearch && matchesCategory && matchesCost;
      });
   }, [subscriptions, searchTerm, categoryFilter, costFilter]);

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

   return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
         <div className="mb-4 flex flex-wrap gap-4">
            <input
               type="text"
               placeholder="Search subscriptions..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="p-2 border rounded"
            />
            <select
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value)}
               className="p-2 border rounded"
            >
               <option value="">All Categories</option>
               {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
               ))}
            </select>
            <select
               value={costFilter}
               onChange={(e) => setCostFilter(e.target.value)}
               className="p-2 border rounded"
            >
               <option value="">All Costs</option>
               <option value="low">Low (&lt; $10)</option>
               <option value="medium">Medium ($10 - $50)</option>
               <option value="high">High (&gt; $50)</option>
            </select>
         </div>

         {filteredSubscriptions.length === 0 ? (
            <p>No subscriptions found matching your criteria.</p>
         ) : (
            <table className="w-full border-collapse">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r">Service</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r">Trial End Date</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r">Category</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r">Cost</th>
                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {filteredSubscriptions.map((subscription) => (
                     <tr key={subscription.id}>
                        <td className="px-6 py-4 whitespace-nowrap border-r">
                           {subscription.id === editId ? (
                              <input
                                 type="text"
                                 value={editName}
                                 onChange={(e) => setEditName(e.target.value)}
                                 className="w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 sm:text-sm transition duration-150 ease-in-out"
                                 autoFocus
                              />
                           ) : (
                              <span className="text-sm font-medium text-gray-900">{subscription.serviceName}</span>
                           )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r">
                           {subscription.id === editId ? (
                              <input
                                 type="date"
                                 value={editDate}
                                 onChange={(e) => setEditDate(e.target.value)}
                                 className="w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 sm:text-sm transition duration-150 ease-in-out"
                              />
                           ) : (
                              <span className="text-sm text-gray-500">{new Date(subscription.trialEndDate).toLocaleDateString()}</span>
                           )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r">
                           {subscription.id === editId ? (
                              <input
                                 type="text"
                                 value={editCategory}
                                 onChange={(e) => setEditCategory(e.target.value)}
                                 className="w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 sm:text-sm transition duration-150 ease-in-out"
                              />
                           ) : (
                              <span className="text-sm text-gray-500">{subscription.category}</span>
                           )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r">
                           {subscription.id === editId ? (
                              <input
                                 type="number"
                                 value={editCost}
                                 onChange={(e) => setEditCost(e.target.value)}
                                 className="w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 sm:text-sm transition duration-150 ease-in-out"
                              />
                           ) : (
                              <span className="text-sm text-gray-500">${subscription.cost.toFixed(2)}</span>
                           )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           {subscription.id === editId ? (
                              <div className="flex justify-end space-x-2">
                                 <button
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                 >
                                    {isUpdating ? (
                                       <Loader size="small" color="#E0E7FF" className="mr-2" />
                                    ) : (
                                       <FaSave className="w-4 h-4 mr-2" />
                                    )}
                                    Save
                                 </button>
                                 <button
                                    onClick={() => setEditId(null)}
                                    disabled={isUpdating}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                 >
                                    <FaTimes className="w-4 h-4 mr-2" />
                                    Cancel
                                 </button>
                              </div>
                           ) : (
                              <div className="flex justify-end space-x-2">
                                 <button
                                    onClick={() => handleEdit(subscription)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                 >
                                    <FaEdit className="w-4 h-4 mr-2" />
                                    Edit
                                 </button>
                                 <button
                                    onClick={() => handleDelete(subscription.id)}
                                    disabled={isDeleting === subscription.id}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                 >
                                    {isDeleting === subscription.id ? (
                                       <Loader size="small" color="#DC2626" className="mr-2" />
                                    ) : (
                                       <FaTrash className="w-4 h-4 mr-2" />
                                    )}
                                    Delete
                                 </button>
                              </div>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   )
}