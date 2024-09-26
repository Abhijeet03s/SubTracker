import Image from 'next/image';
import Link from 'next/link';
import { plusJakartaSans, zillaSlab } from '../fonts/fonts';

interface HeroProps {
   userId: string | null;
}

export default function Hero({ userId }: HeroProps) {
   return (
      <>
         <div className='min-h-screen'>
            <section className="bg-rich-black text-white">
               <div className="bg-grid bg-grid-mask flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-20">
                  <div className="max-w-7xl mx-autow-full text-center relative z-10">
                     <h1 className={`${zillaSlab.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#ff00ff]`}>
                        SubTrack
                     </h1>
                     <p className={`${plusJakartaSans.className} text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-300 max-w-3xl mx-auto`}>
                        Never miss a subscription renewal again. Track, manage, and optimize your subscriptions with ease.
                     </p>
                     <div className="relative w-full max-w-4xl mx-auto mb-8 sm:mb-12">
                        <Image
                           src="/dashboard-mockup.png"
                           alt="SubTrack Dashboard"
                           width={1200}
                           height={675}
                           className="rounded-lg shadow-2xl"
                           layout="responsive"
                        />
                     </div>
                     <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        {userId ? (
                           <Link href="/dashboard" className={`${plusJakartaSans.className} bg-purple-400 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base`}>
                              Go to Dashboard
                           </Link>
                        ) : (
                           <Link href="/sign-up" className={`${plusJakartaSans.className} bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base`}>
                              Start Tracking Now
                           </Link>
                        )}
                        <Link href="#features" className={`${plusJakartaSans.className} bg-transparent hover:bg-white/10 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full border border-white transition duration-300 ease-in-out text-sm sm:text-base`}>
                           Learn More
                        </Link>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
}
