"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { plusJakartaSans, zillaSlab } from '@/app/fonts/fonts';
import { FaArrowRight } from "react-icons/fa";
import { HeroProps } from '@/lib/types';

export default function Hero({ userId }: HeroProps) {
   return (
      <section className="flex flex-col overflow-hidden">
         <div className="bg-rich-black text-white flex flex-col items-center relative w-full py-12 md:py-20 bg-grid bg-grid-mask">
            <div className="w-full max-w-7xl mx-auto text-center relative z-10 px-8">
               <motion.h1
                  className={`${zillaSlab.className} text-4xl md:text-6xl font-bold mb-8 md:mb-12 mt-8 md:mt-0`}
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
                  className={`${plusJakartaSans.className} sm:max-w-3xl text-sm md:text-xl mb-10 md:mb-14 text-gray-300 mx-auto`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
               >
                  Effortlessly track, manage, and control your subscriptions with SubTracker, keeping you informed about all your recurring expenses
               </motion.p>
               <motion.div
                  className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12 md:mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
               >
                  {userId ? (
                     <Link href="/dashboard" className={`${plusJakartaSans.className} bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 sm:px-6 sm:py-2.5 lg:px-6 lg:py-3 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out font-medium text-sm sm:text-base lg:text-base flex items-center justify-center shadow-lg hover:shadow-2xl`}>
                        Dashboard
                        <FaArrowRight className="ml-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                     </Link>
                  ) : (
                     <Link href="/sign-up" className={`${plusJakartaSans.className} bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 sm:px-6 sm:py-2.5 lg:px-6 lg:py-3 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out font-medium text-sm sm:text-base lg:text-base flex items-center justify-center shadow-lg hover:shadow-2xl`}>
                        Start Tracking
                        <FaArrowRight className="ml-2" />
                     </Link>
                  )}
               </motion.div>
            </div>
            <motion.div
               className="px-2 relative w-full max-w-7xl mx-auto mt-8 sm:mt-12"
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.8 }}
            >
               <div className="relative w-full aspect-video rounded-lg shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-1">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                     <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="/SubTracker.mp4"
                     >
                        <source src="/SubTracker.mp4" type="video/mp4" />
                        <source src="/SubTracker.webm" type="video/webm" />
                        Your browser does not support the video tag.
                     </video>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>
   );
}