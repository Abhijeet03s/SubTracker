import { useUser, SignedIn, SignedOut, SignInButton as ClerkSignInButton } from '@clerk/nextjs'

export default function SignInButton() {
   const { isLoaded } = useUser()

   if (!isLoaded) {
      return null
   }

   return (
      <>
         <SignedIn>
            <button
               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               onClick={() => {
                  window.location.href = '/sign-out'
               }}
            >
               Sign Out
            </button>
         </SignedIn>
         <SignedOut>
            <ClerkSignInButton>
               <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Sign In
               </button>
            </ClerkSignInButton>
         </SignedOut>
      </>
   )
}