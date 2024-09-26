import { SignIn } from '@clerk/nextjs'
import { plusJakartaSans } from '@/app/fonts/fonts';

export default function signin() {
   return (
      <div className={`${plusJakartaSans.className} flex flex-col items-center justify-center min-h-screen bg-rich-black`}>
         <div className='w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-xl'>
            <SignIn appearance={{
               elements: {
                  card: 'bg-gray-800',
                  headerTitle: 'text-white',
                  headerSubtitle: 'text-gray-300',
                  socialButtonsBlockButton: 'border-white text-white',
                  footerActionLink: 'text-purple-400 hover:text-purple-300',
               },
            }} />
         </div>
      </div>
   )
}