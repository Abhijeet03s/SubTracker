import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Header from './components/Header';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('./components/Footer'), {
  loading: () => <div></div>
})

const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), {
  ssr: false
})

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