import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Header from './components/Header';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'SubTally',
  description: 'Track and manage your subscriptions effortlessly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <ClerkProvider
          appearance={{
            elements: {
              footer: 'hidden',
            },
          }}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <Header />
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}