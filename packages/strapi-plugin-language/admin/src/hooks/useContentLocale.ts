import { useEffect, useState } from 'react';

import { getCurrentContentLocale } from '../utils/getCurrentContentLocale';

export const useContentLocale = () => {
  const [locale, setLocale] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setLocale(getCurrentContentLocale());
    };

    update(); // initialize on mount
    window.addEventListener('popstate', update);

    return () => window.removeEventListener('popstate', update);
  }, []);

  return locale;
};
