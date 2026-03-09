/* eslint-disable no-console */
/**
 * Get value from local storage with type safety
 * @param key - The localStorage key to retrieve
 * @param typeGuard - Type guard function to validate the retrieved value
 * @returns The typed value if valid, null otherwise
 * @example
 * const value = getLocalStorage<string>('key', (val): val is string => typeof val === 'string');
 */
export const getLocalStorage = <T>(key: string, typeGuard: (arg: any) => arg is T): T | null => {
  if (!key) {
    console.warn('getLocalStorage: Empty key provided');
    return null;
  }

  if (typeof window === 'undefined') {
    console.debug('getLocalStorage: Window not available (SSR environment)');
    return null;
  }

  try {
    const rawValue = localStorage.getItem(key);

    if (rawValue === null) {
      console.debug(`getLocalStorage: No value found for key '${key}'`);
      return null;
    }

    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(rawValue);
    } catch {
      // If JSON parsing fails, use the raw string value
      parsedValue = rawValue;
    }

    if (typeGuard(parsedValue)) {
      return parsedValue;
    } else {
      console.warn(`getLocalStorage: Type guard failed for key '${key}', value:`, parsedValue);
      return null;
    }
  } catch (err) {
    console.error(`getLocalStorage: Error accessing localStorage for key '${key}':`, err);
    return null;
  }
};
