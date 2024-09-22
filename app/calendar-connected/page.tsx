'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CalendarConnected() {
   const router = useRouter()

   useEffect(() => {
      const timer = setTimeout(() => {
         router.push('/dashboard')
      }, 3000)

      return () => clearTimeout(timer)
   }, [router])

   return (
      <div className="flex flex-col items-center justify-center min-h-screen">
         <h1 className="text-2xl font-bold mb-4">Calendar Connected Successfully!</h1>
         <p>Redirecting you back to the dashboard...</p>
      </div>
   )
}
