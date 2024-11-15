export function getSubscriptionAlertSummary(serviceName: string, subscriptionType: 'trial' | 'monthly'): string {
   return `Subscription Alert: ${serviceName} ${subscriptionType === 'trial' ? 'Trial' : 'Subscription'} Ending Soon`;
}

export function getSubscriptionAlertDescription(subscription: {
   subscriptionType: 'trial' | 'monthly';
   serviceName: string;
   category: string;
   cost: number;
}): string {
   return `
       Your ${subscription.subscriptionType === 'trial' ? 'free trial' : 'subscription'} for ${subscription.serviceName} ends tomorrow.

       Please review your subscription status and decide whether to cancel or continue your plan.

       Details:
       • Service: ${subscription.serviceName}
       • Category: ${subscription.category} 
       • Monthly Cost: ₹${subscription.cost.toFixed(2)}

       Important: Take action before your ${subscription.subscriptionType === 'trial' ? 'trial period' : 'billing period'} ends to avoid any unexpected charges.
       
       You can manage your subscription settings at any time through your account dashboard.
   `.trim().replace(/^\s+/gm, '');
}