import { useState } from 'react'
import { useAddToCalendar } from '../hooks/useAddToCalendar'
import { FaEdit, FaTrash, FaCalendarPlus, FaSave, FaTimes } from 'react-icons/fa'

interface Subscription {
   id: string
   serviceName: string
   trialEndDate: string
}

interface SubscriptionListProps {
   subscriptions: Subscription[]
   onUpdate: (id: string, data: Partial<Subscription>) => void
   onDelete: (id: string) => void
}

export default function SubscriptionList({ subscriptions, onUpdate, onDelete }: Readonly<SubscriptionListProps>) {
   const [editId, setEditId] = useState<string | null>(null)
   const [editName, setEditName] = useState('')
   const [editDate, setEditDate] = useState('')
   const { addToCalendar, isAddingToCalendar } = useAddToCalendar()

   const handleEdit = (subscription: Subscription) => {
      setEditId(subscription.id)
      setEditName(subscription.serviceName)
      setEditDate(new Date(subscription.trialEndDate).toISOString().split('T')[0])
   }

   const handleUpdate = () => {
      if (editId) {
         const isoDateFormatted = new Date(editDate).toISOString()
         onUpdate(editId, { serviceName: editName, trialEndDate: isoDateFormatted })
         setEditId(null)
      }
   }

   const handleAddToCalendar = async (subscription: Subscription) => {
      try {
         await addToCalendar({
            serviceName: subscription.serviceName,
            trialEndDate: subscription.trialEndDate
         });
      } catch (error) {
         console.error('Error adding to calendar:', error);
         alert('Failed to add event to calendar. Please try again later.');
      }
   }

   return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
         <table className="w-full border-collapse">
            <thead className="bg-gray-50">
               <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r">Trial End Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
               {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                     <td className="px-6 py-4 whitespace-nowrap border-r">
                        {subscription.id === editId ? (
                           <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                        ) : (
                           <span className="text-sm text-gray-500">{new Date(subscription.trialEndDate).toLocaleDateString()}</span>
                        )}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {subscription.id === editId ? (
                           <div className="flex justify-end space-x-2">
                              <button
                                 onClick={handleUpdate}
                                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                 <FaSave className="w-4 h-4 mr-2" />
                                 Save
                              </button>
                              <button
                                 onClick={() => setEditId(null)}
                                 className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                 onClick={() => onDelete(subscription.id)}
                                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                 <FaTrash className="w-4 h-4 mr-2" />
                                 Delete
                              </button>
                              <button
                                 onClick={() => handleAddToCalendar(subscription)}
                                 disabled={isAddingToCalendar}
                                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                 <FaCalendarPlus className="w-4 h-4 mr-2" />
                                 {isAddingToCalendar ? 'Adding...' : 'Calendar'}
                              </button>
                           </div>
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}