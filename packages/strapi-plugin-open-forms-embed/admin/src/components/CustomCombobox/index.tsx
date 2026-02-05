import { Combobox, ComboboxOption, Field, TextInput } from '@strapi/design-system';
import { useEffect, useState } from 'react';

import usePluginConfig from '../../hooks/use-plugin-config';

type OpenFormsDataParams = {
  uuid: string;
  slug: string;
  label?: string;
  embed_url: string;
  name?: string;
};
export interface OpenFormsFieldInputProps {
  attribute: {
    type: string;
  };
  disabled: boolean;
  error?: string;
  hint?: string;
  label: string;
  placeholder?: string;
  name: string;
  required: boolean;
  value: string | null;
  type: string;

  onChange: (event: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
}

export const OpenFormsField = ({
  value,
  onChange,
  name,
  required,
  type,
  placeholder,
  disabled,
  error,
  label,
  hint,
}: OpenFormsFieldInputProps) => {
  const [openForms, setOpenForms] = useState<OpenFormsDataParams[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { config } = usePluginConfig();

  const apiUrl = config?.api_url?.endsWith('/') ? `${config.api_url}public/forms` : `${config?.api_url}/public/forms`;

  useEffect(() => {
    if (!config?.api_url || !config?.token) return;

    const fetchAllOpenForms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Token ${config.token}`,
          },
        });

        const { results } = await response.json();
        setOpenForms(results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllOpenForms();
  }, [config, apiUrl]);

  const generateOpenFormsData = (params: OpenFormsDataParams) => new URLSearchParams({ ...params }).toString();

  const parseFormValue = (query?: string | null): Record<string, string> =>
    query ? Object.fromEntries(new URLSearchParams(query)) : {};

  const selectedForm = parseFormValue(value);

  const isValueInOptions = openForms
    .map((form) =>
      generateOpenFormsData({
        uuid: form.uuid,
        slug: form.slug,
        label: form.label || form.name,
        embed_url: config.embed_url,
      }),
    )
    .includes(value ?? '');

  if (!config?.api_url || !config?.token) {
    return (
      <Field.Root
        name={name}
        error={error}
        hint="Configure OPEN_FORMS_API_URL and OPEN_FORMS_API_TOKEN to enable this field."
      >
        <Field.Label>{label}</Field.Label>

        <TextInput name={name} value="" placeholder="Open Forms is not configured" disabled />

        <Field.Hint />
        <Field.Error />
      </Field.Root>
    );
  }

  return (
    <Field.Root name={name} error={error} hint={hint} required={required}>
      <Field.Label>{label}</Field.Label>

      <Combobox
        placeholder={placeholder}
        aria-label={label}
        disabled={disabled}
        required={required}
        value={value ?? ''}
        loading={isLoading}
        onChange={(url: string) => onChange({ target: { name, value: url, type } })}
      >
        {openForms.map(({ uuid, name, slug }) => (
          <ComboboxOption
            key={uuid}
            value={generateOpenFormsData({
              uuid,
              slug,
              label: name,
              embed_url: config.embed_url,
            })}
          >
            {name}
          </ComboboxOption>
        ))}

        {!isValueInOptions && selectedForm?.label && (
          <ComboboxOption value={value ?? ''}>{selectedForm.label}</ComboboxOption>
        )}
      </Combobox>

      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
};
