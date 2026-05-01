import type { StrapiApp } from '@strapi/strapi/admin';

import { Initializer } from './components/Initializer';
import { PLUGIN_ID } from './pluginId';
import './styles.css';
import { PluginIcon } from './components/PluginIcon';
type TranslateOptions = Record<string, string>;

const prefixPluginTranslations = (translate: TranslateOptions, pluginId: string): TranslateOptions => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(translate).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = translate[current];
    return acc;
  }, {} as TranslateOptions);
};

export default {
  register(app: StrapiApp) {
    app.addMenuLink({
      to: `/plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'Content compliance checker',
      },
      Component: async () => import('./pages/App'),
      permissions: [],
    });
    const plugin = {
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(/*app: StrapiApp*/) {},

  async registerTrads({ locales }: { locales: string[] }) {
    try {
      const importedTrads = await Promise.all(
        locales.map(async (locale) => {
          try {
            const translations = await import(`./translations/${locale}.json`);
            return {
              data: prefixPluginTranslations(translations.default, PLUGIN_ID),
              locale,
            };
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(`Failed to load translations for locale ${locale}:`, err);
            return {
              data: {},
              locale,
            };
          }
        }),
      );

      return importedTrads;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to register translations:', err);
      return [];
    }
  },
};
