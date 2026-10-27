import type { PanelComponent } from '@strapi/content-manager/strapi-admin';
import { useIntl } from 'react-intl';

import PreviewLink from '../PreviewLink';
import usePluginConfig from '../../hooks/use-plugin-config';
import { getTranslation } from '../../utils';

const PreviewPanel: PanelComponent = ({ model }) => {
  const { config } = usePluginConfig();
  const { formatMessage } = useIntl();
  const contentTypes: { uid: string; button_label?: string }[] = config?.data?.contentTypes ?? [];
  const isPreviewSupported = contentTypes.find((type) => type.uid === model);

  if (!isPreviewSupported) return null;

  return {
    title:
      isPreviewSupported.button_label ??
      formatMessage({ id: getTranslation('panel.title'), defaultMessage: 'Live Preview' }),
    content: <PreviewLink />,
  };
};

export default PreviewPanel;
