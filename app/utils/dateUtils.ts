import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString: string) => {
   if (!dateString) return '';
   const date = parseISO(dateString);
   return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
};

export const parseDate = (dateString: string) => {
   if (!dateString) return '';
   const date = new Date(dateString);
   return isValid(date) ? date.toISOString() : '';
};

export const safeFormatDate = (dateString: string) => {
   if (!dateString) return '';
   const date = new Date(dateString);
   return isValid(date) ? formatDate(date.toISOString()) : '';
};
