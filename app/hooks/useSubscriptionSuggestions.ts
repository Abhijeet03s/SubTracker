import { useState, useEffect, useRef, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Subscription } from '@/lib/types';

export function useSubscriptionSuggestions(
   subscriptions: Subscription[],
   maxSuggestions: number = 5
) {
   const [searchTerm, setSearchTerm] = useState('');
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
   const inputRef = useRef<HTMLInputElement>(null);
   const suggestionRefs = useRef<HTMLDivElement[]>([]);

   const debouncedUpdateSuggestions = useMemo(
      () =>
         debounce((value: string) => {
            const isExactMatch = subscriptions.some(
               (sub) => sub.serviceName.toLowerCase() === value.toLowerCase()
            );

            if (value.length > 0 && !isExactMatch) {
               const filteredSuggestions = subscriptions
                  .filter(sub => sub.serviceName.toLowerCase().includes(value.toLowerCase()))
                  .map(sub => sub.serviceName)
                  .slice(0, maxSuggestions);
               setSuggestions(filteredSuggestions);
               setShowSuggestions(filteredSuggestions.length > 0);
               setSelectedSuggestionIndex(-1);
            } else {
               setSuggestions([]);
               setShowSuggestions(false);
               setSelectedSuggestionIndex(-1);
            }
         }, 300),
      [subscriptions, maxSuggestions]
   );

   useEffect(() => {
      debouncedUpdateSuggestions(searchTerm);
      return () => debouncedUpdateSuggestions.cancel();
   }, [searchTerm, debouncedUpdateSuggestions]);

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
   };

   const handleSuggestionClick = (suggestion: string) => {
      setSearchTerm(suggestion);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions) return;

      const navigateDown = () => {
         setSelectedSuggestionIndex(prev =>
            prev < suggestions.length - 1 ? prev + 1 : 0
         );
      };

      const navigateUp = () => {
         setSelectedSuggestionIndex(prev =>
            prev > 0 ? prev - 1 : suggestions.length - 1
         );
      };

      const handleEnterKey = () => {
         if (selectedSuggestionIndex >= 0) {
            handleSuggestionClick(suggestions[selectedSuggestionIndex]);
         }
      };

      switch (e.key) {
         case 'ArrowDown':
            e.preventDefault();
            navigateDown();
            break;
         case 'ArrowUp':
            e.preventDefault();
            navigateUp();
            break;
         case 'Enter':
            e.preventDefault();
            handleEnterKey();
            break;
         case 'Escape':
            e.preventDefault();
            setShowSuggestions(false);
            setSelectedSuggestionIndex(-1);
            break;
      }
   };

   useEffect(() => {
      if (
         selectedSuggestionIndex >= 0 &&
         suggestionRefs.current[selectedSuggestionIndex]
      ) {
         suggestionRefs.current[selectedSuggestionIndex].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
         });
      }
   }, [selectedSuggestionIndex]);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
         ) {
            setShowSuggestions(false);
            setSelectedSuggestionIndex(-1);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   return {
      inputRef,
      searchTerm,
      setSearchTerm,
      suggestions,
      showSuggestions,
      setShowSuggestions,
      handleSearchChange,
      handleSuggestionClick,
      handleKeyDown,
      selectedSuggestionIndex,
   };
}
