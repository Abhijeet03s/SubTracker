"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { plusJakartaSans, zillaSlab } from '../fonts/fonts';
import { FaArrowRight } from "react-icons/fa";

interface HeroProps {
   userId: string | null;
}

export default function Hero({ userId }: HeroProps) {
   return (
      <section className="flex flex-col overflow-hidden">
         <div className="bg-rich-black text-white flex-grow flex flex-col justify-start md:justify-center items-center px-8 sm:px-6 lg:px-8 relative overflow-hidden w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-grid bg-grid-mask">
            <div className="w-full max-w-md sm:max-w-7xl mx-auto text-center relative z-10">
               <motion.h1
                  className={`${zillaSlab.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 sm:mb-10 md:mb-12 mt-8 md:mt-0`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
               >
                  <motion.span className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>Never Miss a</motion.span>
                  <motion.span className="block mt-0 md:mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>Subscription Renewal</motion.span>
                  <motion.span className="block mt-0 md:mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.4 }}>
                     Again
                     <motion.span
                        className="inline-block animate-ring text-4xl sm:text-4xl md:text-5xl lg:text-6xl ml-2 md:ml-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
                     >
                        🔔
                     </motion.span>
                  </motion.span>
               </motion.h1>
               <motion.p
                  className={`${plusJakartaSans.className} text-sm md:text-xl sm:max-w-3xl mb-10 sm:mb-12 md:mb-14 text-gray-300 mx-auto`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
               >
                  Effortlessly track, manage, and control your subscriptions with SubTracker, keeping you informed about all your recurring expenses
               </motion.p>
               <motion.div
                  className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-4 mb-12 sm:mb-14 md:mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
               >
                  {userId ? (
                     <Link href="/dashboard" className={`${plusJakartaSans.className} inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-700 text-white hover:bg-purple-800 px-12 py-2 h-12 md:h-14 text-base md:text-lg font-semibold group`}>
                        Dashboard
                        <FaArrowRight className="ml-3 transform translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300 ease-in-out" />
                     </Link>
                  ) : (
                     <Link href="/sign-up" className={`${plusJakartaSans.className} inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-700 text-white hover:bg-purple-800 px-12 py-2 h-12 md:h-14 text-base md:text-lg font-semibold group`}>
                        Start Tracking
                        <FaArrowRight className="ml-2" />
                     </Link>
                  )}
               </motion.div>
            </div>
            <motion.div
               className="relative w-full max-w-xl sm:max-w-7xl mx-auto overflow-hidden mt-8 sm:mt-12"
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.8 }}
            >
               <div className="relative w-full aspect-video">
                  <Image
                     src="/assets/subtracker-dashboard.png"
                     alt="SubTracker Dashboard"
                     className="rounded-lg shadow-2xl object-cover object-center"
                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                     fill
                     priority
                  />
               </div>
            </motion.div>
         </div>
      </section>
   );
}