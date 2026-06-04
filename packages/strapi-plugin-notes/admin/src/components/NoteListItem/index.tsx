import { useState } from 'react';
import { Typography, IconButton, Tooltip, Grid, Dialog, Button, Flex } from '@strapi/design-system';
import { Trash, Pencil, Eye } from '@strapi/icons';
import { useIntl } from 'react-intl';

import { Notes } from '../../hooks/useNotes';
import { getTranslation } from '../../utils';

interface NoteListItemProps {
  note: Notes;
  onEdit: () => void;
  onDelete: () => void;
  onPreview?: () => void;
}

export const NoteListItem = ({ note, onEdit, onDelete, onPreview }: NoteListItemProps) => {
  const { formatMessage } = useIntl();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete();
    setIsConfirmOpen(false);
  };

  return (
    <>
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
        <Grid.Item gap={1} justifyContent="flex-end" alignItems="flex-start">
          <Tooltip>
            <IconButton
              size="L"
              variant="ghost"
              onClick={onPreview}
              label={formatMessage({
                id: getTranslation('components.NoteList.preview'),
                defaultMessage: 'Preview note',
              })}
            >
              <Eye />
            </IconButton>
          </Tooltip>
          <Tooltip>
            <IconButton
              size="L"
              variant="ghost"
              onClick={onEdit}
              label={formatMessage({ id: getTranslation('components.NoteList.edit'), defaultMessage: 'Edit note' })}
            >
              <Pencil />
            </IconButton>
          </Tooltip>
          <Tooltip>
            <IconButton
              size="L"
              variant="ghost"
              onClick={() => setIsConfirmOpen(true)}
              label={formatMessage({ id: getTranslation('components.NoteList.delete'), defaultMessage: 'Delete note' })}
            >
              <Trash />
            </IconButton>
          </Tooltip>
        </Grid.Item>
        <Grid.Item xs={12}>
          {note?.title && (
            <Typography
              fontWeight="semibold"
              textColor="neutral800"
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
        </Grid.Item>
        <Grid.Item xs={12}>
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
      </Grid.Root>

      <Dialog.Root open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <Dialog.Content>
          <Dialog.Header>
            {formatMessage({
              id: getTranslation('components.NoteList.delete.confirm.title'),
              defaultMessage: 'Delete note',
            })}
          </Dialog.Header>
          <Dialog.Body>
            <Flex justifyContent="center">
              <Typography textAlign="center">
                {formatMessage({
                  id: getTranslation('components.NoteList.delete.confirm.message'),
                  defaultMessage: 'Are you sure you want to delete this note? This action cannot be undone.',
                })}
              </Typography>
            </Flex>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button variant="tertiary" onClick={() => setIsConfirmOpen(false)}>
                {formatMessage({
                  id: getTranslation('components.NoteList.delete.confirm.cancel'),
                  defaultMessage: 'Cancel',
                })}
              </Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button variant="danger" onClick={handleConfirmDelete} startIcon={<Trash />}>
                {formatMessage({
                  id: getTranslation('components.NoteList.delete.confirm.delete'),
                  defaultMessage: 'Delete',
                })}
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
