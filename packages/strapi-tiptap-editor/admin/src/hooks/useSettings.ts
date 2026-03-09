import { useFetchClient } from '@strapi/strapi/admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import defaultSettings from '../../../utils/defaults';

const SETTINGS_QUERY_KEY = ['strapi-tiptap-editor', 'settings'];

export const useSettings = () => {
  const { get, put } = useFetchClient();
  const queryClient = useQueryClient();

  const {
    data: settings = defaultSettings,
    isLoading,
    error,
  } = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await get('/strapi-tiptap-editor/');
        return response.data || defaultSettings;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Failed to load settings, using defaults:', err);
        return defaultSettings;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    mutate: updateSettings,
    mutateAsync: updateSettingsAsync,
    isPending: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: async (newSettings: typeof defaultSettings) => {
      await put('/strapi-tiptap-editor/update-settings', newSettings);
      return newSettings;
    },
    onSuccess: (newSettings) => {
      // Optimistically update the cache
      queryClient.setQueryData(SETTINGS_QUERY_KEY, newSettings);
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to update settings:', err);
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    updateSettingsAsync,
    isUpdating,
    updateError,
  };
};
