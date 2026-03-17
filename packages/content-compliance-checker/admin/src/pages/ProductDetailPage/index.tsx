import { Box, Flex, Typography, Loader } from '@strapi/design-system';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { ActionHeader } from '../../components/ActionHeader';
import { ErrorPage } from '../../components/ErrorPage';
import { Sections } from '../../components/Sections';
import getTrad from '../../utils/getTrad';
import { useProductWithUncategorizedSections } from '../../hooks/useContentComplianceQueries';

const ProductDetailPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const { formatMessage } = useIntl();

  const { data: product, isLoading, isError, error } = useProductWithUncategorizedSections(id);

  if (isLoading) {
    return (
      <Flex padding={8} display="flex" justifyContent="center" alignItems="center">
        <Loader />
      </Flex>
    );
  }

  if (isError) {
    return (
      <ErrorPage
        buttonText={formatMessage({
          id: getTrad('backToBDashboardButton.text'),
          defaultMessage: 'Terug naar Dashboard',
        })}
      >
        {formatMessage(
          {
            id: getTrad('errorPage.message'),
            defaultMessage: 'Fout: {error}',
          },
          {
            error: error instanceof Error ? error.message : String(error),
          },
        )}
      </ErrorPage>
    );
  }

  if (!product) {
    return (
      <ErrorPage
        buttonText={formatMessage({
          id: getTrad('backToBDashboardButton.text'),
          defaultMessage: 'Terug naar Dashboard',
        })}
      >
        {formatMessage({
          id: getTrad('product.notFound'),
          defaultMessage: 'Product niet gevonden',
        })}
      </ErrorPage>
    );
  }

  return (
    <main ref={contentRef}>
      <Box padding={8}>
        <ActionHeader
          title={product?.title}
          contentRef={contentRef}
          printLabel={formatMessage({ id: getTrad('printButton.label'), defaultMessage: 'Afdrukken' })}
          backLabel={formatMessage({
            id: getTrad('backToBDashboardButton.text'),
            defaultMessage: 'Terug naar Dashboard',
          })}
          editLabel={formatMessage({ id: getTrad('updateButton.text'), defaultMessage: 'Bewerken' })}
          redirectTo={`/content-manager/collection-types/api::product.product/${product?.documentId || product?.id}`}
        />
        <Box marginTop={4}>
          <Typography variant="beta" paddingBottom={2}>
            {formatMessage(
              {
                id: getTrad('blocksWithoutCategory'),
                defaultMessage: 'Blokken zonder "kennisartikelCategorie" ({count})',
              },
              { count: product?.sections?.length ?? 0 },
            )}
          </Typography>

          <Flex direction="column" gap={4}>
            <Sections sections={product?.sections} locale={product?.locale} />
          </Flex>
        </Box>
      </Box>
    </main>
  );
};

export default ProductDetailPage;
