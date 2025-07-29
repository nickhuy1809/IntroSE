import { useState, useEffect } from 'react';

// Helper function to convert date strings back to Date objects
const reviveDates = (key, value) => {
  if (typeof value === 'string') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/;
    if (dateRegex.test(value)) {
      return new Date(value);
    }
  }
  return value;
};

export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage if it exists
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // Parse with date revival
        const parsed = JSON.parse(item, reviveDates);
        // If it's events array, ensure all start/end are Date objects
        if (key === 'calendar_events' && Array.isArray(parsed)) {
          return parsed.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
          }));
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Update localStorage when the state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
