'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { plusJakartaSans } from '@/app/fonts/fonts';
import { useAddToCalendar } from '../hooks/useAddToCalendar'
import dynamic from 'next/dynamic'
import SubscriptionAnalytics from '../components/SubscriptionAnalytic'
import SubscriptionComparison from '../components/SubscriptionComparison'
import Modal from '../components/Modal'
import { FaPlus } from 'react-icons/fa'

const SubscriptionList = dynamic(() => import('./SubscriptionList'), { ssr: false })
const SubscriptionForm = dynamic(() => import('./SubscriptionForm'), { ssr: false })

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
   const [isModalOpen, setIsModalOpen] = useState(false)

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

   const addSubscription = async (newSubscription: Omit<Subscription, 'id'>) => {
      try {
         const response = await fetch('/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubscription),
         })
         if (response.ok) {
            await fetchSubscriptions()
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
      <div className='min-h-screen bg-gray-100 font-sans'>
         <div className={`${plusJakartaSans.className} container mx-auto p-6`}>
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight leading-none">
                     Subscription Dashboard
                  </h1>
               </div>
               <div className="flex items-center space-x-4">
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

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <SubscriptionAnalytics subscriptions={subscriptions as any} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">

                     <SubscriptionComparison subscriptions={subscriptions as any} />
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                     <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>
                     <SubscriptionList
                        subscriptions={subscriptions}
                        onUpdate={updateSubscription}
                        onDelete={deleteSubscription}
                        onSubscriptionsChange={setSubscriptions}
                        onCalendarUpdate={handleCalendarUpdate}
                     />
                  </div>
               </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
               <SubscriptionForm onSubmit={addSubscription} />
            </Modal>
         </div>
      </div>
   )
}