import HeadingExtension from '@tiptap/extension-heading';
import ListItemExtension from '@tiptap/extension-list-item';
import BulletListExtension from '@tiptap/extension-bullet-list';
import OrderedListExtension from '@tiptap/extension-ordered-list';
import BlockquoteExtension from '@tiptap/extension-blockquote';
import HorizontalRuleExtension from '@tiptap/extension-horizontal-rule';
import HardBreakExtension from '@tiptap/extension-hard-break';
import CharacterCountExtension from '@tiptap/extension-character-count';
import { Extensions } from '@tiptap/react';

import { BlockExtensionsOptions } from './types';

// Custom ordered list without input rules
const CustomOrderedList = OrderedListExtension.extend({
  addInputRules() {
    return [];
  },
});

export const getBlockExtensions = ({ settings }: BlockExtensionsOptions): Extensions => {
  const extensions: Extensions = [
    // Headings with ID support
    HeadingExtension.extend({
      addGlobalAttributes() {
        return [
          {
            types: ['heading'],
            attributes: {
              id: {
                default: null,
              },
            },
          },
        ];
      },
    }),

    // Lists
    ListItemExtension,
    BulletListExtension,
    settings.disableOrderedListShorthand ? CustomOrderedList : OrderedListExtension,
  ];

  // Other blocks
  if (settings.blockquote) {
    extensions.push(BlockquoteExtension);
  }

  if (settings.horizontal) {
    extensions.push(HorizontalRuleExtension);
  }

  if (settings.hardbreak) {
    extensions.push(HardBreakExtension);
  }

  // Utilities
  if (settings.other.wordcount) {
    extensions.push(CharacterCountExtension.configure());
  }

  return extensions;
};
