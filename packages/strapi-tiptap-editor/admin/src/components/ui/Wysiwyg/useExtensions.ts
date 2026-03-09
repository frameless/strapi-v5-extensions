import { Extensions } from '@tiptap/react';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { getBaseExtensions } from './base';
import { getFormattingExtensions } from './formatting';
import { getBlockExtensions } from './blocks';
import { getMediaExtensions } from './media';
import { getCustomExtensions } from './custom';

interface UseExtensionsOptions {
  settings: any; // Replace with your settings type
}

export const useExtensions = ({ settings }: UseExtensionsOptions): Extensions => {
  const { formatMessage } = useIntl();

  return useMemo(() => {
    const extensions: Extensions = [
      // Base extensions (always included)
      ...getBaseExtensions({ formatMessage }),

      // Formatting extensions (conditional)
      ...getFormattingExtensions({ settings }),

      // Block extensions (conditional)
      ...getBlockExtensions({ settings }),

      // Media extensions (conditional)
      ...getMediaExtensions({ settings }),

      // Custom extensions (conditional)
      ...getCustomExtensions({ settings }),
    ];

    // Filter out null values from conditional extensions
    return extensions.filter(Boolean);
  }, [settings, formatMessage]);
};
