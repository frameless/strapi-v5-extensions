import i18nLanguages from '@cospired/i18n-iso-languages';
import { Combobox, ComboboxOption, Field } from '@strapi/design-system';
import enJson from '@cospired/i18n-iso-languages/langs/en.json';
import nlJson from '@cospired/i18n-iso-languages/langs/nl.json';

import { getLanguageOptions, languageCode } from '../../utils/getLanguageOptions';
import { useContentLocale } from '../../hooks/useContentLocale';

i18nLanguages.registerLocale(enJson);
i18nLanguages.registerLocale(nlJson);

export interface LanguageFieldFieldInputProps {
  attribute: {
    type: string;
    customField?: string;
    options?: {
      defaultLanguage?: string;
    };
    [key: string]: unknown;
  };
  disabled: boolean;
  error?: string;
  rawError?: unknown;
  hint?: string;
  label: string;
  placeholder?: string;
  name: string;
  required: boolean;
  unique: boolean;
  type: string;
  value: string | null;
  initialValue?: string;
  mainField?: string;

  onChange: (event: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
}

export const LanguageField = ({
  value,
  onChange,
  name,
  required,
  attribute,
  type,
  placeholder,
  disabled,
  error,
  label,
  hint,
}: LanguageFieldFieldInputProps) => {
  const locale = useContentLocale();
  const languageOptions = getLanguageOptions(languageCode, locale ?? 'nl');
  const defaultLanguage = attribute.options?.defaultLanguage;

  return (
    <Field.Root name={name} id={name} error={error} hint={hint}>
      <Field.Label>{label}</Field.Label>
      <Combobox
        placeholder={placeholder}
        aria-label={label}
        aria-disabled={disabled}
        disabled={disabled}
        required={required}
        value={value || defaultLanguage}
        onChange={(code: string) => onChange({ target: { name, value: code, type } })}
      >
        {languageOptions.map(({ code, name }) => (
          <ComboboxOption value={code} key={code}>
            {name}
          </ComboboxOption>
        ))}
      </Combobox>
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
};
