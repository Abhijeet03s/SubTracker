import { Plus_Jakarta_Sans, Zilla_Slab } from 'next/font/google';

export const plusJakartaSans = Plus_Jakarta_Sans({
   subsets: ['latin'],
   display: 'swap',
   variable: '--font-plus-jakarta-sans',
});

export const zillaSlab = Zilla_Slab({
   weight: ['300', '400', '500', '600', '700'],
   style: ['normal', 'italic'],
   subsets: ['latin'],
   display: 'swap',
   variable: '--font-zilla-slab',
});
