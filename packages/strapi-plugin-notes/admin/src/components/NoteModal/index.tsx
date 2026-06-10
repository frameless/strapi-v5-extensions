import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Dialog, Textarea, Button, Flex, Field, Typography } from '@strapi/design-system';
import { Check, Trash, Pencil } from '@strapi/icons';
import styled from 'styled-components';

import { getTranslation } from '../../utils';
import type { Notes, CreateNotesInput, UpdateNotesInput } from '../../hooks/useNotes';

interface NoteModalProps {
  note?: Notes;
  entitySlug: string;
  documentId?: string;
  isEditing: boolean;
  onClose: () => void;
  onCreateNote: (_input: CreateNotesInput) => Promise<Notes>;
  onUpdateNote: (_input: UpdateNotesInput) => Promise<Notes>;
  isPreviewing?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const StyledDialogContent = styled(Dialog.Content)`
  max-width: 900px;
`;
export const NoteModal = ({
  note,
  entitySlug,
  documentId,
  isEditing,
  onClose,
  onCreateNote,
  onUpdateNote,
  isPreviewing,
  onEdit,
  onDelete,
}: NoteModalProps) => {
  const { formatMessage } = useIntl();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      if (isEditing && note) {
        await onUpdateNote({
          documentId: note.documentId,
          title,
          content,
        });
      } else {
        await onCreateNote({
          title,
          content,
          entitySlug,
          entityId: documentId,
        });
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (isPreviewing) {
    return (
      <Dialog.Root open onOpenChange={onClose}>
        <StyledDialogContent>
          <Dialog.Header width="100%">{note?.title}</Dialog.Header>

          <Dialog.Body>
            <Flex direction="column" alignItems="stretch" gap={4} width="100%">
              <Typography>{note?.content}</Typography>
            </Flex>
          </Dialog.Body>

          <Dialog.Footer>
            {isConfirmingDelete ? (
              <>
                <Typography textColor="neutral600">
                  {formatMessage({
                    id: getTranslation('components.NoteList.delete.confirm.message'),
                    defaultMessage: 'Are you sure you want to delete this note? This action cannot be undone.',
                  })}
                </Typography>
                <Button variant="tertiary" onClick={() => setIsConfirmingDelete(false)}>
                  {formatMessage({
                    id: getTranslation('components.NoteList.delete.confirm.cancel'),
                    defaultMessage: 'Cancel',
                  })}
                </Button>
                <Button variant="danger" startIcon={<Trash />} onClick={onDelete}>
                  {formatMessage({
                    id: getTranslation('components.NoteList.delete.confirm.delete'),
                    defaultMessage: 'Delete',
                  })}
                </Button>
              </>
            ) : (
              <>
                <Button variant="tertiary" onClick={onClose}>
                  {formatMessage({ id: getTranslation('component.noteModal.actions.close'), defaultMessage: 'Close' })}
                </Button>
                <Button variant="secondary" startIcon={<Pencil />} onClick={onEdit}>
                  {formatMessage({ id: getTranslation('components.NoteList.edit'), defaultMessage: 'Edit note' })}
                </Button>
                <Button variant="danger-light" startIcon={<Trash />} onClick={() => setIsConfirmingDelete(true)}>
                  {formatMessage({ id: getTranslation('components.NoteList.delete'), defaultMessage: 'Delete note' })}
                </Button>
              </>
            )}
          </Dialog.Footer>
        </StyledDialogContent>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <StyledDialogContent>
        <Dialog.Header width="100%">
          {formatMessage({
            id: getTranslation(`component.noteModal.${isEditing ? 'edit' : 'create'}.title`),
            defaultMessage: isEditing ? 'Edit note' : 'Create note',
          })}
        </Dialog.Header>

        <Dialog.Body>
          <Flex direction="column" alignItems="stretch" gap={4} width="100%">
            <Field.Root>
              <Field.Label>
                {formatMessage({
                  id: getTranslation('component.noteModal.title.input.label'),
                  defaultMessage: 'Title',
                })}
              </Field.Label>
              <Field.Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={formatMessage({
                  id: getTranslation('component.noteModal.title.input.placeholder'),
                  defaultMessage: 'Enter note title',
                })}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>
                {formatMessage({
                  id: getTranslation('component.noteModal.content.input.label'),
                  defaultMessage: 'Content',
                })}
              </Field.Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={formatMessage({
                  id: getTranslation('component.noteModal.content.input.placeholder'),
                  defaultMessage: 'Enter note content',
                })}
                rows={12}
              />
            </Field.Root>
          </Flex>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Cancel>
            <Button variant="tertiary" onClick={onClose}>
              {formatMessage({ id: getTranslation('component.noteModal.actions.cancel'), defaultMessage: 'Cancel' })}
            </Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button
              onClick={handleSave}
              startIcon={<Check />}
              disabled={isLoading || !title.trim()}
              loading={isLoading}
            >
              {formatMessage({ id: getTranslation('component.noteModal.actions.save'), defaultMessage: 'Save' })}
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </StyledDialogContent>
    </Dialog.Root>
  );
};
