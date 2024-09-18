import { useState } from 'react'

interface SubscriptionFormProps {
   onSubmit: (subscription: { serviceName: string; trialEndDate: string }) => void
}

export default function SubscriptionForm({ onSubmit }: Readonly<SubscriptionFormProps>) {
   const [serviceName, setServiceName] = useState('')
   const [trialEndDate, setTrialEndDate] = useState('')
   const [isAddingToCalendar, setIsAddingToCalendar] = useState(false)

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit({ serviceName, trialEndDate })
      setServiceName('')
      setTrialEndDate('')
   }

   const handleAddToCalendar = async () => {
      try {
         const response = await fetch('/api/google-calendar');
         if (!response.ok) {
            throw new Error('Failed to get Google Calendar authorization URL');
         }
         const data = await response.json();
         if (data.authUrl) {
            window.location.href = data.authUrl;
         } else {
            throw new Error('No authorization URL returned');
         }
      } catch (error) {
         console.error('Error adding to Google Calendar:', error);
         // Handle the error (e.g., show an error message to the user)
      }
   }

   return (
      <form onSubmit={handleSubmit} className="mb-4">
         <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Service Name"
            className="border p-2 mr-2"
            required
         />
         <input
            type="date"
            value={trialEndDate}
            onChange={(e) => setTrialEndDate(e.target.value)}
            className="border p-2 mr-2"
            required
         />
         <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">
            Add Subscription
         </button>
         <button
            type="button"
            onClick={handleAddToCalendar}
            disabled={isAddingToCalendar}
            className="bg-green-500 text-white p-2 rounded"
         >
            {isAddingToCalendar ? 'Adding to Calendar...' : 'Add to Google Calendar'}
         </button>
      </form>
   )
}