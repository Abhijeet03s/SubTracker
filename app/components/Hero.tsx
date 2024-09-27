import Image from 'next/image';
import Link from 'next/link';
import { plusJakartaSans, zillaSlab } from '../fonts/fonts';
import { FaArrowRight } from 'react-icons/fa';

interface HeroProps {
   userId: string | null;
}

export default function Hero({ userId }: HeroProps) {
   return (
      <section className="bg-white text-black min-h-[calc(100vh-64px)] flex items-center">
         <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full py-8 sm:py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto w-full text-center relative z-10">
               <h1 className={`${zillaSlab.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10`}>
                  <span className="block">Never Miss a</span>
                  <span className="block">Subscription Renewal</span>
                  <span className="block mt-2">Again <span className="inline-block animate-bounce text-2xl sm:text-3xl md:text-4xl lg:text-5xl">🔔</span></span>
               </h1>
               <p className={`${plusJakartaSans.className} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-gray-600 max-w-3xl mx-auto`}>
                  Track, manage, and optimize your subscriptions with ease. SubTracker helps you stay on top of your recurring expenses.
               </p>
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                  {userId ? (
                     <Link href="/dashboard" className={`${plusJakartaSans.className} w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base md:text-lg flex items-center justify-center group`}>
                        Go to Dashboard
                        <FaArrowRight className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
                     </Link>
                  ) : (
                     <Link href="/sign-up" className={`${plusJakartaSans.className} w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base md:text-lg flex items-center justify-center group`}>
                        Start Tracking Now
                        <FaArrowRight className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
                     </Link>
                  )}
                  <Link href="#demo" className={`${plusJakartaSans.className} w-full sm:w-auto bg-white hover:bg-gray-100 text-black font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full border border-black transition duration-300 ease-in-out text-sm sm:text-base md:text-lg flex items-center justify-center`}>
                     Learn More
                  </Link>
               </div>
               <div className="relative w-full max-w-4xl mx-auto">
                  <Image
                     src="/dashboard-mockup.png"
                     alt="SubTrack Dashboard"
                     width={1200}
                     height={675}
                     className="rounded-lg shadow-2xl"
                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                     priority
                  />
               </div>
            </div>
         </div>
      </section>
   );
}
