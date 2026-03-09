import DOMPurify from 'dompurify';
import truncate from 'lodash.truncate';

interface GenerateLabelData {
  name: string;
  content: string;
  truncateLength?: number;
}

interface GenerateLabelReturnType {
  label: string;
  name: string;
  labelKey: string;
  content: string;
}

export const generateLabel = ({ name, content, truncateLength = 70 }: GenerateLabelData): GenerateLabelReturnType => {
  // check if content is empty or just empty HTML tags
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  const decodedContent =
    new DOMParser().parseFromString(sanitizedContent, 'text/html').documentElement.textContent || '';

  const plainText = decodedContent
    .replace(/<[^>]*>|(\s|\u00A0)+/g, (match) => (match.startsWith('<') ? '' : ' '))
    .trim();

  // if plainText is empty after all processing, return empty
  if (!plainText) {
    return { label: '', name, labelKey: '', content: '' };
  }

  // truncate text safely without cutting words
  const label = truncate(plainText, {
    length: truncateLength,
    separator: /,? +/,
  });

  // generate a unique label key
  const labelKey = `richtextContent_${name}`;

  return { label, name, labelKey, content };
};

interface DispatchLabelProps extends GenerateLabelData {
  key: string;
  label: string;
}

export const dispatchLabel = ({ content, label, key, name }: DispatchLabelProps) => {
  try {
    if (typeof window === 'undefined') return;

    // dispatch a custom event to notify about the label update
    window.dispatchEvent(
      new CustomEvent('labelUpdated', {
        detail: { key, label, name, value: content },
      }),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in strapi-preview-button dispatching label update:', error);
  }
};
