import { graphQLClient } from './graphqlClient';
import { GET_PRODUCT_BY_SLUG } from './queries/product';

type ContentBlock = {
  contentBlock: string;
  kennisartikelCategorie: string;
};

export interface ProductData {
  slug: string;
  title: string;
  documentId: string;
  content: ContentBlock[];
}

export async function fetchProductBySlug(slug: string, status?: 'DRAFT' | 'PUBLISHED'): Promise<ProductData | null> {
  if (!slug) return null;

  const data = await graphQLClient.request(GET_PRODUCT_BY_SLUG, {
    slug,
    status,
  });

  return data?.products[0] ?? null;
}
