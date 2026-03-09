import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import YouTubeExtension from '@tiptap/extension-youtube';
import { Extensions } from '@tiptap/react';

import { MediaExtensionsOptions } from './types';

export const getMediaExtensions = ({ settings }: MediaExtensionsOptions): Extensions => {
  const extensions: Extensions = [];

  // Links
  if (settings.links.enabled) {
    extensions.push(
      LinkExtension.configure({
        autolink: settings.links.autolink,
        openOnClick: settings.links.openOnClick,
        linkOnPaste: settings.links.linkOnPaste,
        HTMLAttributes: {
          rel: settings.links.HTMLAttributes.rel,
        },
      }),
    );
  }

  // Images
  if (settings.image.enabled) {
    extensions.push(
      ImageExtension.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: { default: null },
            height: { default: null },
            loading: { default: null },
            'data-figcaption': { default: null },
            renderHTML: (attributes: any) => {
              return {
                width: attributes.width,
                height: attributes.height,
                'data-figcaption': attributes?.caption,
                loading: attributes.loading,
              };
            },
          };
        },
      }).configure({
        inline: settings.image.inline,
        allowBase64: settings.image.allowBase64,
      }),
    );
  }

  // YouTube
  if (settings.youtube.enabled) {
    extensions.push(
      YouTubeExtension.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            'data-title': {
              default: null,
              parseHTML: (element) => element.getAttribute('data-title'),
              renderHTML: (attributes) => {
                if (!attributes['data-title']) return {};
                return {
                  'data-title': attributes['data-title'],
                };
              },
            },
          };
        },
      }).configure({
        inline: false,
      }),
    );
  }

  return extensions;
};
