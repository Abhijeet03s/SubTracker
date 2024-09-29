'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import SubscriptionForm from './SubscriptionForm'
import SubscriptionList from './SubscriptionList'
import { useAddToCalendar } from '../hooks/useAddToCalendar'
import SubscriptionAnalytics from '../components/SubscriptionAnalytic'
import SubscriptionComparison from '../components/SubscriptionComparison'

interface Subscription {
   id: string;
   serviceName: string;
   trialEndDate: string;
   category: string;
   cost: number;
}

export default function DashboardPage() {
   const { user } = useUser()
   const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
   const { addToCalendar, updateCalendarEvent } = useAddToCalendar()

   useEffect(() => {
      fetchSubscriptions()
   }, [])

   const fetchSubscriptions = async () => {
      try {
         const response = await fetch('/api/subscriptions')
         if (response.ok) {
            const data: Subscription[] = await response.json()
            setSubscriptions(data)
         } else {
            console.error('Failed to fetch subscriptions')
         }
      } catch (error) {
         console.error('Error fetching subscriptions:', error)
      }
   }

   const addSubscription = async (newSubscription: Omit<Subscription, 'id'>) => {
      try {
         const response = await fetch('/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubscription),
         })
         if (response.ok) {
            await fetchSubscriptions()
         } else {
            console.error('Failed to add subscription', await response.text())
         }
      } catch (error) {
         console.error('Error adding subscription:', error)
      }
   }

   const updateSubscription = async (id: string, updatedData: Partial<Subscription>) => {
      try {
         const response = await fetch(`/api/subscriptions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
         })
         if (response.ok) {
            await fetchSubscriptions()
         } else {
            const errorData = await response.json()
            console.error('Failed to update subscription', errorData)
         }
      } catch (error) {
         console.error('Error updating subscription:', error)
      }
   }

   const deleteSubscription = async (id: string) => {
      try {
         const response = await fetch(`/api/subscriptions/${id}`, {
            method: 'DELETE',
         })
         if (response.ok) {
            await fetchSubscriptions()
         } else {
            console.error('Failed to delete subscription')
         }
      } catch (error) {
         console.error('Error deleting subscription:', error)
      }
   }

   const onSubscriptionsChange = (updatedSubscriptions: Subscription[]) => {
      setSubscriptions(updatedSubscriptions)
   }

   const handleCalendarUpdate = async (subscription: Subscription) => {
      try {
         await updateCalendarEvent({
            serviceName: subscription.serviceName,
            trialEndDate: subscription.trialEndDate,
         })
      } catch (error) {
         console.error('Error updating calendar event:', error)
      }
   }

   return (
      <div className='min-h-screen bg-gray-50'>
         <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
               <h1 className="text-3xl font-bold text-indigo-700">Subscription Dashboard</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
               <h2 className="text-xl font-semibold mb-4 text-indigo-600">Add New Subscription</h2>
               <SubscriptionForm onSubmit={addSubscription} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
               <h2 className="text-xl font-semibold mb-4 text-indigo-600">Your Subscriptions</h2>
               <SubscriptionList
                  subscriptions={subscriptions}
                  onUpdate={updateSubscription}
                  onDelete={deleteSubscription}
                  onSubscriptionsChange={onSubscriptionsChange}
                  onCalendarUpdate={handleCalendarUpdate}
               />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
               <SubscriptionAnalytics subscriptions={subscriptions as any} />
               <SubscriptionComparison subscriptions={subscriptions as any} />
            </div>
         </div>
      </div>
   )
}