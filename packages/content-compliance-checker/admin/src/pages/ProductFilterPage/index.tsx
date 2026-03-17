import { Box, Flex, Typography, Loader } from '@strapi/design-system';
import { useRef } from 'react';
import { useIntl } from 'react-intl';

import { EntityTable } from '../../components/EntityTable';
import { ErrorPage } from '../../components/ErrorPage';
import { PrintButton } from '../../components/PrintButton';
import getTrad from '../../utils/getTrad';
import { useProductsWithUncategorizedSections } from '../../hooks/useContentComplianceQueries';

const ProductFilterPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { formatMessage } = useIntl();

  const { data: products = [], isLoading, isError, error } = useProductsWithUncategorizedSections();

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

  return (
    <main ref={contentRef}>
      <Box padding={8}>
        <Flex justifyContent="space-between" alignItems="flex-start" wrap="wrap" gap={4}>
          <Box>
            <Typography variant="alpha" tag="h2">
              {formatMessage({
                id: getTrad('filterDashboardPage.title'),
                defaultMessage: 'Dashboard voor inhoud naleving',
              })}
            </Typography>
            <Typography variant="epsilon" tag="h3" marginTop={4}>
              {formatMessage({
                id: getTrad('productFilterPage.subtitle'),
                defaultMessage: "Producten met blokken die niet gecategoriseerd zijn als 'kennisartikel'",
              })}
            </Typography>
          </Box>
          <Box className="utrecht-no-print">
            <PrintButton contentRef={contentRef}>
              {formatMessage({ id: getTrad('printButton.label'), defaultMessage: 'Afdrukken' })}
            </PrintButton>
          </Box>
        </Flex>
      </Box>

      {products.length === 0 ? (
        <Box padding={8}>
          <Typography textColor="neutral600">
            {formatMessage({
              id: getTrad('noDataFound'),
              defaultMessage: 'Geen producten gevonden met ontbrekende kennisartikelcategorieën',
            })}
          </Typography>
        </Box>
      ) : (
        <EntityTable
          headers={[
            formatMessage({ id: getTrad('entityTable.headers.title'), defaultMessage: 'Titel' }),
            formatMessage({
              id: getTrad('entityTable.headers.missingBlocks'),
              defaultMessage: 'Aantal blokken zonder categorie',
            }),
          ]}
          data={products}
          dataKeys={['title', 'sections.length']}
          redirectBasePath="/plugins/content-compliance-checker/product-filter"
          redirectLabel={formatMessage({
            id: getTrad('entityTable.redirectLabel'),
            defaultMessage: 'Bekijk details',
          })}
          actionHeader={formatMessage({
            id: getTrad('entityTable.actionHeader'),
            defaultMessage: 'Details',
          })}
        />
      )}
    </main>
  );
};

export default ProductFilterPage;
