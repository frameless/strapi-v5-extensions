export const getCurrentContentLocale = (): string | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('plugins[i18n][locale]');
};
