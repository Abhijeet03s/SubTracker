export interface Subscription {
   id: string;
   serviceName: string;
   startDate: string;
   endDate: string;
   category: string;
   cost: number;
   subscriptionType: string;
   calendarEventId?: string;
}

export interface AddToCalendarParams {
   serviceName: string;
   startDate: string;
   endDate: string;
   category: string;
   cost: number;
   subscriptionType: string;
   calendarEventId?: string;
}

export interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   children: React.ReactNode;
}

export interface SubscriptionComparisonProps {
   subscriptions: Subscription[];
}

export interface CategoryMonthlyTotals {
   [category: string]: number[];
}

export interface SubscriptionFormProps {
   onSubmit: (subscription: SubscriptionFormData) => void;
}

export interface SubscriptionFormData {
   serviceName: string;
   startDate: string;
   endDate: string;
   category: string;
   cost: number;
   subscriptionType: string;
}

export interface SubscriptionListProps {
   subscriptions: Subscription[];
   onUpdate: (id: string, data: Partial<Subscription>) => Promise<void>;
   onDelete: (id: string) => Promise<void>;
   onSubscriptionsChange: (updatedSubscriptions: Subscription[]) => void;
   onCalendarUpdate: (subscription: Subscription) => Promise<void>;
}

export interface HeroProps {
   userId: string | null;
}

export interface LoaderProps {
   size?: 'small' | 'medium' | 'large';
   color?: string;
   className?: string;
}

export interface EditSubscriptionsModalProps {
   isOpen: boolean;
   onClose: () => void;
   subscription: Subscription | null;
   onUpdate: (updatedSubscription: Subscription) => Promise<void>;
   onDelete: (id: string) => Promise<void>;
}

export interface SubscriptionAnalyticsProps {
   subscriptions: Subscription[];
}

export interface MonthlyData {
   totalCost: number;
   activeSubscriptions: number;
   mostExpensiveSub: Subscription | null;
}

export type SubscriptionType = 'trial' | 'monthly';
export type CategoryType = 'ecommerce' | 'streaming' | 'gaming' | 'lifestyle' | 'music' | 'other';
export type DateStatus = 'expired' | 'ending-soon' | 'active' | 'not-applicable';