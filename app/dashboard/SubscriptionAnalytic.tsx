import { useState } from 'react';
import { CurrencyDollarIcon, UsersIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/solid';

interface Subscription {
   id: string;
   serviceName: string;
   startDate: string;
   endDate: string;
   category: string;
   cost: number;
   subscriptionType: string;
   calendarEventId?: string;
}

interface SubscriptionAnalyticsProps {
   subscriptions: Subscription[];
}

interface MonthlyData {
   totalCost: number;
   activeSubscriptions: number;
   mostExpensiveSub: Subscription | null;
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function SubscriptionAnalytics({ subscriptions }: SubscriptionAnalyticsProps) {
   const currentDate = new Date();
   const currentYear = currentDate.getFullYear();
   const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

   const getMonthlyData = (month: number, year: number): MonthlyData => {
      return subscriptions.reduce<MonthlyData>((acc, sub) => {
         const startDate = new Date(sub.startDate);
         if (startDate.getFullYear() === year && startDate.getMonth() === month) {
            acc.totalCost += sub.cost;
            acc.activeSubscriptions++;
            if (!acc.mostExpensiveSub || sub.cost > acc.mostExpensiveSub.cost) {
               acc.mostExpensiveSub = sub;
            }
         }
         return acc;
      }, { totalCost: 0, activeSubscriptions: 0, mostExpensiveSub: null });
   };

   const currentMonthData = getMonthlyData(selectedMonth, currentYear);
   const previousMonthData = getMonthlyData(
      selectedMonth - 1 < 0 ? 11 : selectedMonth - 1,
      selectedMonth - 1 < 0 ? currentYear - 1 : currentYear
   );

   const totalMonthlyCost = currentMonthData.totalCost;
   const activeSubscriptions = currentMonthData.activeSubscriptions;
   const costChangePercentage = previousMonthData.totalCost !== 0
      ? ((currentMonthData.totalCost - previousMonthData.totalCost) / previousMonthData.totalCost * 100).toFixed(1)
      : '0.0';
   const subscriptionChangeCount = currentMonthData.activeSubscriptions - previousMonthData.activeSubscriptions;
   const averageCost = activeSubscriptions > 0 ? totalMonthlyCost / activeSubscriptions : 0;

   const analyticsItems = [
      {
         title: 'Total Monthly Cost',
         value: `₹${totalMonthlyCost.toFixed(2)}`,
         subtext: `${costChangePercentage}% from last month`,
         icon: CurrencyDollarIcon,
         color: 'bg-purple-200',
         iconColor: 'text-purple-600'
      },
      {
         title: 'Active Subscriptions',
         value: activeSubscriptions,
         subtext: `${subscriptionChangeCount >= 0 ? '+' : ''}${subscriptionChangeCount} from last month`,
         icon: UsersIcon,
         color: 'bg-blue-200',
         iconColor: 'text-blue-600'
      },
      {
         title: 'Average Cost',
         value: `₹${averageCost.toFixed(2)}`,
         subtext: 'Per subscription',
         icon: ChartBarIcon,
         color: 'bg-green-200',
         iconColor: 'text-green-600'
      },
      {
         title: 'Most Expensive',
         value: currentMonthData.mostExpensiveSub
            ? currentMonthData.mostExpensiveSub.serviceName.charAt(0).toUpperCase() +
            currentMonthData.mostExpensiveSub.serviceName.slice(1)
            : 'N/A',
         subtext: currentMonthData.mostExpensiveSub
            ? `₹${currentMonthData.mostExpensiveSub.cost.toFixed(2)}/month`
            : 'No subscriptions',
         icon: TrophyIcon,
         color: 'bg-yellow-100',
         iconColor: 'text-yellow-600'
      },
   ];

   return (
      <div className="space-y-4 ">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Subscription Analytics</h2>
            <div className="relative inline-block">
               <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-150 ease-in-out"
               >
                  {months.map((month, index) => (
                     <option key={index} value={index}>
                        {month}
                     </option>
                  ))}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                     <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
               </div>
            </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsItems.map((item, index) => (
               <div key={index} className={`${item.color} p-6 rounded-lg shadow-sm`}>
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-medium text-gray-700">{item.title}</h3>
                     <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900">{item.value}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.subtext}</p>
               </div>
            ))}
         </div>
      </div>
   );
}
