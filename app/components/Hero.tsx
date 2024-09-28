import Image from 'next/image';
import Link from 'next/link';
import { plusJakartaSans, zillaSlab } from '../fonts/fonts';
import { FaArrowRight } from 'react-icons/fa';

interface HeroProps {
   userId: string | null;
}

export default function Hero({ userId }: HeroProps) {
   return (
      <section className="min-h-screen flex flex-col">
         <div className="bg-rich-black text-white flex-grow flex flex-col justify-start md:justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full py-4 sm:py-8 md:py-12 lg:py-16">
            <div className="max-w-7xl mx-auto w-full text-center relative z-10 bg-grid bg-grid-mask">
               <h1 className={`${zillaSlab.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 mt-16 md:mt-0`}>
                  <span className="block">Never Miss a</span>
                  <span className="block">Subscription Renewal</span>
                  <span className="block mt-2">Again <span className="inline-block animate-ring text-2xl sm:text-3xl md:text-4xl lg:text-5xl">🔔</span></span>
               </h1>
               <p className={`${plusJakartaSans.className} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 md:mb-10 text-gray-400 max-w-3xl mx-auto`}>
                  Track, manage, and optimize your subscriptions with ease. SubTracker helps you stay on top of your recurring expenses.
               </p>
               <div className="flex flex-row justify-center items-center gap-4 mb-8 sm:mb-10 md:mb-12">
                  {userId ? (
                     <Link href="/dashboard" className={`${plusJakartaSans.className} bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out text-sm sm:text-base flex items-center justify-center group`}>
                        Dashboard
                        <FaArrowRight className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
                     </Link>
                  ) : (
                     <Link href="/sign-up" className={`${plusJakartaSans.className} bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out text-sm sm:text-base flex items-center justify-center group`}>
                        Start Now
                        <FaArrowRight className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
                     </Link>
                  )}
                  <Link href="#demo" className={`${plusJakartaSans.className} bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 sm:px-6 rounded-full border border-black transition duration-300 ease-in-out text-sm sm:text-base flex items-center justify-center`}>
                     Learn More
                  </Link>
               </div>
               <div className="relative w-full max-w-4xl mx-auto">
                  <Image
                     src="/dashboard-mockup.png"
                     alt="SubTrack Dashboard"
                     width={1200}
                     height={675}
                     className="rounded-lg shadow-2xl w-full h-auto"
                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                     priority
                  />
               </div>
            </div>
         </div>
      </section>
   );
}
