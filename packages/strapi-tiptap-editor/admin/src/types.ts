export type LanguagesType = {
  name?: string;
  code: string;
};

export type PriceTypes = {
  value: number;
  label: string;
  currency: string;
  id: string;
  uuid?: string;
};

export interface ProductPrice {
  title: string;
  uuid: string;
  price: PriceTypes[];
  documentId?: string;
}

export type PriceListTypes = {
  title: string;
  price: PriceTypes[];
};

export interface InputProps {
  attribute: {
    type: string;
    customField?: string;
    options?: {
      defaultLanguage?: string;
    };
    [key: string]: unknown;
  };
  mediaLibraryComponent?: any;
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
  value: string;
  initialValue?: string;
  mainField?: string;

  onChange: (_event: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
}
