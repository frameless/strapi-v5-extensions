import { Core } from '@strapi/strapi';

import { PLUGIN_ID } from '../admin/src/pluginId';

export const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'uniform-product-name',
    plugin: PLUGIN_ID,
    type: 'string',
  });
  strapi.customFields.register({
    name: 'authority-select',
    plugin: PLUGIN_ID,
    type: 'string',
  });
  strapi.customFields.register({
    name: 'gemeente-select',
    plugin: PLUGIN_ID,
    type: 'string',
  });
};
