import { useState, ReactNode } from 'react';
import { Loader } from './ui/loader';

interface ConfirmationDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: ReactNode;
}

export function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmationDialogProps) {
   const [isDeleting, setIsDeleting] = useState(false);

   const handleConfirm = async () => {
      setIsDeleting(true);
      try {
         await onConfirm();
      } finally {
         setIsDeleting(false);
      }
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
         <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
            <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
               <h3 className="mb-4 text-lg font-medium text-gray-900">
                  {title || "Confirm Deletion"}
               </h3>
               <p className="mb-6 text-sm text-gray-600 leading-relaxed">
                  {message || "This action cannot be undone. Please confirm if you want to proceed with the deletion."}
               </p>

               <div className="flex justify-end space-x-4">
                  <button
                     onClick={onClose}
                     disabled={isDeleting}
                     className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={handleConfirm}
                     disabled={isDeleting}
                     className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center min-w-[80px] transition-colors duration-200"
                     aria-label={isDeleting ? "Deleting subscription..." : "Delete subscription"}
                  >
                     {isDeleting ? <Loader size="small" className="animate-spin" /> : 'Delete Forever'}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}