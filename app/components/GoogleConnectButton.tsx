import { useUser } from '@clerk/nextjs';

export function GoogleConnectButton() {
   const { user } = useUser();
   const isGoogleConnected = user?.externalAccounts.some(account => account.provider === 'google');

   if (isGoogleConnected) {
      return <p>Google account connected</p>;
   }

   const handleConnect = () => {
      user?.createExternalAccount({ strategy: 'oauth_google' })
         .then(() => {
            window.location.reload();
         })
         .catch((error) => {
            console.error('Error connecting Google account:', error);
         });
   };

   return (
      <button onClick={handleConnect} className="bg-blue-500 text-white p-2 rounded">
         Connect Google Account
      </button>
   );
}
