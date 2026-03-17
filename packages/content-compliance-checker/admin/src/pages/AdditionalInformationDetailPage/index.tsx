import { Box, Flex, Typography, Loader } from '@strapi/design-system';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { ActionHeader } from '../../components/ActionHeader';
import { ErrorPage } from '../../components/ErrorPage';
import { Sections } from '../../components/Sections';
import getTrad from '../../utils/getTrad';
import { useAdditionalInformationWithUncategorizedBlocks_ById } from '../../hooks/useContentComplianceQueries';

const AdditionalInformationDetailPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const { formatMessage } = useIntl();

  // Use TanStack Query hook
  const {
    data: additionalInformation,
    isLoading,
    isError,
    error,
  } = useAdditionalInformationWithUncategorizedBlocks_ById(id);

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

  if (!additionalInformation) {
    return (
      <ErrorPage
        buttonText={formatMessage({
          id: getTrad('backToBDashboardButton.text'),
          defaultMessage: 'Terug naar Dashboard',
        })}
      >
        {formatMessage({
          id: getTrad('additionalInformationDetailPage.notFound'),
          defaultMessage: 'Aanvullende informatie niet gevonden',
        })}
      </ErrorPage>
    );
  }

  return (
    <main ref={contentRef}>
      <Box padding={8}>
        <ActionHeader
          title={additionalInformation?.title}
          contentRef={contentRef}
          printLabel={formatMessage({
            id: getTrad('printButton.label'),
            defaultMessage: 'Afdrukken',
          })}
          backLabel={formatMessage({
            id: getTrad('backToBDashboardButton.text'),
            defaultMessage: 'Terug naar Dashboard',
          })}
          editLabel={formatMessage({
            id: getTrad('updateButton.text'),
            defaultMessage: 'Bewerken',
          })}
          redirectTo={`/content-manager/collection-types/api::additional-information.additional-information/${additionalInformation?.documentId || additionalInformation?.id}`}
        />

        <Flex direction="column" gap={4} marginTop={4} width="100%" alignItems="start">
          <Typography variant="beta">
            {formatMessage(
              {
                id: getTrad('blocksWithoutCategory'),
                defaultMessage: 'Blokken zonder "kennisartikelCategorie" ({count})',
              },
              {
                count: additionalInformation?.content?.contentBlock?.length ?? 0,
              },
            )}
          </Typography>

          <Flex
            width="100%"
            direction="column"
            gap={{
              initial: 4,
            }}
          >
            <Sections
              sections={additionalInformation?.content?.contentBlock?.map((block: any) => ({
                ...block,
                __component: 'components.utrecht-rich-text',
              }))}
              locale="nl"
            />
          </Flex>
        </Flex>
      </Box>
    </main>
  );
};

export default AdditionalInformationDetailPage;
