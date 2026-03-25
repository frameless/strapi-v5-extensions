import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getProducts(ctx: Context) {
    const products = await strapi
      .plugin('content-compliance-checker')
      .service('content-compliance-checker')
      .findProductsWithNoneKennisartikelBlocks();

    ctx.body = products;
    ctx.status = 200;
  },

  async getProductBlocks(ctx: Context) {
    const { id } = ctx.params;

    if (id === null || id === '') {
      ctx.badRequest('Product ID is required');
      return;
    }

    const productBlocks = await strapi
      .plugin('content-compliance-checker')
      .service('content-compliance-checker')
      .getProductBlocks(id);

    if (!productBlocks) {
      ctx.notFound('Product not found');
      return;
    }

    ctx.body = productBlocks;
    ctx.status = 200;
  },

  async getAdditionalInformation(ctx: Context) {
    const additionalInformation = await strapi
      .plugin('content-compliance-checker')
      .service('content-compliance-checker')
      .findAdditionalInformationWithNoneKennisartikelBlocks();

    ctx.body = additionalInformation;
    ctx.status = 200;
  },

  async getAdditionalInformationBlocks(ctx: Context) {
    const { id } = ctx.params;

    if (id === undefined || id === null || id === '') {
      ctx.badRequest('Additional Information ID is required');
      return;
    }

    const additionalInfo = await strapi
      .plugin('content-compliance-checker')
      .service('content-compliance-checker')
      .getAdditionalInformationBlocks(id);

    if (!additionalInfo) {
      ctx.notFound('Additional information not found');
      return;
    }

    ctx.body = additionalInfo;
    ctx.status = 200;
  },
});
