import { useState } from 'react'

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

   const handleEdit = (subscription: Subscription) => {
      setEditId(subscription.id)
      setEditName(subscription.serviceName)
      setEditDate(subscription.trialEndDate)
   }

   const handleUpdate = () => {
      if (editId) {
         onUpdate(editId, { serviceName: editName, trialEndDate: editDate })
         setEditId(null)
      }
   }

   return (
      <ul>
         {subscriptions.map((subscription) => (
            <li key={subscription.id} className="border p-2 mb-2">
               {editId === subscription.id ? (
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
                     <button onClick={() => onDelete(subscription.id)} className="bg-red-500 text-white p-1 rounded">
                        Delete
                     </button>
                  </>
               )}
            </li>
         ))}
      </ul>
   )
}  