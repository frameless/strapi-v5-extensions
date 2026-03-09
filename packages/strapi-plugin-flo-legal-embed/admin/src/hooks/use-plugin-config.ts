import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { RESOLVE_CONFIG } from '../constants';
import { PLUGIN_ID } from '../pluginId';
import { Config, FloLegalCheck, PluginData } from '../types';
import { getTranslation } from '../utils/getTranslation';

interface PluginConfigState {
  isLoading: boolean;
  config: Config | null;
  checks: FloLegalCheck[];
}

type PluginConfigKey = `${typeof PLUGIN_ID}_config`;
type RootState = Record<string, unknown> & Record<PluginConfigKey, PluginConfigState>;

interface ResolveConfigAction {
  type: typeof RESOLVE_CONFIG;
  data: PluginData | null;
}

type AppDispatch = (action: ResolveConfigAction) => void;

interface UsePluginConfigReturn {
  config: Config | null;
  checks: FloLegalCheck[];
  isLoading: boolean;
}

const usePluginConfig = (): UsePluginConfigReturn => {
  const dispatch = useDispatch() as AppDispatch;
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();

  const { isLoading, config, checks } = useSelector((state: RootState) => state[`${PLUGIN_ID}_config`]);

  const client = useFetchClient();

  useEffect(() => {
    if (!isLoading && config !== null) {
      return;
    }

    const abortController = new AbortController();

    const fetchData = async (): Promise<PluginData | null> => {
      try {
        const endpoint = `/${PLUGIN_ID}/config`;
        const { data } = await client.get<PluginData>(endpoint, {
          signal: abortController.signal,
        });

        return data ?? null;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        if (!abortController.signal.aborted) {
          toggleNotification({
            type: 'warning',
            message: formatMessage({
              id: getTranslation('notification.error'),
              defaultMessage: 'An error occurred while fetching data',
            }),
          });
        }

        return null;
      }
    };

    fetchData().then((data) => dispatch({ type: RESOLVE_CONFIG, data }));

    // eslint-disable-next-line consistent-return
    return () => abortController.abort();
  }, [client, config, dispatch, isLoading, toggleNotification, formatMessage]);

  return { config, checks, isLoading };
};

export default usePluginConfig;
