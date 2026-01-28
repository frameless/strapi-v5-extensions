import { getTranslation } from './utils/getTranslation';
import { LanguageFieldIcon } from './components/LanguageFieldIcon';
import { PLUGIN_ID } from './pluginId';
import { getLanguageOptions, languageCode } from './utils/getLanguageOptions';
import { getCurrentContentLocale } from './utils/getCurrentContentLocale';

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
    const locale = getCurrentContentLocale() || 'nl';
    const optionsForStrapi = getLanguageOptions(languageCode, locale).map((lang) => ({
      key: lang.code,
      value: lang.code,
      metadatas: {
        intlLabel: {
          id: `${PLUGIN_ID}.${lang.code}`,
          defaultMessage: lang.name,
        },
      },
    }));
    app.customFields.register({
      name: PLUGIN_ID,
      pluginId: PLUGIN_ID,
      type: 'string',
      icon: LanguageFieldIcon,
      intlLabel: {
        id: getTranslation(`${PLUGIN_ID}.label`),
        defaultMessage: 'Select language',
      },
      intlDescription: {
        id: getTranslation(`${PLUGIN_ID}.description`),
        defaultMessage: 'Select language',
      },
      components: {
        Input: async () =>
          import('./components/LanguageField').then((module) => ({
            default: module.LanguageField,
          })),
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

              {
                intlLabel: {
                  id: 'my-plugin.settings.defaultLanguage',
                  defaultMessage: 'Default language',
                },
                name: 'options.defaultLanguage',
                type: 'select',
                options: optionsForStrapi,
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
