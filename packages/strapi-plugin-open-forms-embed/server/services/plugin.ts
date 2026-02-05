import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../admin/src/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getConfig() {
    const data = strapi.config.get(`plugin::${PLUGIN_ID}`);
    return data;
  },
});
