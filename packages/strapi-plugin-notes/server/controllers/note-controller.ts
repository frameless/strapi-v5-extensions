import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::entity-notes.note', ({ strapi }) => ({
  async findByDocument(ctx) {
    const { entitySlug, documentId } = ctx.query;
    if (!entitySlug || !documentId) {
      return ctx.badRequest('entitySlug and documentId are required');
    }

    try {
      // Get document info to find legacy ID
      let legacyId = null;
      try {
        const document = await strapi.db.query(entitySlug as string).findOne({
          where: { documentId: documentId as string },
        });
        legacyId = document?.id;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching document for ${entitySlug} with documentId ${documentId}:`, error);
        // Document fetch failed, continue with just documentId
      }

      // Build filters for both new and legacy formats
      const entityIdFilters = [documentId];
      if (legacyId) {
        entityIdFilters.push(legacyId, String(legacyId));
      }

      // Query notes with server-side filtering
      const notes = await strapi.db.query('plugin::entity-notes.note').findMany({
        where: {
          entitySlug: { $eq: entitySlug },
          entityId: { $in: entityIdFilters },
        },
        orderBy: [{ updatedAt: 'desc' }, { title: 'asc' }],
      });

      return { data: notes };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return ctx.internalServerError('Failed to fetch notes', { error: errorMessage });
    }
  },
}));
