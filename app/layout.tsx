import './globals.css';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Header from './components/Header';
import { Toaster } from 'sonner';

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
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ClerkProvider>
      </body>
    </html>
  );
}