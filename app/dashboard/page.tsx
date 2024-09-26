'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import SubscriptionForm from './SubscriptionForm'
import SubscriptionList from './SubscriptionList'
import { FaPlus, FaUserCircle } from 'react-icons/fa'

export default function DashboardPage() {
   const { user } = useUser()
   const [subscriptions, setSubscriptions] = useState([])
   const [showForm, setShowForm] = useState(false)

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

   return (
      <div className="container mx-auto p-6 bg-gray-50">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-700">Subscription Dashboard</h1>
            <div className="flex items-center space-x-4">
               <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition duration-300"
               >
                  <FaPlus className="mr-2" />
                  {showForm ? 'Hide Form' : 'Add Subscription'}
               </button>
               <div className="flex items-center text-gray-700">
                  <FaUserCircle className="text-2xl mr-2" />
                  <span>{user?.fullName || user?.username}</span>
               </div>
            </div>
         </div>

         {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
               <h2 className="text-xl font-semibold mb-4 text-indigo-600">Add New Subscription</h2>
               <SubscriptionForm onSubmit={addSubscription} />
            </div>
         )}

         <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">Your Subscriptions</h2>
            <SubscriptionList
               subscriptions={subscriptions}
               onUpdate={updateSubscription}
               onDelete={deleteSubscription}
            />
         </div>
      </div>
   )
}