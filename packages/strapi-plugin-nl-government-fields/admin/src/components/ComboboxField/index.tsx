import { Field } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import ReactSelect from 'react-select';

import { InputProps } from '../../types';
import { getTranslation } from '../../utils/getTranslation';

type UplData = {
  uri: string;
  value: string;
};

type OrganizationData = {
  resourceIdentifier: string;
  prefLabel: string;
};

export interface Combobox extends InputProps {
  pluginId?: string;
  placeholderDefaultMessage?: string;
  uplData?: UplData[];
  organizationData?: OrganizationData[];
  filterValue?: string;
  onFilterValueChange?: (value: string) => void;
}

export const ComboboxField = ({
  value,
  onChange,
  name,
  label,
  required,
  attribute,
  hint,
  placeholder,
  disabled,
  error,
  organizationData,
  uplData,
  placeholderDefaultMessage,
  pluginId,
}: Combobox) => {
  const { formatMessage } = useIntl();

  const options = [
    ...(organizationData?.map(({ resourceIdentifier, prefLabel }) => ({
      value: resourceIdentifier,
      label: prefLabel,
    })) ?? []),
    ...(uplData?.map(({ uri, value }) => ({
      value: uri,
      label: value,
    })) ?? []),
  ];

  const selectedOption = options.find((option) => option.value === value) ?? null;

  return (
    <Field.Root name={name} id={name} error={error} hint={hint}>
      <Field.Label>{label}</Field.Label>
      <ReactSelect
        styles={{
          option: (provided) => ({
            ...provided,
            fontSize: '14px',
          }),
          placeholder: (provided) => ({
            ...provided,
            fontSize: '14px',
          }),
          singleValue: (provided) => ({
            ...provided,
            fontSize: '14px',
          }),
          input: (provided) => ({
            ...provided,
            fontSize: '14px',
          }),
        }}
        inputId={name}
        options={options}
        value={selectedOption}
        onChange={(option) =>
          onChange({
            target: { name, value: option?.value ?? '', type: attribute?.type },
          })
        }
        isDisabled={disabled}
        isSearchable
        required={required}
        placeholder={
          placeholder ||
          formatMessage({
            id: getTranslation(`${pluginId}.placeholder`),
            defaultMessage: placeholderDefaultMessage || 'Selecteer een optie',
          })
        }
      />
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
};
