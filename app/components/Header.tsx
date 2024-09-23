import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function Header() {
   const { userId } = auth();

   return (
      <div className='bg-gray-600 text-neutral-100'>
         <div className='container mx-auto flex items-center justify-between py-4 px-8'>
            <Link href='/'>Home</Link>
            <div>
               {userId ? (
                  <div className='flex gap-4 items-center'>
                     <Link href='/dashboard'>Dashboard</Link>
                     <UserButton />
                  </div>
               ) : (
                  <div className='flex gap-4 items-center'>
                     <Link href='/sign-up'>Sign up</Link>
                     <Link href='/sign-in'>Sign In</Link>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}