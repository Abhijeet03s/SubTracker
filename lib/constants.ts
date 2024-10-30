// Subscription Types
export type SubscriptionType = 'trial' | 'monthly';
export type CategoryType = 'ecommerce' | 'entertainment' | 'gaming' | 'lifestyle' | 'music' | 'other';
export type DateStatus = 'expired' | 'ending-soon' | 'active' | 'not-applicable';

// Color mappings
export const categoryColors: Record<CategoryType, string> = {
   ecommerce: 'bg-purple-100 text-purple-800',
   entertainment: 'bg-blue-100 text-blue-800',
   gaming: 'bg-green-100 text-green-800',
   lifestyle: 'bg-yellow-100 text-yellow-800',
   music: 'bg-pink-100 text-pink-800',
   other: 'bg-gray-100 text-gray-800'
};

export const subscriptionTypeColors: Record<SubscriptionType, string> = {
   trial: 'bg-orange-100 text-orange-800',
   monthly: 'bg-blue-100 text-blue-800'
};

export const dateStatusColors: Record<DateStatus, string> = {
   expired: 'bg-red-50 text-red-700',
   'ending-soon': 'bg-yellow-50 text-yellow-700',
   active: 'bg-green-50 text-green-700',
   'not-applicable': 'bg-gray-50 text-gray-600'
};

// Chart Colors
export const baseChartColors = [
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

// Loader sizes
export const loaderSizes = {
   small: 'w-4 h-4',
   medium: 'w-6 h-6',
   large: 'w-8 h-8',
};

// Month Names
export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
