import { Extensions } from '@tiptap/react';
import { IntlFormatters } from 'react-intl';

/**
 * Language configuration for the language selector
 */
export interface LanguageOption {
  name: string;
  code: string;
}

/**
 * Settings structure for the editor
 * Matches the structure from defaultSettings
 */
export interface EditorSettings {
  headings: string[];
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  blockquote: boolean;
  highlight: boolean;
  align: string[];
  lists: string[];
  disableOrderedListShorthand: boolean;
  columns: string[];
  table: boolean;
  hardbreak: boolean;
  horizontal: boolean;
  links: {
    enabled: boolean;
    autolink: boolean;
    openOnClick: boolean;
    linkOnPaste: boolean;
    relAttribute: boolean;
    HTMLAttributes: {
      rel: string;
    };
  };
  image: {
    enabled: boolean;
    inline: boolean;
    allowBase64: boolean;
  };
  other: {
    wordcount: boolean;
    language: {
      enabled: boolean;
      default: LanguageOption[];
    };
    saveJson: boolean;
  };
  youtube: {
    enabled: boolean;
    height: number;
    width: number;
  };
}

/**
 * Options for base extensions
 */
export interface BaseExtensionsOptions {
  formatMessage: IntlFormatters['formatMessage'];
}

/**
 * Options for formatting extensions
 */
export interface FormattingExtensionsOptions {
  settings: EditorSettings;
}

/**
 * Options for block extensions
 */
export interface BlockExtensionsOptions {
  settings: EditorSettings;
}

/**
 * Options for media extensions
 */
export interface MediaExtensionsOptions {
  settings: EditorSettings;
}

/**
 * Options for custom extensions
 */
export interface CustomExtensionsOptions {
  settings: EditorSettings;
}

/**
 * Options for useExtensions hook
 */
export interface UseExtensionsOptions {
  settings: EditorSettings;
}

/**
 * Type for extension getter functions
 */
export type ExtensionGetter<T = any> = (options: T) => Extensions;
