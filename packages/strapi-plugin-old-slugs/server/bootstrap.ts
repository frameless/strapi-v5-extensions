import type { Core } from '@strapi/strapi';

export type ContentTypes = {
  uid: string;
};
export interface Config {
  contentTypes?: ContentTypes[];
}

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const config = strapi.config.get('plugin.old-slugs', {}) as Config;

  if (!config?.contentTypes?.length) return;

  strapi.db.lifecycles.subscribe({
    models: config.contentTypes.map((ct) => ct.uid),

    async beforeUpdate(event) {
      const { where, data } = event.params;
      if (!where?.id || !data?.slug) return;

      const existingEntry = await strapi.db.query(event.model.uid).findOne({
        where: { id: where.id },
      });

      if (!existingEntry) return;
      if (existingEntry.slug !== data.slug) {
        const previousSlugs = existingEntry.oldSlugs || [];

        if (!previousSlugs.includes(existingEntry.slug)) {
          data.oldSlugs = [...previousSlugs, existingEntry.slug];
        }
      }
    },
  });
};
