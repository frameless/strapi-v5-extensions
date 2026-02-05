import { pluginId } from '../util/plugin-id';

export default ({ strapi }: { strapi: any }) => {
  strapi.customFields.register({
    name: pluginId,
    plugin: pluginId,
    type: 'string',
  });
};
