'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { plusJakartaSans } from '@/app/fonts/fonts';
import { useAddToCalendar } from '../hooks/useAddToCalendar';
import dynamic from 'next/dynamic'
import SubscriptionAnalytics from './SubscriptionAnalytic'
import SubscriptionComparison from './SubscriptionComparison'
import { FaPlus } from 'react-icons/fa'
import Modal from '@/app/components/Modal'

const SubscriptionList = dynamic(() => import('./SubscriptionList'), { ssr: false })
const SubscriptionForm = dynamic(() => import('../components/AddSubscriptionForm'), { ssr: false })

interface Subscription {
   id: string;
   serviceName: string;
   startDate: string;
   endDate: string;
   category: string;
   cost: number;
   subscriptionType: string;
   calendarEventId?: string;
}

export default function DashboardPage() {
   const { user } = useUser()
   const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
   const [isModalOpen, setIsModalOpen] = useState(false)

   const { upsertCalendarEvent } = useAddToCalendar();

   const fetchSubscriptions = useCallback(async () => {
      try {
         const response = await fetch(`/api/subscriptions?userId=${user?.id}`)
         if (response.ok) {
            const data: Subscription[] = await response.json()
            setSubscriptions(data)
         } else {
            console.error('Failed to fetch subscriptions')
         }
      } catch (error) {
         console.error('Error fetching subscriptions:', error)
      }
   }, [user?.id])

   useEffect(() => {
      if (user) {
         fetchSubscriptions()
      }
   }, [user, fetchSubscriptions])

   const addSubscription = async (newSubscription: Omit<Subscription, 'id' | 'calendarEventId'>) => {
      try {
         const response = await fetch('/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubscription),
         })
         if (response.ok) {
            const createdSubscription: Subscription = await response.json();
            setSubscriptions([...subscriptions, createdSubscription]);
            setIsModalOpen(false)
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
            const updatedSubscription: Subscription = await response.json();
            const updatedSubscriptions = subscriptions.map(sub =>
               sub.id === updatedSubscription.id ? updatedSubscription : sub
            );
            setSubscriptions(updatedSubscriptions);
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
            const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
            setSubscriptions(updatedSubscriptions);
         } else {
            console.error('Failed to delete subscription', await response.text())
         }
      } catch (error) {
         console.error('Error deleting subscription:', error)
      }
   }

   const handleCalendarUpdate = async (subscription: Subscription) => {
      try {
         const eventId = await upsertCalendarEvent({
            serviceName: subscription.serviceName,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            category: subscription.category,
            cost: subscription.cost,
            subscriptionType: subscription.subscriptionType,
            calendarEventId: subscription.calendarEventId,
         });
         if (eventId && eventId !== subscription.calendarEventId) {
            await updateSubscription(subscription.id, { calendarEventId: eventId });
         }
      } catch (error) {
         console.error('Error upserting calendar event:', error);
      }
   };

   return (
      <div className='min-h-screen bg-gray-100'>
         <div className={`${plusJakartaSans.className} container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8`}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
               <div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-700 tracking-tight leading-none">
                     Subscription Dashboard
                  </h1>
               </div>
               <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <div className="flex flex-row w-full justify-between items-center space-x-0 sm:space-x-4">
                     {user && (
                        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                           <p className="text-gray-800 font-semibold">
                              Welcome, <span className="text-indigo-600">{user?.firstName || user?.username}</span>!
                           </p>
                        </div>
                     )}
                     <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
                     >
                        <FaPlus className="mr-2" />
                        Add Sub
                     </button>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="my-10">
                  <SubscriptionAnalytics subscriptions={subscriptions as any} />
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                     <SubscriptionComparison subscriptions={subscriptions as any} />
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                     <h2 className="text-xl sm:text-2xl font-semibold mb-4">Your Subscriptions</h2>
                     <SubscriptionList
                        subscriptions={subscriptions as any}
                        onUpdate={updateSubscription}
                        onDelete={deleteSubscription}
                        onSubscriptionsChange={setSubscriptions as any}
                        onCalendarUpdate={handleCalendarUpdate as any}
                     />
                  </div>
               </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
               <SubscriptionForm onSubmit={addSubscription as any} />
            </Modal>
         </div>
      </div>
   )
}
