import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { ArrowDownTrayIcon, ChartBarIcon, ChartPieIcon } from '@heroicons/react/20/solid';
import { useMemo, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface SubscriptionComparisonProps {
   subscriptions: Array<{ name: string; startDate: string; endDate: string; cost: number; billingCycle: string; category: string; subscriptionType: string }>;
}

export default function SubscriptionComparison({ subscriptions }: SubscriptionComparisonProps) {
   const [showCategoryBar, setShowCategoryBar] = useState(false);
   const months = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], []);
   const currentYear = new Date().getFullYear();
   const currentMonth = new Date().getMonth();

   const monthlyTotals = useMemo(() => months.map((_, index) => {
      return subscriptions.reduce((total, sub) => {
         const startDate = new Date(sub.startDate);
         const endDate = new Date(sub.endDate);
         if (startDate.getFullYear() === currentYear && endDate.getFullYear() === currentYear &&
            startDate.getMonth() <= index && endDate.getMonth() >= index) {
            const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
            return total + monthlyCost;
         }
         return total;
      }, 0);
   }), [subscriptions, currentYear, months]);

   const categoryTotals = useMemo(() => {
      return subscriptions.reduce((acc, sub) => {
         const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
         acc[sub.category] = (acc[sub.category] || 0) + monthlyCost;
         return acc;
      }, {} as Record<string, number>);
   }, [subscriptions]);

   const subscriptionTypeTotals = useMemo(() => {
      return subscriptions.reduce((acc, sub) => {
         const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
         acc[sub.subscriptionType] = (acc[sub.subscriptionType] || 0) + monthlyCost;
         return acc;
      }, {} as Record<string, number>);
   }, [subscriptions]);

   const handleExport = () => {
      const csvContent = "data:text/csv;charset=utf-8,"
         + "Month,Cost\n"
         + months.map((month, index) => `${month},${monthlyTotals[index].toFixed(2)}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `subscription-costs-${currentYear}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
   };

   const barChartData = {
      labels: showCategoryBar ? Object.keys(categoryTotals) : months,
      datasets: [{
         label: showCategoryBar ? 'Category Cost' : 'Monthly Cost',
         data: showCategoryBar ? Object.values(categoryTotals) : monthlyTotals,
         backgroundColor: 'rgba(79, 70, 229, 0.8)',
         borderColor: 'rgba(79, 70, 229, 1)',
         borderWidth: 1,
         borderRadius: 8,
         borderSkipped: false,
      }],
   };

   const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
         y: {
            beginAtZero: true,
            ticks: {
               callback: (value: number) => `$${value.toLocaleString()}`,
            },
            grid: {
               color: 'rgba(0, 0, 0, 0.1)',
            },
         },
         x: {
            grid: {
               display: false,
            },
         },
      },
      plugins: {
         legend: {
            display: false,
         },
         tooltip: {
            callbacks: {
               label: (context: any) => `$${context.parsed.y.toFixed(2)}`,
            },
         },
      },
   };

   const pieChartData = {
      labels: Object.keys(subscriptionTypeTotals).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
      datasets: [{
         data: Object.values(subscriptionTypeTotals),
         backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
         ],
         borderColor: 'white',
         borderWidth: 2,
      }],
   };

   const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: {
            position: 'right' as const,
            labels: {
               boxWidth: 20,
               padding: 20,
            },
         },
         tooltip: {
            callbacks: {
               label: (context: any) => `$${context.parsed.toFixed(2)}`,
            },
         },
      },
   };

   const totalMonthly = monthlyTotals[currentMonth];
   const averageMonthly = monthlyTotals.reduce((a, b) => a + b, 0) / 12;
   const percentChange = ((totalMonthly - monthlyTotals[currentMonth - 1]) / monthlyTotals[currentMonth - 1]) * 100;

   return (
      <div className="w-full h-full flex flex-col">
         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Subscription Insights</h2>
            <div className="flex space-x-4">
               <button
                  onClick={() => setShowCategoryBar(!showCategoryBar)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center"
               >
                  {showCategoryBar ? <ChartBarIcon className="h-5 w-5 mr-2" /> : <ChartPieIcon className="h-5 w-5 mr-2" />}
                  {showCategoryBar ? 'Show Monthly' : 'Show Categories'}
               </button>
               <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
               >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Export CSV
               </button>
            </div>
         </div>

         {/* Subscription Overview - Moved to the top for better visibility */}
         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Subscription Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <OverviewCard title="Active Subscriptions" value={subscriptions.length} />
               <OverviewCard
                  title="Total Monthly Cost"
                  value={`$${monthlyTotals[currentMonth].toFixed(2)}`}
               />
               <OverviewCard
                  title="Highest Monthly Cost"
                  value={`$${Math.max(...monthlyTotals).toFixed(2)}`}
               />
               <OverviewCard
                  title="Average Monthly Cost"
                  value={`$${(monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length).toFixed(2)}`}
               />
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg shadow">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {showCategoryBar ? 'Category Costs' : 'Monthly Costs'}
               </h3>
               <div className="h-80">
                  <Bar data={barChartData} options={barChartOptions as any} />
               </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscription Type Breakdown</h3>
               <div className="h-80">
                  <Pie data={pieChartData} options={pieChartOptions as any} />
               </div>
            </div>
         </div>
      </div>
   );
}

interface OverviewCardProps {
   title: string;
   value: string | number;
}

function OverviewCard({ title, value }: OverviewCardProps) {
   return (
      <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-lg">
         <p className="text-sm font-medium text-indigo-100 mb-1">{title}</p>
         <p className="text-2xl font-bold text-white">{value}</p>
      </div>
   );
}
