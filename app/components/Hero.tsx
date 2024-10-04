import Image from 'next/image';
import Link from 'next/link';
import { plusJakartaSans, zillaSlab } from '../fonts/fonts';
import { FaArrowRight } from 'react-icons/fa';
import { HiMiniArrowDownTray } from "react-icons/hi2";

interface HeroProps {
   userId: string | null;
}

export default function Hero({ userId }: HeroProps) {
   return (
      <section className="min-h-screen flex flex-col">
         <div className="bg-rich-black text-white flex-grow flex flex-col justify-start md:justify-center items-center px-8 sm:px-6 lg:px-8 relative overflow-hidden w-full py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="w-full max-w-[90%] sm:max-w-7xl mx-auto text-center relative z-10 bg-grid bg-grid-mask">
               <h1 className={`${zillaSlab.className} text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 sm:mb-10 md:mb-12 mt-8 md:mt-0`}>
                  <span className="block">Never Miss a</span>
                  <span className="block">Subscription Renewal</span>
                  <span className="block mt-2">Again <span className="inline-block animate-ring text-4xl sm:text-4xl md:text-5xl lg:text-6xl">🔔</span></span>
               </h1>
               <p className={`${plusJakartaSans.className} text-lg sm:text-lg md:text-2xl mb-10 sm:mb-12 md:mb-14 text-gray-300 max-w-3xl mx-auto`}>
                  Effortlessly track, manage, and control your subscriptions with SubTracker, keeping you informed about all your recurring expenses
               </p>
               <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-4 mb-12 sm:mb-14 md:mb-16">
                  {userId ? (
                     <Link href="/dashboard" className={`${plusJakartaSans.className} bg-purple-700 hover:bg-purple-800 text-white font-medium py-4 sm:py-4 px-8 sm:px-10 rounded-full transition duration-300 ease-in-out text-lg sm:text-xl flex items-center justify-center group w-full sm:w-auto`}>
                        Dashboard
                        <FaArrowRight className="ml-3 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
                     </Link>
                  ) : (
                     <Link href="/sign-up" className={`${plusJakartaSans.className} bg-purple-700 hover:bg-purple-800 text-white font-medium py-4 sm:py-4 px-8 sm:px-10 rounded-full transition duration-300 ease-in-out text-lg sm:text-xl flex items-center justify-center group w-full sm:w-auto`}>
                        Start Tracking
                        <FaArrowRight className="ml-3 transform translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300 ease-in-out" />
                     </Link>
                  )}
                  <Link href="#demo" className={`${plusJakartaSans.className} bg-white hover:bg-gray-100 text-black font-medium py-4 sm:py-4 px-8 sm:px-10 rounded-full border border-black transition duration-300 ease-in-out text-lg sm:text-xl flex items-center justify-center group w-full sm:w-auto`}>
                     Learn More
                     <HiMiniArrowDownTray className="ml-2 transform translate-y-0 group-hover:translate-x-0.5 transition-transform duration-300 ease-in-out -rotate-90" />
                  </Link>
               </div>
            </div>
            <div className="relative w-full max-w-[110%] sm:max-w-5xl mx-auto overflow-hidden">
               <Image
                  src="/subtracker-dashboard.png"
                  alt="SubTrack Dashboard"
                  width={1200}
                  height={675}
                  className="rounded-lg shadow-2xl w-full h-auto"
                  sizes="(max-width: 640px) 110vw, (max-width: 1024px) 90vw, 1200px"
                  priority
               />
            </div>
         </div>
      </section>
   );
}
