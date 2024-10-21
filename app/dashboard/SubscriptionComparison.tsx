import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { ArrowDownTrayIcon, ChartBarIcon, ChartPieIcon } from '@heroicons/react/20/solid';
import { useMemo, useState } from 'react';
import { SubscriptionComparisonProps, CategoryMonthlyTotals } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function SubscriptionComparison({ subscriptions }: SubscriptionComparisonProps) {
   const [showCategoryView, setShowCategoryView] = useState(false);
   const monthNames = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], []);
   const currentYear = new Date().getFullYear();

   const monthlyTotalCosts = useMemo(() => monthNames.map((_, monthIndex) => {
      return subscriptions.reduce((total, sub) => {
         const startDate = new Date(sub.startDate);
         const endDate = new Date(sub.endDate);
         if (startDate.getFullYear() === currentYear && endDate.getFullYear() === currentYear &&
            startDate.getMonth() <= monthIndex && endDate.getMonth() >= monthIndex) {
            const monthlyCost = sub.subscriptionType === 'yearly' ? sub.cost / 12 : sub.cost;
            return total + monthlyCost;
         }
         return total;
      }, 0);
   }), [subscriptions, currentYear, monthNames]);

   const categoryMonthlyTotals = useMemo<CategoryMonthlyTotals>(() => {
      const totals: CategoryMonthlyTotals = {};

      subscriptions.forEach(sub => {
         const startDate = new Date(sub.startDate);
         const endDate = new Date(sub.endDate);
         const monthlyCost = sub.subscriptionType === 'yearly' ? sub.cost / 12 : sub.cost;

         for (let month = 0; month < 12; month++) {
            if (startDate.getFullYear() === currentYear && endDate.getFullYear() === currentYear &&
               startDate.getMonth() <= month && endDate.getMonth() >= month) {
               if (!totals[sub.category]) {
                  totals[sub.category] = Array(12).fill(0);
               }
               totals[sub.category][month] += monthlyCost;
            }
         }
      });

      return totals;
   }, [subscriptions, currentYear]);

   const subscriptionTypeTotals = useMemo(() => {
      return subscriptions.reduce((acc, sub) => {
         const monthlyCost = sub.subscriptionType === 'yearly' ? sub.cost / 12 : sub.cost;
         acc[sub.subscriptionType] = (acc[sub.subscriptionType] || 0) + monthlyCost;
         return acc;
      }, {} as Record<string, number>);
   }, [subscriptions]);

   const handleExportCSV = () => {
      const csvContent = "data:text/csv;charset=utf-8,"
         + "Month,Cost\n"
         + monthNames.map((month, index) => `${month},${monthlyTotalCosts[index].toFixed(2)}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `subscription-costs-${currentYear}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
   };

   const barChartData = useMemo(() => {
      if (showCategoryView) {
         const categories = Object.keys(categoryMonthlyTotals);
         const colors = generateCategoryColors(categories.length);
         const datasets = categories.map((category, idx) => ({
            label: category.charAt(0).toUpperCase() + category.slice(1),
            data: categoryMonthlyTotals[category],
            backgroundColor: colors[idx],
            borderColor: colors[idx],
            borderWidth: 1,
            borderRadius: {
               topLeft: 4,
               topRight: 4,
               bottomLeft: 0,
               bottomRight: 0
            },
            borderSkipped: false,
         }));
         return {
            labels: monthNames,
            datasets: datasets,
         };
      } else {
         return {
            labels: monthNames,
            datasets: [{
               label: 'Total Subscription Expenses',
               data: monthlyTotalCosts,
               backgroundColor: 'rgba(79, 70, 229, 0.8)',
               borderColor: 'rgba(79, 70, 229, 1)',
               borderWidth: 1,
               borderRadius: {
                  topLeft: 4,
                  topRight: 4,
                  bottomLeft: 0,
                  bottomRight: 0
               },
               borderSkipped: false,
            }],
         };
      }
   }, [showCategoryView, monthNames, monthlyTotalCosts, categoryMonthlyTotals]);

   const barChartOptions = useMemo(() => {
      return {
         responsive: true,
         maintainAspectRatio: false,
         scales: {
            y: {
               beginAtZero: true,
               ticks: {
                  callback: (value: number) => `$${value.toLocaleString()}`,
                  font: {
                     size: 12,
                  },
               },
               grid: {
                  display: false,
               },
               border: {
                  display: true,
               },
               stacked: showCategoryView,
            },
            x: {
               grid: {
                  display: false,
               },
               border: {
                  display: true,
               },
               ticks: {
                  font: {
                     size: 12,
                  },
               },
               stacked: showCategoryView,
            },
         },
         plugins: {
            legend: {
               display: false,
            },
            tooltip: {
               backgroundColor: 'rgba(0, 0, 0, 0.8)',
               titleFont: {
                  size: 14,
               },
               bodyFont: {
                  size: 12,
               },
               padding: 10,
               cornerRadius: 4,
               callbacks: {
                  label: (context: any) => {
                     if (showCategoryView) {
                        return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                     }
                     return `$${context.parsed.y.toFixed(2)}`;
                  },
               },
            },
         },
      };
   }, [showCategoryView]);

   const pieChartData = useMemo(() => {
      return {
         labels: Object.keys(subscriptionTypeTotals).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
         datasets: [{
            data: Object.values(subscriptionTypeTotals),
            backgroundColor: [
               'rgba(255, 99, 132, 0.8)',
               'rgba(54, 162, 235, 0.8)',
               'rgba(255, 206, 86, 0.8)',
               'rgba(75, 192, 192, 0.8)',
               'rgba(153, 102, 255, 0.8)',
               'rgba(255, 159, 64, 0.8)',
            ],
            borderColor: 'white',
            borderWidth: 2,
         }],
      };
   }, [subscriptionTypeTotals]);

   const pieChartOptions = useMemo(() => {
      return {
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
   }, []);

   function generateCategoryColors(count: number): string[] {
      const baseColors = [
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

      return baseColors.slice(0, count);
   }

   return (
      <div className="w-full h-full flex flex-col">
         <div className="flex flex-row justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Subscription Breakdown</h2>
            <div className="flex space-x-4">
               <button
                  onClick={() => setShowCategoryView(!showCategoryView)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center"
               >
                  {showCategoryView ? <ChartBarIcon className="h-5 w-5 mr-2" /> : <ChartPieIcon className="h-5 w-5 mr-2" />}
                  {showCategoryView ? 'View Total Expenses' : 'View by Category'}
               </button>
               <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
               >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Download Report
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg shadow">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Expense Trends</h3>
               <div className="h-80">
                  <Bar data={barChartData} options={barChartOptions as any} />
               </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Distribution by Type</h3>
               <div className="h-80">
                  <Pie data={pieChartData} options={pieChartOptions as any} />
               </div>
            </div>
         </div>
      </div>
   );
}
