import type { StrapiApp } from '@strapi/admin/strapi-admin';
import type { DescriptionReducer, PanelComponent } from '@strapi/content-manager/strapi-admin';

import { Initializer } from './components/Initializer';
import PreviewPanel from './components/PreviewPanel';
import { PLUGIN_ID } from './pluginId';
import reducers from './reducers';

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

export default {
  register(app: StrapiApp) {
    app.addReducers(reducers);
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  bootstrap(app: StrapiApp) {
    const { addEditViewSidePanel } = app.getPlugin('content-manager').apis as {
      addEditViewSidePanel(_reducer: DescriptionReducer<PanelComponent>): void;
    };
    addEditViewSidePanel((panels) => [...panels, PreviewPanel]);
  },

  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(/* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
              locale,
            };
          })

          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return Promise.resolve(importedTrads);
  },
};
