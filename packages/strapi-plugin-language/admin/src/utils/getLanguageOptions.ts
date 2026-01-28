import i18nLanguages from '@cospired/i18n-iso-languages';
import enJson from '@cospired/i18n-iso-languages/langs/en.json';
import nlJson from '@cospired/i18n-iso-languages/langs/nl.json';

import { sortLanguagesAlphabetically } from './sortLanguagesAlphabetically';

i18nLanguages.registerLocale(enJson);
i18nLanguages.registerLocale(nlJson);

type LanguageOption = {
  name: string;
  code: string;
};

/**
 * Returns an array of language options with names in the target locale.
 * @param codes Array of ISO 639-1 language codes
 * @param locale Display locale code (e.g., 'en', 'nl')
 */
export const getLanguageOptions = (codes: string[], locale: string): LanguageOption[] =>
  sortLanguagesAlphabetically(
    codes?.map((code) => ({
      name: i18nLanguages.getName(code.toUpperCase(), locale) || code,
      code: code.toLowerCase(),
    })),
  );

export const languageCode = ['en', 'nl', 'ar', 'uk', 'tr'];
