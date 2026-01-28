import { Core } from '@strapi/strapi';

import { PLUGIN_ID } from '../admin/src/pluginId';

export const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'language',
    plugin: PLUGIN_ID,
    type: 'string',
  });
};
