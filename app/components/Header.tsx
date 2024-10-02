'use client'

import Link from 'next/link';
import { plusJakartaSans, zillaSlab } from '@/app/fonts/fonts';
import { UserButton, useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export default function Header() {
   const { isSignedIn } = useAuth();
   const pathname = usePathname();

   return (
      <header className='bg-gray-900 text-white sticky top-0 z-50'>
         <div className='container mx-auto flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 lg:px-8'>
            <Link href='/' className="flex items-center">
               <h1 className={`${zillaSlab.className} text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-500`}>
                  SubTracker
               </h1>
            </Link>
            <nav>
               {isSignedIn ? (
                  <div className='flex gap-3 sm:gap-4 items-center'>
                     <Link href={pathname === '/dashboard' ? '/' : '/dashboard'} className={`${plusJakartaSans.className} text-white p-2 sm:px-4 sm:py-2 font-semibold text-xs sm:text-base`}>
                        {pathname === '/dashboard' ? 'Home' : 'Dashboard'}
                     </Link>
                     <UserButton
                        appearance={{
                           elements: {
                              avatarBox: "w-8 h-8 sm:w-10 sm:h-10",
                              userButtonAvatarBox: "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-500 hover:border-purple-600 transition-colors",
                           },
                        }}
                     />
                  </div>
               ) : (
                  <Link href='/sign-in' className={`${plusJakartaSans.className} bg-purple-700 text-white px-3 py-2 rounded-md hover:bg-purple-800 transition-colors font-semibold text-xs sm:text-sm`}>
                     Get Started
                  </Link>
               )}
            </nav>
         </div>
      </header>
   );
}