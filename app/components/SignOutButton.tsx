import { SignedOut } from '@clerk/nextjs'

export default function SignOutButton() {
   return (
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
         <SignedOut>Sign Out</SignedOut>
      </button>
   )
}