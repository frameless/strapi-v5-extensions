import { useStrapiApp, type StrapiApp } from '@strapi/strapi/admin';
import { QueryClientProvider } from '@tanstack/react-query';

import '@utrecht/component-library-css';
import '@utrecht/design-tokens/dist/dark/index.css';
import '@utrecht/component-library-css/dist/html.css';
import '@utrecht/design-tokens/dist/index.css';

import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/ui/Initializer';
import { queryClient } from './utils/queryClient';
import { InputProps } from './types';
import { UtrechtTheme } from './components/ui/UtrechtTheme';

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
    app.addSettingsLink('global', {
      to: `/settings/${PLUGIN_ID}`,
      id: PLUGIN_ID,
      intlLabel: {
        id: `${PLUGIN_ID}.name`,
        defaultMessage: 'Strapi TipTap Editor',
      },
      Component: async () => {
        const { App } = await import('./pages/App');
        return { default: App as React.ComponentType };
      },
      permissions: [
        {
          action: 'plugin::strapi-tiptap-editor.settings.read',
          subject: null,
        },
        {
          action: 'plugin::strapi-tiptap-editor.settings.update',
          subject: null,
        },
      ],
    });

    // Register custom fields
    app.customFields.register({
      name: 'richtext-preview',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: `${PLUGIN_ID}.richtext-preview.label`,
        defaultMessage: 'Richtext Preview',
      },
      intlDescription: {
        id: `${PLUGIN_ID}.richtext-preview.description`,
        defaultMessage: 'Extracted text from the richtext field.',
      },
      components: {
        Input: async () => {
          const { RichtextPreviewInput } = await import('./components/widgets/RichtextPreviewInput');
          return { default: RichtextPreviewInput as React.ComponentType };
        },
      },
    });

    // Register TipTap editor as custom field
    app.customFields.register({
      name: PLUGIN_ID,
      pluginId: PLUGIN_ID,
      type: 'richtext',
      intlLabel: {
        id: `${PLUGIN_ID}.label`,
        defaultMessage: 'TipTap Rich Text Editor',
      },
      intlDescription: {
        id: `${PLUGIN_ID}.description`,
        defaultMessage: 'Advanced rich text editor with TipTap.',
      },
      components: {
        Input: async () => {
          const { default: WysiwygComponent } = await import('./components/ui/Wysiwyg/WysiwygContent');
          const WrappedWysiwyg = (props: InputProps) => {
            const components = useStrapiApp('TipTapEditor', (state) => state.components);

            return (
              <QueryClientProvider client={queryClient}>
                <UtrechtTheme>
                  <WysiwygComponent {...props} mediaLibraryComponent={components?.['media-library']} />
                </UtrechtTheme>
              </QueryClientProvider>
            );
          };

          return { default: WrappedWysiwyg as React.ComponentType };
        },
      },
    });

    // Register plugin
    app.registerPlugin({
      id: PLUGIN_ID,
      isReady: true,
      initializer: Initializer,
      name: PLUGIN_ID,
    });
  },

  bootstrap() {},

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
