import { plusJakartaSans } from '@/app/fonts/fonts';

export default function DashboardLoading() {
   return (
      <div className='min-h-screen bg-gray-100'>
         <div className={`${plusJakartaSans.className} container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8`}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
               <div>
                  <div className="skeleton w-64 h-10 rounded-lg" />
               </div>
               <div className="flex space-x-4">
                  <div className="skeleton w-40 h-10 rounded-full" />
                  <div className="skeleton w-32 h-10 rounded-md" />
               </div>
            </div>

            <div className="space-y-6">
               {/* Analytics Cards */}
               <div className="mt-10">
                  <div className="flex justify-between items-center mb-4">
                     <div className="skeleton w-48 h-8 rounded" />
                     <div className="skeleton w-32 h-10 rounded" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                           <div className="flex justify-between items-center mb-4">
                              <div className="skeleton w-32 h-4 rounded" />
                              <div className="skeleton w-8 h-8 rounded-full" />
                           </div>
                           <div className="skeleton w-24 h-8 rounded mb-2" />
                           <div className="skeleton w-36 h-4 rounded" />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Subscription List Section */}
               <div className="bg-white rounded-lg shadow p-6">
                  <div className="w-full mx-auto space-y-4">
                     <div className="skeleton w-48 h-8 rounded mb-6" /> {/* "Manage Your Subscriptions" title */}

                     {/* Search and Filters Row */}
                     <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                        {/* Search Bar */}
                        <div className="w-full md:w-1/2 relative">
                           <div className="skeleton w-full h-10 rounded-md" />
                        </div>

                        {/* Filters */}
                        <div className="w-full md:w-1/2 flex space-x-4">
                           {/* Category Filter */}
                           <div className="w-1/3">
                              <div className="skeleton w-full h-10 rounded-md" />
                           </div>
                           {/* Type Filter */}
                           <div className="w-1/3">
                              <div className="skeleton w-full h-10 rounded-md" />
                           </div>
                           {/* Cost Filter */}
                           <div className="w-1/3">
                              <div className="skeleton w-full h-10 rounded-md" />
                           </div>
                        </div>
                     </div>

                     {/* Table */}
                     <div className="mt-8 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           {/* Table Header */}
                           <thead className="bg-gray-50">
                              <tr>
                                 {['Service', 'Category', 'Cost', 'Start Date', 'End Date', 'Subscription Type', ''].map((header) => (
                                    <th key={header} className="px-6 py-3">
                                       <div className="skeleton w-20 h-4 rounded mx-auto" />
                                    </th>
                                 ))}
                              </tr>
                           </thead>

                           {/* Table Body */}
                           <tbody className="bg-white divide-y divide-gray-200">
                              {[...Array(5)].map((_, index) => (
                                 <tr key={index}>
                                    {/* Service Name */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <div className="skeleton w-24 h-5 rounded mx-auto" />
                                    </td>
                                    {/* Category */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <div className="skeleton w-24 h-5 rounded-full mx-auto" />
                                    </td>
                                    {/* Cost */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <div className="skeleton w-20 h-5 rounded mx-auto" />
                                    </td>
                                    {/* Start Date */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <div className="skeleton w-24 h-5 rounded mx-auto" />
                                    </td>
                                    {/* End Date */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <div className="skeleton w-24 h-5 rounded-full mx-auto" />
                                    </td>
                                    {/* Subscription Type */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <div className="skeleton w-20 h-5 rounded-full mx-auto" />
                                    </td>
                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <div className="skeleton w-6 h-6 rounded-full mx-auto" />
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               {/* Charts Section */}
               <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                     <div className="skeleton w-48 h-8 rounded" />
                     <div className="flex space-x-4">
                        <div className="skeleton w-36 h-10 rounded" />
                        <div className="skeleton w-36 h-10 rounded" />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2">
                        <div className="skeleton w-full h-80 rounded" />
                     </div>
                     <div>
                        <div className="skeleton w-full h-80 rounded" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}