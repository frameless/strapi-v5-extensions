import BoldExtension from '@tiptap/extension-bold';
import ItalicExtension from '@tiptap/extension-italic';
import StrikeExtension from '@tiptap/extension-strike';
import UnderlineExtension from '@tiptap/extension-underline';
import CodeExtension from '@tiptap/extension-code';
import CodeBlockExtension from '@tiptap/extension-code-block';
import HighlightExtension from '@tiptap/extension-highlight';
import TextAlignExtension from '@tiptap/extension-text-align';
import TextStyleExtension from '@tiptap/extension-text-style';
import { Extensions } from '@tiptap/react';

import { FormattingExtensionsOptions } from './types';

export const getFormattingExtensions = ({ settings }: FormattingExtensionsOptions): Extensions => {
  const extensions: Extensions = [
    // Always included formatting
    BoldExtension,
    ItalicExtension,
    StrikeExtension,
    UnderlineExtension,
    TextStyleExtension,

    // Text alignment
    TextAlignExtension.configure({
      types: ['heading', 'paragraph'],
    }),
  ];

  // Conditional formatting
  if (settings.code) {
    extensions.push(CodeExtension);
    extensions.push(CodeBlockExtension);
  }

  if (settings.highlight) {
    extensions.push(HighlightExtension.configure({ multicolor: true }));
  }

  return extensions;
};
