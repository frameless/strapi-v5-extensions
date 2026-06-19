import type { PanelComponent } from '@strapi/content-manager/strapi-admin';

import PreviewLink from '../PreviewLink';
import usePluginConfig from '../../hooks/use-plugin-config';

const PreviewPanel: PanelComponent = ({ model }) => {
  const { config } = usePluginConfig();
  const contentTypes: { uid: string; button_label?: string }[] = config?.data?.contentTypes ?? [];
  const isPreviewSupported = contentTypes.find((type) => type.uid === model);

  if (!isPreviewSupported) return null;

  return {
    title: isPreviewSupported.button_label ?? 'Voorbeeld op pagina',
    content: <PreviewLink />,
  };
};

export default PreviewPanel;
