import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { CSVLink } from "react-csv";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SubscriptionComparisonProps {
   subscriptions: any[];
}

export default function SubscriptionComparison({ subscriptions }: SubscriptionComparisonProps) {
   const dummyData = [
      { month: 'Jan', cost: 450 },
      { month: 'Feb', cost: 500 },
      { month: 'Mar', cost: 550 },
      { month: 'Apr', cost: 480 },
      { month: 'May', cost: 520 },
      { month: 'Jun', cost: 600 },
      { month: 'Jul', cost: 580 },
      { month: 'Aug', cost: 620 },
      { month: 'Sep', cost: 590 },
      { month: 'Oct', cost: 628 },
      { month: 'Nov', cost: 610 },
      { month: 'Dec', cost: 650 },
   ];

   const currentMonthIndex = 9;

   const lineChartData = {
      labels: dummyData.map(item => item.month),
      datasets: [
         {
            label: 'Subscription Cost',
            data: dummyData.map(item => item.cost),
            borderColor: (context: any) => {
               const chart = context.chart;
               const { ctx, chartArea } = chart;
               if (!chartArea) {
                  return;
               }
               const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
               gradient.addColorStop(0, 'rgba(75, 192, 192, 0)');
               gradient.addColorStop(1, 'rgba(75, 192, 192, 1)');
               return gradient;
            },
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: (context: any) =>
               context.dataIndex === currentMonthIndex ? 'rgba(75, 192, 192, 1)' : 'transparent',
            pointBorderColor: (context: any) =>
               context.dataIndex === currentMonthIndex ? 'rgba(75, 192, 192, 1)' : 'transparent',
            pointRadius: (context: any) =>
               context.dataIndex === currentMonthIndex ? 5 : 0,
            pointHoverRadius: 0,
         },
      ],
   };

   const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
         x: {
            grid: {
               display: false,
            },
         },
         y: {
            beginAtZero: true,
            grid: {
               display: false,
            },
            title: {
               display: false,
            },
            ticks: {
               display: true,
            },
         },
      },
      plugins: {
         legend: {
            display: false,
         },
         tooltip: {
            enabled: false,
         },
         annotation: {
            annotations: {
               currentMonth: {
                  type: 'point',
                  xValue: currentMonthIndex,
                  yValue: dummyData[currentMonthIndex].cost,
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                  radius: 0,
                  label: {
                     content: `$${dummyData[currentMonthIndex].cost.toFixed(2)}`,
                     enabled: true,
                     position: 'top',
                     yAdjust: -15,
                     backgroundColor: 'rgba(0, 0, 0, 0.7)',
                     color: 'white',
                     padding: 8,
                     borderRadius: 4,
                     font: {
                        weight: 'bold',
                     },
                  },
               },
            },
         },
      },
   };

   const csvData = dummyData.map(item => ({
      Month: item.month,
      Cost: item.cost,
   }));

   return (
      <div className="">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Subscription Cost Distribution</h2>
            <CSVLink
               data={csvData}
               filename={"subscriptions-by-month.csv"}
               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
               Export as CSV
            </CSVLink>
         </div>
         <div className="h-80 w-full">
            <Line data={lineChartData} options={lineChartOptions} />
         </div>
      </div>
   );
}