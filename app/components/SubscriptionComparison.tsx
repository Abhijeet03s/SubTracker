import React from 'react';
import { Subscription } from '@prisma/client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { CSVLink } from "react-csv";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface SubscriptionComparisonProps {
   subscriptions: Subscription[];
}

export default function SubscriptionComparison({ subscriptions }: SubscriptionComparisonProps) {
   // Group subscriptions by category
   const subscriptionsByCategory = subscriptions.reduce((acc, sub) => {
      if (!acc[sub.category]) {
         acc[sub.category] = [];
      }
      acc[sub.category].push(sub);
      return acc;
   }, {} as Record<string, Subscription[]>);

   const categories = Object.keys(subscriptionsByCategory);

   // Prepare CSV data
   const csvData = subscriptions.map(sub => ({
      Service: sub.serviceName,
      Category: sub.category,
      Cost: sub.cost,
      'Trial End Date': new Date(sub.trialEndDate).toLocaleDateString()
   }));

   const pieChartData = {
      labels: categories,
      datasets: [
         {
            data: categories.map(category =>
               subscriptionsByCategory[category].reduce((sum, sub) => sum + sub.cost, 0)
            ),
            backgroundColor: [
               'rgba(255, 99, 132, 0.6)',
               'rgba(54, 162, 235, 0.6)',
               'rgba(255, 206, 86, 0.6)',
               'rgba(75, 192, 192, 0.6)',
               'rgba(153, 102, 255, 0.6)',
               'rgba(255, 159, 64, 0.6)',
            ],
            borderColor: [
               'rgba(255, 99, 132, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(153, 102, 255, 1)',
               'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
         },
      ],
   };

   const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: {
            position: 'bottom' as const,
            labels: {
               boxWidth: 15,
               padding: 15,
            },
         },
         title: {
            display: false,
         },
      },
   };

   return (
      <div className="bg-white">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Cost Distribution</h2>
            <CSVLink
               data={csvData}
               filename={"subscriptions-by-category.csv"}
               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
               Export as CSV
            </CSVLink>
         </div>
         <div className="h-80 w-full">
            <Pie data={pieChartData} options={pieChartOptions} />
         </div>
      </div>
   );
}