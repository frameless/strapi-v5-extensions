import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Typography, Box, Flex } from '@strapi/design-system';
import styled from 'styled-components';

import { Notes } from '../../hooks/useNotes';

dayjs.extend(relativeTime);

interface NoteListItemProps {
  note: Notes;
  onPreview: () => void;
}

const ClampedTypography = styled(Typography)<{ $lines: number }>`
  display: -webkit-box;
  -webkit-line-clamp: ${({ $lines }) => $lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TitleTypography = styled(ClampedTypography)`
  flex: 1;
  min-width: 0;
`;

const NoteCard = styled(Box)`
  cursor: pointer;
  text-align: left;
`;

export const NoteListItem = ({ note, onPreview }: NoteListItemProps) => {
  return (
    <NoteCard
      padding={4}
      background="neutral0"
      borderColor="neutral200"
      borderWidth="1px"
      borderStyle="solid"
      borderRadius="4px"
      tag="button"
      width="100%"
      onClick={onPreview}
    >
      <Flex justifyContent="space-between" alignItems="flex-start" gap={2}>
        {note?.title && (
          <TitleTypography $lines={1} fontWeight="semibold" textColor="neutral800">
            {note.title}
          </TitleTypography>
        )}
      </Flex>

      {note?.content && (
        <Box marginTop={2}>
          <ClampedTypography $lines={2} variant="pi" textColor="neutral600">
            {note.content}
          </ClampedTypography>
        </Box>
      )}

      <Box marginTop={3}>
        <Typography variant="sigma" textColor="neutral400">
          {dayjs(note.updatedAt).fromNow()}
        </Typography>
      </Box>
    </NoteCard>
  );
};
