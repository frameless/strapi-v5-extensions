import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

import { PLUGIN_ID } from '../../admin/src/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async config(ctx: Context): Promise<void> {
    try {
      const config = await strapi.plugin(PLUGIN_ID).service('plugin').getConfig();
      ctx.body = config;
    } catch (error) {
      strapi.log.error('Error fetching Open Forms Embed config:', error);
      ctx.badRequest('Something went wrong with the open-forms-embed config');
    }
  },
});
