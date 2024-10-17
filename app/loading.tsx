import Image from 'next/image'

export default function Loading() {
   return (
      <div className="flex flex-col justify-center items-center h-screen">
         <div className="animatePulse">
            <Image
               src="/subtrack-logo.png"
               alt="Website Logo"
               width={48}
               height={48}
               className="mb-4"
            />
         </div>
      </div>
   )
}
