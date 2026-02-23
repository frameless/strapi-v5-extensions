import data from '../dist/gemeente.json';

export interface GemeenteValue {
  prefLabel: string;
  resourceIdentifier: string;
  endDate?: string;
  startDate?: string;
}

export interface GemeenteData {
  cv: {
    '@xmlns:overheid': string;
    '@name': string;
    value: GemeenteValue[];
  };
}
export const gemeente: GemeenteData = data;
export default gemeente;
export type Gemeente = GemeenteData;
