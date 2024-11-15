import { toast } from 'sonner';
import { FaCheck, FaExclamationCircle, FaInfoCircle, FaTrash } from 'react-icons/fa';

interface ToastOptions {
   message: string;
   description?: string;
}

export const showToast = {
   success: ({ message, description }: ToastOptions) => {
      toast.success(message, {
         description,
         icon: <FaCheck className="text-green-500" />,
         className: 'border-l-4 border-green-500',
         duration: 3000,
      });
   },
   error: ({ message, description }: ToastOptions) => {
      toast.error(message, {
         description,
         icon: <FaExclamationCircle className="text-red-500" />,
         className: 'border-l-4 border-red-500',
         duration: 4000,
      });
   },
   warning: ({ message, description }: ToastOptions) => {
      toast.warning(message, {
         description,
         icon: <FaExclamationCircle className="text-yellow-500" />,
         className: 'border-l-4 border-yellow-500',
         duration: 3500,
      });
   },
   info: ({ message, description }: ToastOptions) => {
      toast.info(message, {
         description,
         icon: <FaInfoCircle className="text-blue-500" />,
         className: 'border-l-4 border-blue-500',
         duration: 3000,
      });
   },
   delete: ({ message, description }: ToastOptions) => {
      toast.error(message, {
         description,
         icon: <FaTrash className="text-red-500" />,
         className: 'border-l-4 border-red-500',
         duration: 3000,
      });
   },
};