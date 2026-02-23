import type { StrapiApp } from '@strapi/strapi/admin';
import type { ComponentType } from 'react';
import gemeente from '@frameless/catalogi-data';

import { AuthorityIcon, GemeenteIcon, UPLIcon } from './components/UPLSelectIcon';
import { PLUGIN_ID } from './pluginId';
import { getTranslation } from './utils/getTranslation';
import { schemeData } from './components/AuthoritySelect';

// ---------------------------------------------------------------------------
// Translation helpers
// ---------------------------------------------------------------------------

type TranslateOptions = Record<string, string>;

const prefixPluginTranslations = (translate: TranslateOptions, pluginId: string): TranslateOptions => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(translate).reduce<TranslateOptions>((acc, current) => {
    acc[`${pluginId}.${current}`] = translate[current];
    return acc;
  }, {});
};

// ---------------------------------------------------------------------------
// Shared option building blocks
//
// `options` on a select item is missing from Strapi 5's CustomFieldOption type
// (upstream bug). The `as any` cast is scoped to only those select item objects.
// ---------------------------------------------------------------------------

interface SelectOption {
  key: string;
  value: string;
  metadatas: {
    intlLabel: {
      id: string;
      defaultMessage: string;
    };
  };
}

const buildSelectOptions = (items: Array<{ prefLabel: string; resourceIdentifier: string }>): SelectOption[] => [
  {
    key: '__null_reset_value__',
    value: '',
    metadatas: {
      intlLabel: {
        id: 'components.InputSelect.option.placeholder',
        defaultMessage: 'Choose here',
      },
    },
  },
  ...items.map(({ prefLabel, resourceIdentifier }) => ({
    key: resourceIdentifier,
    value: resourceIdentifier,
    metadatas: {
      intlLabel: {
        id: `components.InputSelect.option.${resourceIdentifier}`,
        defaultMessage: prefLabel,
      },
    },
  })),
];

const requiredFieldOption = {
  name: 'required' as const,
  type: 'checkbox' as const,
  intlLabel: {
    id: 'form.attribute.item.requiredField',
    defaultMessage: 'Required field',
  },
  description: {
    id: 'form.attribute.item.requiredField.description',
    defaultMessage: "You won't be able to create an entry if this field is empty",
  },
};

const advancedOptions = [
  {
    sectionTitle: {
      id: 'global.settings',
      defaultMessage: 'Settings',
    },
    items: [requiredFieldOption],
  },
];

const buildDefaultSelectOption = (selectOptions: SelectOption[]) =>
  // `as any` is required because Strapi 5's CustomFieldOption type is missing
  // the `options` property for select items — this is an upstream type bug.
  ({
    name: 'default' as const,
    type: 'select' as const,
    intlLabel: {
      id: 'form.attribute.item.defaultField',
      defaultMessage: 'Default Value',
    },
    description: {
      id: 'form.attribute.item.defaultField.description',
      defaultMessage: 'A default value is a preset choice when no other is given',
    },
    options: selectOptions,
  }) as any;

// ---------------------------------------------------------------------------
// Plugin registration
// ---------------------------------------------------------------------------

export default {
  register(app: StrapiApp) {
    app.customFields.register({
      name: 'uniform-product-name',
      pluginId: PLUGIN_ID,
      type: 'string',
      icon: UPLIcon,
      intlLabel: {
        id: getTranslation('uniform-product-name.label'),
        defaultMessage: 'Uniforme Productnaam',
      },
      intlDescription: {
        id: getTranslation('uniform-product-name.description'),
        defaultMessage: 'Kies een uniforme productnaam',
      },
      components: {
        Input: async () => {
          const { UPLSelect } = await import('./components/UPLSelect');
          return { default: UPLSelect as ComponentType };
        },
      },
      options: {
        advanced: advancedOptions,
      },
    });

    app.customFields.register({
      name: 'authority-select',
      pluginId: PLUGIN_ID,
      type: 'string',
      icon: AuthorityIcon,
      intlLabel: {
        id: getTranslation('authority-select.label'),
        defaultMessage: 'Bevoegd gezag',
      },
      intlDescription: {
        id: getTranslation('authority-select.description'),
        defaultMessage: 'Kies een type bevoegd gezag',
      },
      components: {
        Input: async () => {
          const { AuthoritySelect } = await import('./components/AuthoritySelect');
          return { default: AuthoritySelect as ComponentType };
        },
      },
      options: {
        base: [buildDefaultSelectOption(buildSelectOptions(schemeData ?? []))],
        advanced: advancedOptions,
      },
    });

    app.customFields.register({
      name: 'gemeente-select',
      pluginId: PLUGIN_ID,
      type: 'string',
      icon: GemeenteIcon,
      intlLabel: {
        id: getTranslation('gemeente-select.label'),
        defaultMessage: 'Gemeente',
      },
      intlDescription: {
        id: getTranslation('gemeente-select.description'),
        defaultMessage: 'Kies een gemeente',
      },
      components: {
        Input: async () => {
          const { GemeenteSelect } = await import('./components/GemeenteSelect');
          return { default: GemeenteSelect as ComponentType };
        },
      },
      options: {
        base: [buildDefaultSelectOption(buildSelectOptions(gemeente.cv.value ?? []))],
        advanced: advancedOptions,
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale: string) =>
        import(`./translations/${locale}.json`)
          .then(({ default: data }: { default: TranslateOptions }) => ({
            data: prefixPluginTranslations(data, PLUGIN_ID),
            locale,
          }))
          .catch(() => ({
            data: {},
            locale,
          })),
      ),
    );

    return importedTrads;
  },
};
