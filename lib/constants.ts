import { FaClock, FaChartLine, FaBell, FaDesktop } from 'react-icons/fa';

// Chart Colors
export const baseChartColors = [
   'rgba(255, 99, 132, 0.8)',
   'rgba(54, 162, 235, 0.8)',
   'rgba(255, 206, 86, 0.8)',
   'rgba(75, 192, 192, 0.8)',
   'rgba(153, 102, 255, 0.8)',
   'rgba(255, 159, 64, 0.8)',
   'rgba(199, 199, 199, 0.8)',
   'rgba(83, 102, 255, 0.8)',
   'rgba(255, 102, 255, 0.8)',
   'rgba(102, 255, 178, 0.8)',
];

// Loader sizes
export const loaderSizes = {
   small: 'w-4 h-4',
   medium: 'w-6 h-6',
   large: 'w-8 h-8',
};

// Month Names
export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Features
export const features = [
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