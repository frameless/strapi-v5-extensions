import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { PriceTypes, ProductPrice } from '../../../types';

import Widget from './widget';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    priceWidget: {
      insertPriceWidget: (_price: PriceTypes) => ReturnType;
    };
  }

  interface Storage {
    productPrices: ProductPrice | null;
  }
}

export const Price = Node.create({
  name: 'priceWidget',
  group: 'inline',
  content: 'inline*',
  atom: true,
  inline: true,
  draggable: false,

  addAttributes() {
    return {
      'data-strapi-idref': {
        default: '',
      },
      'data-strapi-category': {
        default: 'price',
      },
    };
  },
  addCommands() {
    return {
      insertPriceWidget:
        (price) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'priceWidget',
            attrs: {
              'data-strapi-idref': price.uuid,
            },
          });
        },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          if (element?.hasAttribute('data-strapi-idref')) {
            return {
              'data-strapi-idref': element.getAttribute('data-strapi-idref'),
            };
          }

          return false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-strapi-idref': HTMLAttributes['data-strapi-idref'],
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Widget);
  },
});
