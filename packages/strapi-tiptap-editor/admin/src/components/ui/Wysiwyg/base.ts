import DocumentExtension from '@tiptap/extension-document';
import GapcursorExtension from '@tiptap/extension-gapcursor';
import ParagraphExtension from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import TextExtension from '@tiptap/extension-text';
import StarterKit from '@tiptap/starter-kit';
import Details from '@tiptap/extension-details';
import DetailsContent from '@tiptap/extension-details-content';
import DetailsSummary from '@tiptap/extension-details-summary';
import { Extensions } from '@tiptap/react';
import { IntlFormatters } from 'react-intl';

import { getTranslation } from '../../../utils';

interface BaseExtensionsOptions {
  formatMessage: IntlFormatters['formatMessage'];
}

export const getBaseExtensions = ({ formatMessage }: BaseExtensionsOptions): Extensions => {
  return [
    StarterKit,
    DocumentExtension,
    TextExtension,
    ParagraphExtension,
    GapcursorExtension,

    // Details/Accordion
    Details.configure({
      persist: true,
      HTMLAttributes: {
        class: 'utrecht-details',
      },
    }),
    DetailsSummary.configure({
      HTMLAttributes: {
        class: 'utrecht-details__summary',
      },
    }),
    DetailsContent.configure({
      HTMLAttributes: {
        class: 'utrecht-details__content',
      },
    }),

    // Placeholder
    Placeholder.configure({
      includeChildren: true,
      showOnlyWhenEditable: true,
      placeholder: ({ node }) => {
        if (node.type.name === 'detailsSummary') {
          return formatMessage({
            id: getTranslation('components.editor.placeholder.detailsSummary'),
            defaultMessage: 'Type the accordion title here...',
          });
        }
        if (node.type.name === 'detailsContent') {
          return formatMessage({
            id: getTranslation('components.editor.placeholder.detailsContent'),
            defaultMessage: 'Type the accordion content here...',
          });
        }
        return '';
      },
    }),
  ];
};
