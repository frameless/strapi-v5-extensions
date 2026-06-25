import { LinkButton } from '@strapi/design-system';
import {
  unstable_useContentManagerContext as useContentManagerContext,
  unstable_useDocument as useDocument,
} from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import usePluginConfig from '../../hooks/use-plugin-config';
import { getPreviewUrl, getTranslation, getUrl } from '../../utils';
import { useContentLocale } from '../../hooks/useContentLocale';

const StyledLinkButton = styled(LinkButton)`
  inline-size: 100%;
`;

const PreviewLink = () => {
  const context = useContentManagerContext();
  const locale = useContentLocale();
  const { slug, id: documentId, model } = context;
  const data = useDocument({
    model: model,
    documentId,
    collectionType: 'collection-types',
  });
  const { config } = usePluginConfig();
  const { formatMessage } = useIntl();

  const mappingStatus = {
    modified: 'DRAFT',
    published: 'PUBLISHED',
  };

  const contentTypes = config?.data?.contentTypes || [];
  const isPreviewSupported = contentTypes.find((type: { uid: string }) => type.uid === slug);

  const previewInPageButtonLabel = formatMessage({
    id: getTranslation('button.pagePreview'),
    defaultMessage: 'Voorbeeld',
  });

  const url = getUrl(config?.data?.domain);

  if (!isPreviewSupported) return null;

  const previewUrl = getPreviewUrl({
    url,
    secret: config.data.preview_secret_token,
    apiToken: config.data.api_token,
    type: isPreviewSupported.query.type,
    slug: isPreviewSupported.query.type,
    locale: locale ?? 'nl',
    uuid: documentId,
    status: mappingStatus[(data.document as any)?.status as keyof typeof mappingStatus] ?? 'DRAFT',
  });

  return (
    <StyledLinkButton
      size="S"
      variant="tertiary"
      className="utrecht-preview-link"
      target="_blank"
      href={previewUrl?.href}
      rel="noopener noreferrer"
      title={previewInPageButtonLabel}
      aria-label={previewInPageButtonLabel}
    >
      {isPreviewSupported?.button_label ?? previewInPageButtonLabel}
    </StyledLinkButton>
  );
};

export default PreviewLink;
