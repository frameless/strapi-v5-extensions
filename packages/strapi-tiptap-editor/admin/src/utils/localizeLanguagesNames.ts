import i18nLanguages from '@cospired/i18n-iso-languages';
import enI18Json from '@cospired/i18n-iso-languages/langs/en.json';
import nlI18Json from '@cospired/i18n-iso-languages/langs/nl.json';

import { LanguagesType } from '../types';

i18nLanguages.registerLocale(enI18Json);
i18nLanguages.registerLocale(nlI18Json);

export const localizeLanguagesNames = (languages: LanguagesType[], locale: string = 'nl') =>
  languages?.map(({ code, name }) => ({
    code,
    name: code ? i18nLanguages.getName(code, locale) : name,
  }));
