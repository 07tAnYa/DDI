import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const savedValue = window.localStorage.getItem(key);

    if (!savedValue) {
      return initialValue;
    }

    try {
      return JSON.parse(savedValue) as T;
    } catch {
      return initialValue;
    }
  });   

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
