import type { Core } from '@strapi/strapi';

type Section = {
  kennisartikelCategorie: string | null;
  [key: string]: any;
};

type Product = {
  sections?: Section[];
  [key: string]: any;
};

type ContentBlock = {
  kennisartikelCategorie: string | null;
  [key: string]: any;
};

type AdditionalInformation = {
  content?: {
    contentBlock?: ContentBlock[];
    [key: string]: any;
  };
  [key: string]: any;
};

const filterAdditionalInformationWithNoneKennisartikelBlocks = (
  additionalInformation: AdditionalInformation[],
): AdditionalInformation[] => {
  return additionalInformation.reduce<AdditionalInformation[]>((acc, info) => {
    const contentBlock = info.content?.contentBlock;
    const filteredBlocks = contentBlock?.filter((block) => block.kennisartikelCategorie === null);

    if (filteredBlocks && filteredBlocks.length > 0) {
      acc.push({
        ...info,
        content: {
          ...info.content,
          contentBlock: filteredBlocks,
        },
      });
    }

    return acc;
  }, []);
};

const filterProductsWithNoneKennisartikelBlocks = (products: Product[]): Product[] => {
  return products.reduce<Product[]>((filtered, product) => {
    const filteredSections = product.sections?.filter((section) => section.kennisartikelCategorie === null);

    if (filteredSections && filteredSections.length > 0) {
      filtered.push({
        ...product,
        sections: filteredSections,
      });
    }

    return filtered;
  }, []);
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async findProductsWithNoneKennisartikelBlocks() {
    const products = await strapi.documents('api::product.product').findMany({
      populate: {
        sections: {
          populate: '*',
        },
      },
      sort: { title: 'asc' },
    });

    const filteredProducts = filterProductsWithNoneKennisartikelBlocks(products as Product[]);
    return filteredProducts;
  },

  async getProductBlocks(id: string) {
    if (id === undefined || id === null || id === '') {
      strapi.log.warn('No ID provided');
      return null;
    }
    const product = await strapi.documents('api::product.product').findOne({
      documentId: id,
      populate: {
        sections: {
          on: {
            'components.utrecht-rich-text': { populate: '*' },
            'components.utrecht-logo-button': { populate: '*' },
            'components.utrecht-spotlight': { populate: { logoButton: { populate: '*' } } },
            'components.utrecht-multi-columns-button': { populate: { column: { populate: '*' } } },
            'components.utrecht-accordion': { populate: '*' },
            'components.utrecht-image': { populate: '*' },
            'components.utrecht-link': { populate: '*' },
            'components.faq': { populate: { pdc_faq: { populate: '*' } } },
            'components.flo-legal-form': { populate: '*' },
            'components.internal-block-content': { populate: '*' },
            'components.contact-information-public': { populate: '*' },
          },
        },
      },
    });

    if (!product) {
      strapi.log.warn(`Product not found for id: ${id}`);
      return null;
    }

    const filteredSections = filterProductsWithNoneKennisartikelBlocks([product as Product]);

    if (filteredSections.length === 0) {
      strapi.log.warn(`No uncategorized sections found`);
      return null;
    }

    const result = filteredSections[0];
    // Return single product object, not array
    return result || null;
  },
  async findAdditionalInformationWithNoneKennisartikelBlocks() {
    const additionalInformation = await strapi
      .documents('api::additional-information.additional-information')
      .findMany({
        populate: {
          content: {
            populate: {
              contentBlock: true,
            },
          },
        },
        sort: { title: 'asc' },
      });

    const filteredAdditionalInformation = filterAdditionalInformationWithNoneKennisartikelBlocks(
      additionalInformation as AdditionalInformation[],
    );

    return filteredAdditionalInformation;
  },

  async getAdditionalInformationBlocks(id: string) {
    const additionalInfo = await strapi.documents('api::additional-information.additional-information').findOne({
      documentId: id,
      populate: {
        content: {
          populate: {
            contentBlock: true,
          },
        },
      },
    });

    if (!additionalInfo) {
      return null;
    }

    const filteredAdditionalInfo = filterAdditionalInformationWithNoneKennisartikelBlocks([
      additionalInfo as AdditionalInformation,
    ]);

    return filteredAdditionalInfo[0] || null;
  },
});
