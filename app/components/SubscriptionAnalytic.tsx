import { Subscription } from '@prisma/client';

interface SubscriptionAnalyticsProps {
   subscriptions: Subscription[];
}

export default function SubscriptionAnalytics({ subscriptions }: SubscriptionAnalyticsProps) {
   const totalMonthlyCost = subscriptions.reduce((total, sub) => total + sub.cost, 0);
   const activeSubscriptions = subscriptions.length;
   const mostExpensiveSub = subscriptions.reduce((max, sub) => sub.cost > max.cost ? sub : max, subscriptions[0]);
   const averageCost = totalMonthlyCost / activeSubscriptions || 0;

   const analyticsItems = [
      { title: 'Total Monthly Cost', value: `$${totalMonthlyCost.toFixed(2)}`, subtext: '+2.1% from last month' },
      { title: 'Active Subscriptions', value: activeSubscriptions, subtext: '+1 from last month' },
      { title: 'Average Cost', value: `$${averageCost.toFixed(2)}`, subtext: 'Per subscription' },
      {
         title: 'Most Expensive',
         value: mostExpensiveSub ? mostExpensiveSub.serviceName : 'N/A',
         subtext: mostExpensiveSub ? `$${mostExpensiveSub.cost.toFixed(2)}/month` : 'No subscriptions'
      },
   ];

   return (
      <>
         {analyticsItems.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
               <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
               <p className="mt-2 text-3xl font-semibold text-gray-900">{item.value}</p>
               <p className="mt-1 text-sm text-gray-500">{item.subtext}</p>
            </div>
         ))}
      </>
   );
}