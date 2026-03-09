import { useQuery } from '@tanstack/react-query';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';

import { useProductPriceContext } from '../context/ProductPriceContext';

export interface Price {
  id: string;
  uuid: string;
  currency: string;
  label: string;
  value: number;
}

export interface ProductPrice {
  title: string;
  uuid: string;
  price: Price[];
  documentId?: string;
}

interface Params {
  collectionUid?: string;
  documentId?: string;
}

/**
 * Maps collection → relation field to product
 */
const collectionToProductField: Record<string, string | null> = {
  'api::product.product': null,
  'api::internal-field.internal-field': 'product',
  'api::additional-information.additional-information': 'product',
};

export const useProductPrices = ({ collectionUid, documentId }: Params) => {
  const client = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const { setProductPrice, setBusy } = useProductPriceContext();
  const abortController = new AbortController();
  return useQuery({
    queryKey: ['product-prices', collectionUid, documentId],
    enabled: !!collectionUid && !!documentId,

    queryFn: async (): Promise<ProductPrice | null> => {
      setBusy(true);

      try {
        const relationField = collectionToProductField[collectionUid!];

        const res = await client.get(`/content-manager/collection-types/${collectionUid}/${documentId}`, {
          signal: abortController.signal,
          params: relationField
            ? {
                populate: {
                  [relationField]: {
                    populate: {
                      price: {
                        populate: '*',
                      },
                    },
                  },
                },
              }
            : {
                populate: {
                  price: {
                    populate: '*',
                  },
                },
              },
        });

        const entry = res.data?.data;
        let product = entry;

        if (relationField) {
          product = entry?.[relationField];
        }

        if (!product) {
          setProductPrice(null);
          setBusy(false);
          return null;
        }

        setProductPrice(product.price || null);
        return product.price || null;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Price fetch failed', err);

        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: 'notification.error',
            defaultMessage: 'Failed to load product prices',
          }),
        });
        setProductPrice(null);
        return null;
      } finally {
        setBusy(false);
      }
    },

    staleTime: 1000 * 60 * 10, // 10min cache
    gcTime: 1000 * 60 * 30,
  });
};
