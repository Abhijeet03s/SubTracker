import { useState } from 'react'
import { useAddToCalendar } from '../hooks/useAddToCalendar'

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
      <div>
         {subscriptions.map((subscription) => (
            <div key={subscription.id} className="subscription-item">
               {subscription.id === editId ? (
                  <>
                     <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border p-1 mr-2"
                     />
                     <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="border p-1 mr-2"
                     />
                     <button onClick={handleUpdate} className="bg-green-500 text-white p-1 rounded mr-2">
                        Save
                     </button>
                     <button onClick={() => setEditId(null)} className="bg-gray-500 text-white p-1 rounded">
                        Cancel
                     </button>
                  </>
               ) : (
                  <>
                     <span>{subscription.serviceName} - {new Date(subscription.trialEndDate).toLocaleDateString()}</span>
                     <button onClick={() => handleEdit(subscription)} className="bg-yellow-500 text-white p-1 rounded ml-2 mr-2">
                        Edit
                     </button>
                     <button onClick={() => onDelete(subscription.id)} className="bg-red-500 text-white p-1 rounded mr-2">
                        Delete
                     </button>
                     <button
                        onClick={() => handleAddToCalendar(subscription)}
                        disabled={isAddingToCalendar}
                        className="bg-blue-500 text-white p-1 rounded"
                     >
                        {isAddingToCalendar ? 'Adding...' : 'Add to Calendar'}
                     </button>
                  </>
               )}
            </div>
         ))}
      </div>
   )
}