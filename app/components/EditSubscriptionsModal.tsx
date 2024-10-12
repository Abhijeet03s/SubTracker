import React, { useState, useEffect, useCallback } from 'react';
import { Loader } from './ui/loader';
import { FaTimes } from 'react-icons/fa';
import { formatDate, parseDate } from '../utils/dateUtils';

interface Subscription {
   id: string;
   serviceName: string;
   startDate: string;
   category: string;
   cost: number;
   subscriptionType: string;
}

interface EditSubscriptionsModalProps {
   isOpen: boolean;
   onClose: () => void;
   subscription: Subscription | null;
   onUpdate: (updatedSubscription: Subscription) => Promise<void>;
   onDelete: (id: string) => Promise<void>;
}

export const EditSubscriptionsModal: React.FC<EditSubscriptionsModalProps> = ({
   isOpen,
   onClose,
   subscription,
   onUpdate,
   onDelete,
}) => {
   const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
   const [isUpdating, setIsUpdating] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      setEditingSubscription(subscription);
      setError(null);
   }, [subscription]);

   const handleUpdate = useCallback(async () => {
      if (editingSubscription) {
         setIsUpdating(true);
         setError(null);
         try {
            const updatedSubscription = {
               ...editingSubscription,
               category: editingSubscription.category.charAt(0).toUpperCase() + editingSubscription.category.slice(1)
            };
            await onUpdate(updatedSubscription);
            onClose();
         } catch (error) {
            console.error('Error updating subscription:', error);
            setError('Failed to update subscription. Please try again.');
         } finally {
            setIsUpdating(false);
         }
      }
   }, [editingSubscription, onUpdate, onClose]);

   const handleDelete = useCallback(async () => {
      if (editingSubscription) {
         setIsDeleting(true);
         setError(null);
         try {
            await onDelete(editingSubscription.id);
            onClose();
         } catch (error) {
            console.error('Error deleting subscription:', error);
            setError('Failed to delete subscription. Please try again.');
         } finally {
            setIsDeleting(false);
         }
      }
   }, [editingSubscription, onDelete, onClose]);

   if (!isOpen || !editingSubscription) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
         <div className="bg-white rounded-lg p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700 transition-colors duration-200">
               <FaTimes />
            </button>
            <div className="overflow-visible">
               <h2 className="text-2xl sm:text-3xl font-bold mb-6">Edit Subscription</h2>
               {error && <p className="text-red-500 mb-4">{error}</p>}
               <div className="space-y-6">
                  <div>
                     <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">Service Name</label>
                     <input
                        type="text"
                        id="serviceName"
                        value={editingSubscription.serviceName}
                        onChange={(e) => setEditingSubscription({ ...editingSubscription, serviceName: e.target.value })}
                        className="w-full p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                     />
                  </div>
                  <div>
                     <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                     <select
                        id="category"
                        value={editingSubscription.category}
                        onChange={(e) => setEditingSubscription({ ...editingSubscription, category: e.target.value })}
                        className="w-full p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                     >
                        <option value="ecommerce">Ecommerce</option>
                        <option value="streaming">Streaming</option>
                        <option value="gaming">Gaming</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="music">Music</option>
                        <option value="other">Other</option>
                     </select>
                  </div>
                  <div>
                     <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Cost</label>
                     <input
                        type="number"
                        id="cost"
                        value={editingSubscription.cost}
                        onChange={(e) => setEditingSubscription({ ...editingSubscription, cost: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300 [&::-webkit-inner-spin-button]:appearance-none"
                     />
                  </div>
                  <div>
                     <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                     <input
                        type="date"
                        id="startDate"
                        value={formatDate(editingSubscription.startDate)}
                        onChange={(e) => {
                           const newStartDate = parseDate(e.target.value);
                           setEditingSubscription({
                              ...editingSubscription,
                              startDate: newStartDate,
                           });
                        }}
                        className="w-full p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                     />
                  </div>
                  <div>
                     <label htmlFor="subscriptionType" className="block text-sm font-medium text-gray-700">Subscription Type</label>
                     <select
                        id="subscriptionType"
                        value={editingSubscription.subscriptionType}
                        onChange={(e) => setEditingSubscription({ ...editingSubscription, subscriptionType: e.target.value })}
                        className="w-full p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                     >
                        <option value="trial">7 Days Trial</option>
                        <option value="monthly">1 Month Subscription</option>
                     </select>
                  </div>
               </div>
               <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                     onClick={handleUpdate}
                     disabled={isUpdating}
                     className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
                  >
                     {isUpdating ? <Loader size="small" className="animate-spin" /> : 'Update'}
                  </button>
                  <button
                     onClick={handleDelete}
                     disabled={isDeleting}
                     className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white text-sm sm:text-base rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                     {isDeleting ? <Loader size="small" className="animate-spin" /> : 'Delete'}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};
