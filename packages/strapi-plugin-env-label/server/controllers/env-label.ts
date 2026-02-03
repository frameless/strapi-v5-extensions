import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

import { PLUGIN_ID } from '../../admin/src/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async config(ctx: Context): Promise<void> {
    try {
      const config = await strapi.plugin(PLUGIN_ID).service('plugin').getConfig();
      ctx.body = config;
    } catch (error) {
      strapi.log.error('Error fetching environment label config:', error);
      ctx.badRequest('Something went wrong with the environment label config');
    }
  },
});
