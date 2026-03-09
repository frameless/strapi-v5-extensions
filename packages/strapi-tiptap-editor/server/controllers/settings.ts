import type { Core } from '@strapi/strapi';

import defaultSettings from '../../utils/defaults';
import { PLUGIN_ID } from '../../admin/src/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async index(ctx: any) {
    if (strapi.store) {
      const savedSettings = await strapi.store({ type: 'plugin', name: PLUGIN_ID, key: 'settings' }).get({});

      if (savedSettings !== null) {
        // Sanitize settings before sending to prevent XSS
        const sanitizedSettings = JSON.parse(JSON.stringify(savedSettings));
        ctx.send(sanitizedSettings);
      } else {
        ctx.send(defaultSettings);
      }
    }
  },

  async updateSettings(ctx: any) {
    if (!strapi.store) {
      ctx.badRequest('Store not available');
      return;
    }

    const newSettings = ctx.request.body;
    strapi.log.info('Received settings:', newSettings);

    // Validate and sanitize input
    if (!newSettings || typeof newSettings !== 'object') {
      strapi.log.error('Invalid settings data:', newSettings);
      ctx.badRequest('Invalid settings data');
      return;
    }

    try {
      await strapi.store({ type: 'plugin', name: PLUGIN_ID, key: 'settings' }).set({ value: newSettings });

      ctx.send({ success: true, data: newSettings });
    } catch (error) {
      strapi.log.error('Failed to save settings:', error);
      ctx.internalServerError('Failed to save settings');
    }
  },
});
