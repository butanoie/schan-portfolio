import { useEffect, useState } from 'react';

/**
 * Debounces a value by delaying updates until after a specified delay period.
 * This hook is useful for avoiding excessive re-renders or API calls triggered
 * by rapidly changing values like search input.
 *
 * @template T - The type of the value being debounced
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds (default: 300ms)
 * @returns The debounced value, updated only after the delay period has elapsed
 *
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const [searchQuery, setSearchQuery] = useState('');
 *   const debouncedQuery = useDebounce(searchQuery, 500);
 *
 *   // debouncedQuery only updates 500ms after the user stops typing
 *   useEffect(() => {
 *     if (debouncedQuery) {
 *       fetchSearchResults(debouncedQuery);
 *     }
 *   }, [debouncedQuery]);
 *
 *   return (
 *     <input
 *       value={searchQuery}
 *       onChange={(e) => setSearchQuery(e.target.value)}
 *     />
 *   );
 * }
 * ```
 *
 *
 * The hook automatically cleans up pending timers when the component unmounts.
 * If the value changes before the delay expires, the previous timer is cancelled.
 * The initial value is returned immediately on first render.
 * Useful for search inputs, autocomplete, and other frequently updating values.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes or component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}
