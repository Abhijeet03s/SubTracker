import { SignIn } from '@clerk/nextjs'
import { plusJakartaSans } from '@/app/fonts/fonts';

export default function SignInPage() {
   return (
      <div className={`${plusJakartaSans.className} flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden`}>
         <SignIn appearance={{
            elements: {
               formButtonPrimary: {
                  fontSize: 16,
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: '#611BBD',
                  '&:hover, &:focus, &:active': {
                     backgroundColor: '#49247A',
                  },
               },
               formFieldInput: {
                  borderColor: '#E2E8F0',
                  '&:focus': {
                     borderColor: '#611BBD',
                     boxShadow: '0 0 0 1px #611BBD',
                  },
               },
               card: {
                  boxShadow: 'none',
               },
               oauthButtonPrimary: {
                  backgroundColor: '#1A1A1A',
                  color: '#FFFFFF',
                  '&:hover, &:focus, &:active': {
                     backgroundColor: '#000000',
                  },
               },
            },
         }} />
      </div>
   )
}