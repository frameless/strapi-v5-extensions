/**
 * Adds or removes a value from an array
 * @param list - The array to modify
 * @param val - The value to add or remove
 * @returns A new array with the value added or removed
 */
export const addRemoveFromList = <T>(list: T[], val: T): T[] => {
  try {
    if (!Array.isArray(list)) {
      // eslint-disable-next-line no-console
      console.warn('addRemoveFromList: First parameter must be an array');
      return [val];
    }

    const newList = [...list];
    const index = newList.indexOf(val);

    if (index === -1) {
      newList.push(val);
    } else {
      newList.splice(index, 1);
    }

    return newList;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error in addRemoveFromList:', err);
    return list;
  }
};

const validProtocols = ['https://', 'http://', '#', 'tel:', 'mailto:'] as const;

/**
 * Validates if a URL has a valid protocol
 * @param url - The URL string to validate
 * @returns True if the URL starts with a valid protocol
 */
export const isValidURL = (url: string): boolean => {
  try {
    if (!url || typeof url !== 'string') {
      return false;
    }
    return validProtocols.some((protocol) => url.startsWith(protocol));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error validating URL:', err);
    return false;
  }
};
