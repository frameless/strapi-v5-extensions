import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Extensions } from '@tiptap/react';

import CustomTable from '../../../tiptap/extensions/CustomTable';
import { Language } from '../../../tiptap/extensions/Language';
import { LeadParagraph } from '../../../tiptap/extensions/LeadParagraph/index';
import { Price } from '../../../tiptap/extensions/Price/index';
import { TableCaption } from '../../../tiptap/extensions/TableCaption';
import { TableFigure } from '../../../tiptap/extensions/TableFigure';

import { CustomExtensionsOptions } from './types';

export const getCustomExtensions = ({ settings }: CustomExtensionsOptions): Extensions => {
  const extensions: Extensions = [
    // Custom text extensions
    LeadParagraph,
    Price,

    // Table extensions (always included in your case)
    CustomTable.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TableCaption,
    TableFigure,
  ];

  // Language extension (conditional based on enabled flag)
  if (settings.other.language.enabled) {
    extensions.push(Language);
  }

  return extensions;
};
