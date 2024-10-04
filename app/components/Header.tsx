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
         <div className='container mx-auto flex items-center justify-between py-3 px-4 sm:py-3 sm:px-4 lg:py-4 lg:px-8'>
            <Link href='/' className="flex items-center">
               <h1 className={`${zillaSlab.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-500`}>
                  SubTracker
               </h1>
            </Link>
            <nav>
               {isSignedIn ? (
                  <div className='flex gap-2 sm:gap-3 lg:gap-4 items-center'>
                     <Link
                        href={pathname === '/dashboard' ? '/' : '/dashboard'}
                        className={`${plusJakartaSans.className} text-white p-2 sm:p-2 lg:px-4 lg:py-2 font-semibold text-sm sm:text-sm lg:text-base hidden sm:inline-block`}
                     >
                        {pathname === '/dashboard' ? 'Home' : 'Dashboard'}
                     </Link>
                     <UserButton
                        appearance={{
                           elements: {
                              avatarBox: "w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10",
                              userButtonAvatarBox: "w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-purple-500 hover:border-purple-600 transition-colors",
                           },
                        }}
                     />
                  </div>
               ) : (
                  <div className="flex items-center">
                     <Link
                        href='/sign-up'
                        className={`${plusJakartaSans.className} bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 sm:px-6 sm:py-2.5 lg:px-6 lg:py-3 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out font-medium text-sm sm:text-base lg:text-base flex items-center justify-center shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300`}
                     >
                        Get Started
                     </Link>
                  </div>
               )}
            </nav>
         </div>
      </header>
   );
}