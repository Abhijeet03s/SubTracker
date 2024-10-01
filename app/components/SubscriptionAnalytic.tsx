import { Subscription } from '@prisma/client';
import { CurrencyDollarIcon, UsersIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/solid';

interface SubscriptionAnalyticsProps {
   subscriptions: Subscription[];
}

export default function SubscriptionAnalytics({ subscriptions }: SubscriptionAnalyticsProps) {
   const totalMonthlyCost = subscriptions.reduce((total, sub) => total + sub.cost, 0);
   const activeSubscriptions = subscriptions.length;
   const mostExpensiveSub = subscriptions.reduce((max, sub) => sub.cost > max.cost ? sub : max, subscriptions[0]);
   const averageCost = totalMonthlyCost / activeSubscriptions || 0;

   const analyticsItems = [
      { title: 'Total Monthly Cost', value: `$${totalMonthlyCost.toFixed(2)}`, subtext: '+2.1% from last month', icon: CurrencyDollarIcon, color: 'bg-purple-200', iconColor: 'text-purple-600' },
      { title: 'Active Subscriptions', value: activeSubscriptions, subtext: '+1 from last month', icon: UsersIcon, color: 'bg-blue-200', iconColor: 'text-blue-600' },
      { title: 'Average Cost', value: `$${averageCost.toFixed(2)}`, subtext: 'Per subscription', icon: ChartBarIcon, color: 'bg-green-200', iconColor: 'text-green-600' },
      {
         title: 'Most Expensive',
         value: mostExpensiveSub ? mostExpensiveSub.serviceName : 'N/A',
         subtext: mostExpensiveSub ? `$${mostExpensiveSub.cost.toFixed(2)}/month` : 'No subscriptions',
         icon: TrophyIcon,
         color: 'bg-[#FFF7C0]',
         iconColor: 'text-yellow-600'
      },
   ];

   return (
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
   );
}