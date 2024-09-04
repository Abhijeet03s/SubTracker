import { useState } from 'react'

interface SubscriptionFormProps {
   onSubmit: (subscription: { serviceName: string; trialEndDate: string }) => void
}

export default function SubscriptionForm({ onSubmit }: Readonly<SubscriptionFormProps>) {
   const [serviceName, setServiceName] = useState('')
   const [trialEndDate, setTrialEndDate] = useState('')

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit({ serviceName, trialEndDate })
      setServiceName('')
      setTrialEndDate('')
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
         <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Subscription
         </button>
      </form>
   )
}