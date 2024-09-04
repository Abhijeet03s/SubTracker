import { SignUp } from '@clerk/nextjs'

export default function signup() {
   return (
      <div className='flex flex-col items-center justify-center h-screen'>
         <h1 className='text-4xl font-bold mb-5'>This is a Sign Up</h1>
         <SignUp />
      </div>
   )
}