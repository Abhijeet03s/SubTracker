import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { plusJakartaSans, zillaSlab } from './fonts/fonts';

export default function Home() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className={`${zillaSlab.className} text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600`}>
          SubTrack
        </h1>
        <p className={`${plusJakartaSans.className} text-xl sm:text-2xl mb-8 text-gray-300`}>
          Never miss a subscription renewal again. Track, manage, and optimize your subscriptions with ease.
        </p>
        <div className="relative w-full max-w-2xl mx-auto mb-12">
          <Image
            src="/dashboard-mockup.png"
            alt="SubTrack Dashboard"
            width={800}
            height={450}
            className="rounded-lg shadow-2xl"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {userId ? (
            <Link href="/dashboard" className={`${plusJakartaSans.className} bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105`}>
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/sign-up" className={`${plusJakartaSans.className} bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105`}>
              Start Tracking Now
            </Link>
          )}
          <Link href="#features" className={`${plusJakartaSans.className} bg-transparent hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-full border border-white transition duration-300 ease-in-out`}>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}