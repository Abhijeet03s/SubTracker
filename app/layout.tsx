import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'SubTrack',
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
        </ClerkProvider>
      </body>
    </html>
  );
}