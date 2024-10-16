export const formatDate = (dateString: string) => {
   const date = new Date(dateString);
   return date.toISOString().split('T')[0];
};

export const parseDate = (dateString: string) => {
   const date = new Date(dateString);
   return date.toISOString();
};

export const safeFormatDate = (date: string) => {
   if (!date) return '';
   const parsedDate = new Date(date);
   return isNaN(parsedDate.getTime()) ? '' : formatDate(date);
};

export const addDaysToDate = (date: Date, days: number) => {
   const newDate = new Date(date);
   newDate.setDate(newDate.getDate() + days);
   return newDate;
};
