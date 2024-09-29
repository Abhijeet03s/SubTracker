import React, { useState } from 'react';
import { Subscription } from '@prisma/client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CSVLink } from "react-csv";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SubscriptionComparisonProps {
   subscriptions: Subscription[];
}

export default function SubscriptionComparison({ subscriptions }: SubscriptionComparisonProps) {
   const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
   const [showDetailedComparison, setShowDetailedComparison] = useState(false);
   const MAX_COMPARISONS = 5;

   const handleSubscriptionToggle = (id: string) => {
      setSelectedSubscriptions(prev => {
         if (prev.includes(id)) {
            return prev.filter(subId => subId !== id);
         } else if (prev.length < MAX_COMPARISONS) {
            return [...prev, id];
         } else {
            alert(`You can compare up to ${MAX_COMPARISONS} subscriptions at a time.`);
            return prev;
         }
      });
   };

   const handleCompare = () => {
      setShowDetailedComparison(true);
   };

   const handleClearSelection = () => {
      setSelectedSubscriptions([]);
      setShowDetailedComparison(false);
   };

   const comparedSubscriptions = subscriptions.filter(sub => selectedSubscriptions.includes(sub.id));

   const chartData = {
      labels: comparedSubscriptions.map(sub => sub.serviceName),
      datasets: [
         {
            label: 'Cost',
            data: comparedSubscriptions.map(sub => sub.cost),
            backgroundColor: 'rgba(79, 70, 229, 0.6)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1,
         },
      ],
   };

   const chartOptions = {
      responsive: true,
      plugins: {
         legend: {
            position: 'top' as const,
         },
         title: {
            display: true,
            text: 'Subscription Cost Comparison',
         },
      },
   };

   const csvData = comparedSubscriptions.map(sub => ({
      Service: sub.serviceName,
      Category: sub.category,
      Cost: sub.cost,
      'Trial End Date': new Date(sub.trialEndDate).toLocaleDateString()
   }));

   return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
         <h2 className="text-xl font-semibold mb-4 text-indigo-600">Subscription Comparison</h2>
         <div className="mb-4">
            <h3 className="text-lg font-medium text-indigo-800 mb-2">Select subscriptions to compare:</h3>
            <div className="flex flex-wrap gap-2">
               {subscriptions.map(sub => (
                  <button
                     key={sub.id}
                     onClick={() => handleSubscriptionToggle(sub.id)}
                     className={`px-3 py-1 rounded-full text-sm font-medium ${selectedSubscriptions.includes(sub.id)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-100 text-indigo-800'
                        }`}
                  >
                     {sub.serviceName}
                  </button>
               ))}
            </div>
         </div>

         <div className="flex justify-between items-center mt-4">
            {comparedSubscriptions.length > 1 && (
               <button
                  onClick={handleCompare}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
               >
                  Compare in Detail
               </button>
            )}
            {selectedSubscriptions.length > 0 && (
               <button
                  onClick={handleClearSelection}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
               >
                  Clear Selection
               </button>
            )}
         </div>

         {comparedSubscriptions.length > 0 && (
            <>
               <div className="mt-8 h-64">
                  <Bar data={chartData} options={chartOptions} />
               </div>
               <div className="overflow-x-auto mt-8">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trial End Date</th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {comparedSubscriptions.map(sub => (
                           <tr key={sub.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.serviceName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sub.cost.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sub.trialEndDate).toLocaleDateString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="mt-4">
                  <CSVLink
                     data={csvData}
                     filename={"subscription-comparison.csv"}
                     className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                     Export as CSV
                  </CSVLink>
               </div>
            </>
         )}

         {showDetailedComparison && (
            <div className="mt-8">
               <h3 className="text-lg font-medium text-indigo-800 mb-4">Detailed Comparison</h3>
               {/* Add more detailed comparison here, e.g., feature comparison if available */}
            </div>
         )}
      </div>
   );
}