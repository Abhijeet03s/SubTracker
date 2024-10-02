import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CSVLink } from "react-csv";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SubscriptionComparisonProps {
   subscriptions: Array<{ name: string; cost: number; billingCycle: string }>;
}

export default function SubscriptionComparison({ subscriptions }: SubscriptionComparisonProps) {
   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   const currentMonth = new Date().getMonth();
   const currentYear = new Date().getFullYear();

   // Process subscriptions data
   const monthlyTotal = subscriptions.reduce((total, sub) => {
      const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
      return total + monthlyCost;
   }, 0);

   const barChartData = {
      labels: months,
      datasets: [{
         data: months.map((_, index) => index === currentMonth ? monthlyTotal : null),
         backgroundColor: 'rgba(59, 130, 246, 0.8)',
         borderColor: 'rgba(37, 99, 235, 1)',
         borderWidth: 1,
         borderRadius: 8,
         maxBarThickness: 60,
      }],
   };

   const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
         x: {
            grid: {
               display: false,
            },
            ticks: {
               color: 'rgba(55, 65, 81, 1)',
            },
         },
         y: {
            beginAtZero: true,
            grid: {
               color: 'rgba(243, 244, 246, 0.8)',
               drawBorder: false,
            },
            ticks: {
               color: 'rgba(107, 114, 128, 1)',
               font: {
                  family: "'Inter', sans-serif",
                  weight: '500',
               },
               callback: (value: number) => `$${value.toLocaleString()}`,
               maxTicksLimit: 5,
            },
         },
      },
      plugins: {
         legend: {
            display: false,
         },
         tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            titleColor: 'rgba(243, 244, 246, 1)',
            bodyColor: 'rgba(243, 244, 246, 1)',
            cornerRadius: 4,
            padding: 10,
            titleFont: {
               family: "'Inter', sans-serif",
               size: 14,
               weight: '600',
            },
            callbacks: {
               label: (context: any) => `Total: $${context.parsed.y.toFixed(2)}`,
            },
         },
      },
   };

   const csvData = [
      {
         Month: months[currentMonth],
         'Total Cost': monthlyTotal.toFixed(2),
      }
   ];

   return (
      <>
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-700">Subscription Monthly Costs</h2>
            <CSVLink
               data={csvData}
               filename={`subscription-costs-${currentYear}-${months[currentMonth]}.csv`}
               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
               Export as CSV
            </CSVLink>
         </div>
         <div className="h-96 w-full p-2 mt-4">
            <Bar data={barChartData} options={barChartOptions as any} />
         </div>
      </>
   );
}