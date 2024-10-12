'use client';

import { motion } from 'framer-motion';
import { FaClock, FaChartLine, FaBell, FaDesktop } from 'react-icons/fa';
import { plusJakartaSans, zillaSlab } from '../fonts/fonts';

const features = [
   {
      icon: FaClock,
      title: 'Smart Subscription Tracking',
      description: 'Effortlessly monitor all your subscriptions, including trial periods and short-term plans.',
      details: [
         'Centralized dashboard for all subscriptions',
         'Track 7-day trial periods and 1-month subscriptions',
         'Automatic categorization of subscriptions',
         'Customizable tags for easy organization',
      ],
   },
   {
      icon: FaChartLine,
      title: 'Insightful Analytics',
      description: 'Gain valuable insights into your spending habits with detailed charts and reports.',
      details: [
         'Monthly and yearly spending breakdowns',
         'Category-wise expense analysis',
         'Trend predictions and recommendations',
      ],
   },
   {
      icon: FaBell,
      title: 'Smart Notifications',
      description: 'Receive timely alerts through Google Calendar and email before subscription deadlines.',
      details: [
         'Seamless Google Calendar integration',
         'Customizable email notifications',
         'Adjustable reminder schedules',
      ],
   },
   {
      icon: FaDesktop,
      title: 'Responsive Design',
      description: 'Access SubTracker seamlessly across all your devices with our responsive web application.',
      details: [
         'Optimized for desktop, tablet, and mobile',
         'Consistent experience across all devices',
         'Real-time sync of your subscription data',
      ],
   },
];

const FeatureCard = ({ icon: Icon, title, description, details }: { icon: React.ElementType, title: string, description: string, details: string[] }) => (
   <motion.div
      className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
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
   return (
      <section className="py-12 sm:py-16 md:py-20 bg-white">
         <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.5 }}
               className="text-center mb-10 sm:mb-16"
            >
               <h2 className={`${zillaSlab.className} text-3xl sm:text-4xl font-bold text-gray-900 mb-4`}>
                  Manage Your Subscriptions
               </h2>
               <p className={`${plusJakartaSans.className} max-w-2xl mx-auto text-sm md:text-xl mb-10 sm:mb-12 md:mb-14 text-gray-600`}>
                  SubTracker offers a comprehensive set of tools to help you stay on top of your subscriptions and save money.
               </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
               {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
               ))}
            </div>
         </div>
      </section>
   );
}
