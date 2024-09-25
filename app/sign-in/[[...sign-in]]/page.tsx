import { SignIn } from '@clerk/nextjs'

export default function signin() {
   return (
      <div className='flex flex-col items-center justify-center h-screen'>
         <SignIn />
      </div>
   )
}