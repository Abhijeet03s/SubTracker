import React, { useRef, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

interface ModalProps {
   isOpen: boolean
   onClose: () => void
   children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
   const modalRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
         if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose()
         }
      }

      if (isOpen) {
         document.addEventListener('mousedown', handleOutsideClick)
      }

      return () => {
         document.removeEventListener('mousedown', handleOutsideClick)
      }
   }, [isOpen, onClose])

   if (!isOpen) return null

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
         <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{ minHeight: '350px' }}
         >
            <div className="flex justify-end mb-2">
               <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
                  <FaTimes />
               </button>
            </div>
            <div className="overflow-visible">
               {children}
            </div>
         </div>
      </div>
   )
}

export default Modal