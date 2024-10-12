import React from 'react'
import Image from 'next/image'
import './globals.css'

export default function Loading() {
   return (
      <div className="flex flex-col justify-center items-center h-screen">
         <div className="animatePulse">
            <Image
               src="/subtrack-logo.png"
               alt="Website Logo"
               width={100}
               height={100}
               className="mb-4"
            />
         </div>
      </div>
   )
}
