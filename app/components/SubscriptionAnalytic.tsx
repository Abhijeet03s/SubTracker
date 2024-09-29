import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Subscription } from '@prisma/client';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SubscriptionAnalyticsProps {
   subscriptions: Subscription[];
}

export default function SubscriptionAnalytics({ subscriptions }: SubscriptionAnalyticsProps) {
   // Calculate total monthly cost
   const totalMonthlyCost = subscriptions.reduce((total, sub) => total + sub.cost, 0);

   // Calculate number of active subscriptions
   const activeSubscriptions = subscriptions.length;

   // Find most expensive subscription
   const mostExpensiveSub = subscriptions.reduce((max, sub) => sub.cost > max.cost ? sub : max, subscriptions[0]);

   // Calculate average cost per subscription
   const averageCost = totalMonthlyCost / activeSubscriptions || 0;

   // Group subscriptions by category
   const categoryCounts = subscriptions.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + 1;
      return acc;
   }, {} as Record<string, number>);

   // Prepare data for pie chart
   const categoryData = {
      labels: Object.keys(categoryCounts),
      datasets: [
         {
            data: Object.values(categoryCounts),
            backgroundColor: [
               '#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981',
               '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#14B8A6',
            ],
         },
      ],
   };

   return (
      <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-semibold mb-4 text-indigo-600">Subscription Analytics</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-indigo-100 p-4 rounded-lg">
               <h3 className="text-lg font-medium text-indigo-800">Total Monthly Cost</h3>
               <p className="text-2xl font-bold text-indigo-600">${totalMonthlyCost.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
               <h3 className="text-lg font-medium text-indigo-800">Active Subscriptions</h3>
               <p className="text-2xl font-bold text-indigo-600">{activeSubscriptions}</p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
               <h3 className="text-lg font-medium text-indigo-800">Most Expensive</h3>
               <p className="text-2xl font-bold text-indigo-600">{mostExpensiveSub?.serviceName}</p>
               <p className="text-indigo-600">${mostExpensiveSub?.cost.toFixed(2)}/month</p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
               <h3 className="text-lg font-medium text-indigo-800">Average Cost</h3>
               <p className="text-2xl font-bold text-indigo-600">${averageCost.toFixed(2)}/month</p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
               <h3 className="text-lg font-medium text-indigo-800 mb-4">Subscriptions by Category</h3>
               <div className="w-full h-64">
                  <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
               </div>
            </div>
         </div>
      </div>
   );
}
