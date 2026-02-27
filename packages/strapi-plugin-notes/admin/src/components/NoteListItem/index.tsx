import { Typography, IconButton, Tooltip, Grid } from '@strapi/design-system';
import { Trash, Pencil } from '@strapi/icons';
import { useIntl } from 'react-intl';

import { Notes } from '../../hooks/useNotes';
import { getTranslation } from '../../utils';

interface NoteListItemProps {
  note: Notes;
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteListItem = ({ note, onEdit, onDelete }: NoteListItemProps) => {
  const { formatMessage } = useIntl();
  return (
    <Grid.Root
      gap={5}
      padding={3}
      background="neutral0"
      borderColor="neutral200"
      borderWidth="1px"
      borderStyle="solid"
      borderRadius="4px"
      width="100%"
    >
      <Grid.Item xs={12} alignItems="flex-start" direction="column">
        {note?.title && (
          <Typography
            fontWeight="semibold"
            textColor="neutral800"
            marginBottom={3}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {note.title}
          </Typography>
        )}
        {note?.content && (
          <Typography
            variant="pi"
            textColor="neutral600"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {note.content}
          </Typography>
        )}
      </Grid.Item>
      <Grid.Item gap={1}>
        <Tooltip>
          <IconButton
            onClick={onEdit}
            label={formatMessage({ id: getTranslation('components.NoteList.edit'), defaultMessage: 'Edit note' })}
          >
            <Pencil />
          </IconButton>
        </Tooltip>
        <Tooltip>
          <IconButton
            onClick={onDelete}
            label={formatMessage({ id: getTranslation('components.NoteList.delete'), defaultMessage: 'Delete note' })}
          >
            <Trash />
          </IconButton>
        </Tooltip>
      </Grid.Item>
    </Grid.Root>
  );
};
