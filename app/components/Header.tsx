import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { plusJakartaSans, zillaSlab } from '@/app/fonts/fonts';

export default async function Header() {
   const { userId } = auth();

   return (
      <header className='bg-gray-900 text-white sticky top-0 z-50'>
         <div className='container mx-auto flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 lg:px-8'>
            <Link href='/' className="flex items-center">
               <h1 className={`${zillaSlab.className} text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#ff00ff] bg-clip-text text-transparent`}>
                  SubTracker
               </h1>
            </Link>
            <nav>
               {userId ? (
                  <div className='flex gap-3 sm:gap-4 items-center'>
                     <Link href='/dashboard' className=' text-white p-2 sm:px-4 sm:py-2 font-semibold text-xs sm:text-base'>Dashboard</Link>
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