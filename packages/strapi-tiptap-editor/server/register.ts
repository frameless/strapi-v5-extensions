import type { Core } from '@strapi/strapi';

import { PLUGIN_ID } from '../admin/src/pluginId';

import permissions from './config/permissions';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'richtext-preview',
    plugin: PLUGIN_ID,
    type: 'string',
  });
  strapi.customFields.register({
    name: PLUGIN_ID,
    plugin: PLUGIN_ID,
    type: 'richtext',
  });

  strapi.admin.services.permission.actionProvider.registerMany(permissions.actions);
};
