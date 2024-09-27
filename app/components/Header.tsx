import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { plusJakartaSans } from '@/app/fonts/fonts';

export default async function Header() {
   const { userId } = auth();

   return (
      <>
         <header className='bg-gray-900 text-white'>
            <div className='container mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8'>
               <Link href='/'>
                  <Image src='/subtrack-logo.png' alt='SubTrack Logo' width={50} height={50} />
               </Link>
               <nav>
                  {userId ? (
                     <div className='flex gap-4 sm:gap-6 items-center'>
                        <Link href='/dashboard' className='bg-purple-700 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full hover:bg-purple-800 transition-colors font-semibold text-sm sm:text-base'>Dashboard</Link>
                        <UserButton
                           appearance={{
                              elements: {
                                 avatarBox: "w-10 h-10",
                                 userButtonAvatarBox: "w-10 h-10 rounded-full border-2 border-purple-500 hover:border-purple-600 transition-colors",
                              },
                           }}
                        />
                     </div>
                  ) : (
                     <Link href='/sign-in' className={`${plusJakartaSans.className} bg-purple-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-purple-800 transition-colors font-semibold text-sm sm:text-base`}>
                        Start Tracking
                     </Link>
                  )}
               </nav>
            </div>
         </header>
      </>
   );
}