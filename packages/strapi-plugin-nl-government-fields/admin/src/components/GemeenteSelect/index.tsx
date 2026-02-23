import gemeente from '@frameless/catalogi-data';

import { InputProps } from '../../types';
import { ComboboxField } from '../ComboboxField';

const allGemeenten = gemeente.cv.value?.filter((item) => !item?.endDate || new Date(item.endDate) > new Date()) ?? [];

export const GemeenteSelect = (props: InputProps) => {
  const pluginId = props.attribute.customField?.replace('plugin::nl-government-fields.', '');

  return (
    <ComboboxField
      {...props}
      value={props.value || props.attribute.default}
      pluginId={pluginId}
      organizationData={allGemeenten}
      placeholderDefaultMessage="Selecteer een gemeente"
    />
  );
};
