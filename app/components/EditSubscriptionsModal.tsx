import React from 'react';
import { Loader } from './ui/loader';
import { FaTimes } from 'react-icons/fa';
import { formatDate, parseDate } from '../utils/dateUtils';

interface Subscription {
   id: string;
   serviceName: string;
   startDate: string;
   trialEndDate: string | null;
   category: string;
   cost: number;
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
   const [editingSubscription, setEditingSubscription] = React.useState<Subscription | null>(null);
   const [isUpdating, setIsUpdating] = React.useState(false);
   const [isDeleting, setIsDeleting] = React.useState(false);

   React.useEffect(() => {
      setEditingSubscription(subscription);
   }, [subscription]);

   if (!isOpen || !editingSubscription) return null;

   const handleUpdate = async () => {
      if (editingSubscription) {
         setIsUpdating(true);
         try {
            const updatedSubscription = {
               ...editingSubscription,
               category: editingSubscription.category.charAt(0).toUpperCase() + editingSubscription.category.slice(1)
            };
            await onUpdate(updatedSubscription);
            onClose();
         } catch (error) {
            console.error('Error updating subscription:', error);
         } finally {
            setIsUpdating(false);
         }
      }
   };

   const handleDelete = async () => {
      if (editingSubscription) {
         setIsDeleting(true);
         try {
            await onDelete(editingSubscription.id);
            onClose();
         } catch (error) {
            console.error('Error deleting subscription:', error);
         } finally {
            setIsDeleting(false);
         }
      }
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
         <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700">
               <FaTimes />
            </button>
            <div className="overflow-visible">
               <h2 className="text-2xl font-bold mb-6">Edit Subscription</h2>
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
                        onChange={(e) => setEditingSubscription({ ...editingSubscription, cost: parseFloat(e.target.value) })}
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
                           const newTrialEndDate = new Date(new Date(newStartDate).getTime() + 7 * 24 * 60 * 60 * 1000);
                           setEditingSubscription({
                              ...editingSubscription,
                              startDate: newStartDate,
                              trialEndDate: newTrialEndDate.toISOString()
                           });
                        }}
                        className="w-full p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                     />
                  </div>
                  <div>
                     <label htmlFor="trialEndDate" className="block text-sm font-medium text-gray-700">Trial End Date</label>
                     <input
                        type="date"
                        id="trialEndDate"
                        value={editingSubscription.trialEndDate ? formatDate(editingSubscription.trialEndDate) : ''}
                        onChange={(e) => setEditingSubscription({ ...editingSubscription, trialEndDate: e.target.value ? parseDate(e.target.value) : null })}
                        className="w-full p-2 bg-slate-50 rounded-t border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                     />
                  </div>
               </div>
               <div className="mt-6 flex justify-end space-x-3">
                  <button
                     onClick={handleUpdate}
                     disabled={isUpdating}
                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
                  >
                     {isUpdating ? <Loader size="small" className="animate-spin" /> : 'Update'}
                  </button>
                  <button
                     onClick={handleDelete}
                     disabled={isDeleting}
                     className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                     {isDeleting ? <Loader size="small" className="animate-spin" /> : 'Delete'}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};