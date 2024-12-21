'use client';

import Link from 'next/link';
import { plusJakartaSans, zillaSlab } from '../fonts/fonts';

export default function Footer() {
   return (
      <footer className="bg-rich-black text-white py-8 sm:py-12 md:pt-14 md:pb-8">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
               <div className="text-center sm:text-left">
                  <h3 className={`${zillaSlab.className} text-2xl font-semibold mb-2`}>SubTracker</h3>
                  <p className={`${plusJakartaSans.className} text-sm text-gray-400 max-w-xs mx-auto sm:mx-0`}>
                     Manage your subscriptions effortlessly.
                  </p>
               </div>
               <div>
                  <h4 className={`${zillaSlab.className} text-lg font-semibold mb-4`}>Quick Links</h4>
                  <ul className={`${plusJakartaSans.className} text-sm space-y-2`}>
                     <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                     <li><a href="#features" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => {
                        e.preventDefault();
                        document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
                     }}>Features</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className={`${zillaSlab.className} text-lg font-semibold mb-4`}>Legal</h4>
                  <ul className={`${plusJakartaSans.className} text-sm space-y-2`}>
                     <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                     <li><Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className={`${zillaSlab.className} text-lg font-semibold mb-4`}>Connect</h4>
                  <ul className={`${plusJakartaSans.className} text-sm space-y-2`}>
                     <li><a href="https://github.com/Abhijeet03s" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                     <li><a href="https://x.com/iabhi43" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">X</a></li>
                  </ul>
               </div>
            </div>
            <div className={`${plusJakartaSans.className} pt-6 sm:pt-8 border-t border-gray-800 text-center text-sm text-gray-400`}>
               © {new Date().getFullYear()} SubTracker. All rights reserved.
            </div>
         </div>
      </footer>
   );
}
