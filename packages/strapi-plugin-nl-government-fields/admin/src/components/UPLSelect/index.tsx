import { uplKeyValues } from '@frameless/upl';

import { InputProps } from '../../types';
import { ComboboxField } from '../ComboboxField';

export const UPLSelect = (props: InputProps) => {
  const pluginId = props.attribute.customField?.replace('plugin::nl-government-fields.', '');

  return (
    <ComboboxField
      {...props}
      pluginId={pluginId}
      uplData={uplKeyValues}
      placeholderDefaultMessage="Voer de uniforme productnaam in"
    />
  );
};
