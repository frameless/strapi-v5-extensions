import ComboboxIcon from './components/ComboboxIcon';
import { PLUGIN_ID } from './pluginId';
import reducers from './reducers';
import getTranslation from './utils/getTranslation';

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

    app.customFields.register({
      name: PLUGIN_ID,
      id: PLUGIN_ID,
      type: 'string',
      icon: ComboboxIcon,
      intlLabel: {
        id: getTranslation('open-forms-embed.label'),
        defaultMessage: 'Choose an Embedded Open Form',
      },
      intlDescription: {
        id: getTranslation('open-forms-embed.description'),
        defaultMessage:
          'Upon selecting a form, its unique identifier (UUID) will be stored in the database for future reference.',
      },
      components: {
        Input: async () => import('./components/CustomCombobox'),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'form.attribute.item.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
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
