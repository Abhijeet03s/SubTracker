'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { FaClock, FaChartLine, FaBell, FaDesktop } from 'react-icons/fa';
import { plusJakartaSans, zillaSlab } from '@/app/fonts/fonts';

const features = [
   {
      icon: FaClock,
      title: 'Smart Subscription Tracking',
      description: 'Effortlessly monitor all your subscriptions, including trial periods and short-term plans.',
      details: [
         'Centralized dashboard for all subscriptions',
         'Track 7-day trial periods and 1-month subscriptions',
         'Automatic categorization of subscriptions',
      ],
   },
   {
      icon: FaChartLine,
      title: 'Insightful Analytics',
      description: 'Gain valuable insights into your spending habits with detailed charts and reports.',
      details: [
         'Monthly and yearly spending breakdowns',
         'Category-wise expense analysis',
      ],
   },
   {
      icon: FaBell,
      title: 'Smart Notifications',
      description: 'Receive timely alerts through Google Calendar and Email before subscription deadlines.',
      details: [
         'Subscriptions synced with Google Calendar for tracking',
         'Email reminders sent a day before deadlines',
      ],
   },
   {
      icon: FaDesktop,
      title: 'Responsive Design',
      description: 'Access SubTracker seamlessly across all your devices with our responsive web application.',
      details: [
         'Optimized for desktop, tablet, and mobile',
         'Consistent experience across all devices',
      ],
   },
];

const FeatureCard = ({ icon: Icon, title, description, details }: { icon: React.ElementType, title: string, description: string, details: string[] }) => (
   <motion.div
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
   >
      <div className="flex items-center mb-4">
         <div className="p-2 sm:p-3 rounded-full mr-3 sm:mr-4" style={{ backgroundColor: getIconColor(title) }}>
            <Icon className="text-xl sm:text-2xl text-white" />
         </div>
         <h3 className={`${zillaSlab.className} text-lg sm:text-xl font-semibold text-gray-800`}>{title}</h3>
      </div>
      <p className={`${plusJakartaSans.className} text-sm sm:text-base text-gray-600 mb-4`}>{description}</p>
      <ul className="space-y-2">
         {details.map((detail, index) => (
            <li key={index} className="flex items-start">
               <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
               </svg>
               <span className={`${plusJakartaSans.className} text-sm sm:text-base text-gray-700`}>{detail}</span>
            </li>
         ))}
      </ul>
   </motion.div>
);

function getIconColor(title: string) {
   switch (title) {
      case 'Smart Subscription Tracking': return '#9333ea';
      case 'Insightful Analytics': return '#22c55e';
      case 'Smart Notifications': return '#eab308';
      case 'Responsive Design': return '#3b82f6';
      default: return '#6b7280';
   }
}

export default function Features() {
   const { scrollYProgress } = useScroll();
   const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

   return (
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-100 relative overflow-hidden">
         <motion.div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-100 to-transparent" style={{ y }} />
         <div className="container mx-auto sm:max-w-7xl px-4 sm:px-4 relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.5 }}
               className="text-center mb-16 md:mb-24"
            >
               <h2 className={`${zillaSlab.className} text-3xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight`}>
                  Manage Your Subscriptions <span className="text-purple-600">Effortlessly</span>
               </h2>
               <p className={`${plusJakartaSans.className} max-w-3xl mx-auto text-sm sm:text-xl mb-10 text-gray-600`}>
                  SubTracker offers a comprehensive set of tools to help you stay on top of your subscriptions and save money.
               </p>
               <motion.div
                  className="w-24 h-0.5 sm:h-1 bg-purple-600 mx-auto"
                  initial={{ width: 0 }}
                  whileInView={{ width: 96 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
               />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
               {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
               ))}
            </div>
         </div>
      </section>
   );
}
