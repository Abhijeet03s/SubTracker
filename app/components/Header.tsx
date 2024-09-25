import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { plusJakartaSans, zillaSlab } from '@/app/fonts/fonts';

export default async function Header() {
   const { userId } = auth();

   return (
      <header className='bg-[#1f1f1f] text-white'>
         <div className='container mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8'>
            <Link href='/' className={`${zillaSlab.className} text-xl sm:text-3xl font-bold`}>SubTrack</Link>

            <nav>
               {userId ? (
                  <div className='flex gap-4 sm:gap-6 items-center'>
                     <Link href='/dashboard' className='hover:text-gray-300 transition-colors font-semibold text-sm sm:text-base'>Dashboard</Link>
                     <UserButton />
                  </div>
               ) : (
                  <Link href='/sign-in' className={`${plusJakartaSans.className} bg-white text-black px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-200 transition-colors font-semibold text-sm sm:text-base`}>
                     Start Tracking
                  </Link>
               )}
            </nav>
         </div>
      </header>
   );
}