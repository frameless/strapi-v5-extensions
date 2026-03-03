import type { StrapiApp } from '@strapi/strapi/admin';

import pluginPkg from '../../package.json';

import Initializer from './components/Initializer';
import { PLUGIN_ID } from './pluginId';

const name = pluginPkg.strapi.name;

const prefixPluginTranslations = (translations: Record<string, string>, pluginId: string): Record<string, string> =>
  Object.keys(translations).reduce(
    (acc, key) => {
      acc[`${pluginId}.${key}`] = translations[key];
      return acc;
    },
    {} as Record<string, string>,
  );

export default {
  register(app: StrapiApp) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  async registerTrads(app: { locales: string[] }) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      locales.map((locale) =>
        import(`./translations/${locale}.json`)
          .then(({ default: data }) => ({
            data: prefixPluginTranslations(data, PLUGIN_ID),
            locale,
          }))
          .catch(() => ({ data: {}, locale })),
      ),
    );

    return importedTrads;
  },
};
