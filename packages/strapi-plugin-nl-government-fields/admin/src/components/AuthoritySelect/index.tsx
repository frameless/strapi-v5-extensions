import { InputProps } from '../../types';
import { ComboboxField } from '../ComboboxField';

export const schemeData = [
  { resourceIdentifier: '{http://standaarden.overheid.nl/owms/terms/}Gemeente', prefLabel: 'Gemeente' },
  { resourceIdentifier: '{http://standaarden.overheid.nl/owms/terms/}Provincie', prefLabel: 'Provincie' },
  { resourceIdentifier: '{http://standaarden.overheid.nl/owms/terms/}Waterschap', prefLabel: 'Waterschap' },
  { resourceIdentifier: '{http://standaarden.overheid.nl/owms/terms/}GGD', prefLabel: 'GGD' },
  { resourceIdentifier: '{http://standaarden.overheid.nl/owms/terms/}Koninkrijksdeel', prefLabel: 'Koninkrijksdeel' },
];

export const AuthoritySelect = (props: InputProps) => {
  const pluginId = props.attribute.customField?.replace('plugin::nl-government-fields.', '');
  return (
    <ComboboxField
      {...props}
      value={props.value || props.attribute.default}
      pluginId={pluginId}
      organizationData={schemeData}
      placeholderDefaultMessage="Selecteer een organisatie type"
    />
  );
};
