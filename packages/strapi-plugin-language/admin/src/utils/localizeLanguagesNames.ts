import i18nLanguages from '@cospired/i18n-iso-languages';
import enJson from '@cospired/i18n-iso-languages/langs/en.json';
import nlJson from '@cospired/i18n-iso-languages/langs/nl.json';

import { LanguagesType } from './types';
i18nLanguages.registerLocale(enJson);
i18nLanguages.registerLocale(nlJson);

export const localizeLanguagesNames = (languages: LanguagesType[], locale: string = 'nl') =>
  languages?.map(({ code, name }) => ({
    code,
    name: code ? i18nLanguages.getName(code, locale) : name,
  }));
