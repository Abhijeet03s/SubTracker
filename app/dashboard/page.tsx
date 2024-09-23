'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import SubscriptionForm from './SubscriptionForm'
import SubscriptionList from './SubscriptionList'

export default function DashboardPage() {
   // Will use to display the user's name, email, or other profile information within the Dashboard Page
   const { user } = useUser()
   const [subscriptions, setSubscriptions] = useState([])

   useEffect(() => {
      fetchSubscriptions()
   }, [])

   const fetchSubscriptions = async () => {
      try {
         const response = await fetch('/api/subscriptions')
         if (response.ok) {
            const data = await response.json()
            // console.log('Fetched subscriptions:', data)
            setSubscriptions(data)
         } else {
            console.error('Failed to fetch subscriptions')
         }
      } catch (error) {
         console.error('Error fetching subscriptions:', error)
      }
   }

   const addSubscription = async (newSubscription: any) => {
      try {
         // console.log('Adding new subscription:', newSubscription);
         const response = await fetch('/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubscription),
         })
         if (response.ok) {
            const data = await response.json();
            // console.log('Subscription added successfully:', data);
            fetchSubscriptions()
         } else {
            console.error('Failed to add subscription', await response.text())
         }
      } catch (error) {
         console.error('Error adding subscription:', error)
      }
   }

   const updateSubscription = async (id: string, updatedData: any) => {
      try {
         const response = await fetch(`/api/subscriptions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
         })
         if (response.ok) {
            fetchSubscriptions()
         } else {
            const errorData = await response.json()
            console.error('Failed to update subscription', errorData)
         }
      } catch (error) {
         console.error('Error updating subscription:', error)
      }
   }

   const deleteSubscription = async (id: any) => {
      try {
         const response = await fetch(`/api/subscriptions/${id}`, {
            method: 'DELETE',
         })
         if (response.ok) {
            fetchSubscriptions()
         } else {
            console.error('Failed to delete subscription')
         }
      } catch (error) {
         console.error('Error deleting subscription:', error)
      }
   }

   const handleAddToCalendar = async (subscription: any) => {
      try {
         const response = await fetch('/api/add-calendar-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
         })
         if (!response.ok) {
            throw new Error('Failed to add reminder to Google Calendar')
         }
      } catch (error) {
         console.error('Error adding to calendar:', error)
         throw error
      }
   }

   return (
      <div className="container mx-auto p-4">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Subscription Management</h1>
         </div>
         <SubscriptionForm onSubmit={addSubscription} />
         <SubscriptionList
            subscriptions={subscriptions}
            onUpdate={updateSubscription}
            onDelete={deleteSubscription}
            onAddToCalendar={handleAddToCalendar}
         />
      </div>
   )
}