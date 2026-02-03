import { useNotification, useFetchClient } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RESOLVE_CONFIG } from '../constants';
import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils/getTranslation';

const usePluginConfig = () => {
  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const { isLoading, config } = useSelector((state: any) => state[`${PLUGIN_ID}_config`]);
  const client = useFetchClient();

  useEffect(() => {
    // Do nothing if we have already loaded the config data.
    if (!isLoading && !!config) {
      return;
    }
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const endpoint = `/${PLUGIN_ID}/config`;
        const { data } = await client.get(endpoint, {
          signal: abortController.signal,
        });

        return data ?? {};
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

          return err;
        }
        return null;
      }
    };
    fetchData().then((data) => dispatch({ type: RESOLVE_CONFIG, data }));

    // eslint-disable-next-line consistent-return
    return () => abortController.abort();
  }, [client, config, dispatch, isLoading, toggleNotification, formatMessage]);

  return { config, isLoading };
};

export default usePluginConfig;
