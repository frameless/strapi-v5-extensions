import { PLUGIN_ID } from '../../admin/src/pluginId';

export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/config',
      handler: `${PLUGIN_ID}.config`,
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ],
};
