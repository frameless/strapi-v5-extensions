import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Dialog, Textarea, Button, Flex, Field } from '@strapi/design-system';
import { Check } from '@strapi/icons';

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
}

export const NoteModal = ({
  note,
  entitySlug,
  documentId,
  isEditing,
  onClose,
  onCreateNote,
  onUpdateNote,
}: NoteModalProps) => {
  const { formatMessage } = useIntl();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Content>
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
      </Dialog.Content>
    </Dialog.Root>
  );
};
