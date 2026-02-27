import type { StrapiApp } from '@strapi/strapi/admin';
import { QueryClientProvider } from '@tanstack/react-query';

import pluginPkg from '../../package.json';

import { queryClient } from './utils/queryClient';
import { Initializer } from './components/Initializer/Initializer';
import NoteListLayout from './components/NoteListLayout';
import { PLUGIN_ID } from './pluginId';

type TradOptions = Record<string, string>;

const prefixPluginTranslations = (trad: TradOptions, pluginId: string): TradOptions => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {} as TradOptions);
};

const name = pluginPkg.strapi.name;

export default {
  register(app: StrapiApp) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app: StrapiApp) {
    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'note-list',
      Component: () => (
        <QueryClientProvider client={queryClient}>
          <NoteListLayout />
        </QueryClientProvider>
      ),
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    const importedTranslations = await Promise.all(
      locales.map((locale: string) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
              locale,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.warn(`[${PLUGIN_ID}] Could not load translations for locale "${locale}":`, error);
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return importedTranslations;
  },
};
