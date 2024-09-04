import { SignIn } from '@clerk/nextjs'

export default function signin() {
   return (
      <div className='flex flex-col items-center justify-center h-screen'>
         <h1 className='text-4xl font-bold mb-5'>This is a Sign In</h1>
         <SignIn />
      </div>
   )
}