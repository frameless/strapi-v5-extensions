import { Initializer } from './components/Initializer';
import { StatusBadge } from './components/StatusBadge';
import { PLUGIN_ID } from './pluginId';
import reducers from './reducers';
import '@utrecht/component-library-css';
import '@utrecht/design-tokens/dist/index.css';

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
  register(app: any) {
    app.addReducers(reducers);
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: true,
      name: PLUGIN_ID,
    });
  },

  bootstrap(app: any) {
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: 'env-label',
      Component: StatusBadge,
    });
    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'env-label',
      Component: StatusBadge,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    const importedTranslations = await Promise.all(
      locales.map((locale: any) => {
        return import(`./translations/${locale}.json`)
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

    return Promise.resolve(importedTranslations);
  },
};
