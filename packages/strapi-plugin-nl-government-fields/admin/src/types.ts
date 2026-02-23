export interface InputProps {
  attribute: {
    type: string;
    customField?: string;
    default: string | null;
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
