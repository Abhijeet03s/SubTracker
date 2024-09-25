import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SubTrack',
  description: 'Track and manage your OTT subscriptions effortlessly. Get notified before your free trials end so you never get charged unexpectedly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
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