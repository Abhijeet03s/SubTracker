import './globals.css';
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Header from './components/Header';
import { Toaster } from 'sonner';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'SubTracker',
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
        >
          <Header />
          {children}
          <Footer />
          <Toaster position="top-center" />
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}