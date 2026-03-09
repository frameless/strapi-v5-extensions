import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

import { PLUGIN_ID } from '../../admin/src/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async config(ctx: Context) {
    try {
      const config = await strapi.plugin(PLUGIN_ID).service('plugin').getConfig();

      if (!config?.api_url || !config?.token) {
        ctx.body = { config };
        return;
      }
      const response = await fetch(`${config.api_url}/block-publications?type=CHECK`, {
        headers: {
          'x-api-key': config.token,
        },
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const checks = await response.json();
      ctx.body = { config, checks };
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
      ctx.badRequest(`Failed to load ${PLUGIN_ID} config: ${error.message}`);
    }
  },
});
