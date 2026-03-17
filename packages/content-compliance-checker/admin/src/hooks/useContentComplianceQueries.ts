import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFetchClient } from '@strapi/strapi/admin';

interface Sections {
  id?: number;
  kennisartikelCategorie: string | null;
  [key: string]: any;
}

interface Product {
  id: number;
  documentId: string;
  title: string;
  sections?: Sections[];
  [key: string]: any;
}

interface AdditionalInformation {
  id: number;
  documentId: string;
  title: string;
  content?: {
    contentBlock?: Sections;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Hook to fetch all products with uncategorized sections
 */
export const useProductsWithUncategorizedSections = () => {
  const { get } = getFetchClient();

  return useQuery({
    queryKey: ['products', 'uncategorized'],
    queryFn: async () => {
      try {
        const response = await get('/content-compliance-checker/products', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle different response formats
        const data = response?.data || response || [];
        const productsArray = Array.isArray(data) ? data : [];

        return productsArray as Product[];
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching products:', error);
        throw error;
      }
    },
  });
};

/**
 * Hook to fetch a single product by ID
 */
export const useProductWithUncategorizedSections = (id: string | undefined) => {
  const { get } = getFetchClient();

  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Product ID is required');
      }

      try {
        const response = await get(`/content-compliance-checker/products/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle different response formats
        const data = response?.data || response;
        if (!data) {
          throw new Error('Product not found');
        }
        return data as Product;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching product:', error);
        throw error;
      }
    },
    enabled: !!id, // Only run query if id is provided
  });
};

/**
 * Hook to fetch all additional information with uncategorized blocks
 */
export const useAdditionalInformationWithUncategorizedBlocks = () => {
  const { get } = getFetchClient();

  return useQuery({
    queryKey: ['additional-information', 'uncategorized'],
    queryFn: async () => {
      try {
        const response = await get('/content-compliance-checker/additional-information', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle different response formats
        const data = response?.data || response || [];
        const informationArray = Array.isArray(data) ? data : [];

        return informationArray as AdditionalInformation[];
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching additional information:', error);
        throw error;
      }
    },
  });
};

/**
 * Hook to fetch a single additional information by ID
 */
export const useAdditionalInformationWithUncategorizedBlocks_ById = (id: string | undefined) => {
  const { get } = getFetchClient();

  return useQuery({
    queryKey: ['additional-information', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Additional Information ID is required');
      }

      try {
        const response = await get(`/content-compliance-checker/additional-information/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle different response formats
        const data = response?.data || response;
        if (!data) {
          throw new Error('Additional information not found');
        }

        return data as AdditionalInformation;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching additional information:', error);
        throw error;
      }
    },
    enabled: !!id, // Only run query if id is provided
  });
};

/**
 * Hook to invalidate product queries (useful after mutations)
 */
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    invalidateUncategorized: () => queryClient.invalidateQueries({ queryKey: ['products', 'uncategorized'] }),
  };
};

/**
 * Hook to invalidate additional information queries (useful after mutations)
 */
export const useInvalidateAdditionalInformation = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['additional-information'] }),
    invalidateUncategorized: () =>
      queryClient.invalidateQueries({
        queryKey: ['additional-information', 'uncategorized'],
      }),
  };
};
