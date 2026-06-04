import { useState } from 'react';
import { useIntl } from 'react-intl';
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';
import { Box, Divider, Typography, Button, Flex, Loader, EmptyStateLayout } from '@strapi/design-system';
import { Plus } from '@strapi/icons';

import { getTranslation } from '../../utils';
import { useNotes } from '../../hooks/useNotes';
import { NoteModal } from '../NoteModal';
import { NoteListItem } from '../NoteListItem';

const NoteListLayout = () => {
  const data = useContentManagerContext();

  const { id, isCreatingEntry } = data || {};

  if (isCreatingEntry || !id) {
    return null;
  }

  return <NoteListContent />;
};

const NoteListContent = () => {
  const { id, slug } = useContentManagerContext();
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | number | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const { notes, createNote, deleteNote, updateNote } = useNotes({
    entitySlug: slug,
    documentId: id,
  });

  const handleOpenModal = (noteId?: string | number) => {
    setEditingNote(noteId ?? null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setIsPreviewing(false);
  };

  const selectedNote = notes.data?.find((note) => note.documentId === editingNote);

  return (
    <Box paddingTop={8} width="100%">
      <Typography variant="delta" textColor="neutral600">
        {formatMessage({
          id: getTranslation('plugin.name'),
          defaultMessage: 'Notes',
        })}
      </Typography>

      <Box marginTop={2} marginBottom={4}>
        <Divider />
      </Box>

      {notes.isLoading ? (
        <Loader small>
          {formatMessage({
            id: getTranslation('component.loading.notes'),
            defaultMessage: 'Loading notes...',
          })}
        </Loader>
      ) : notes.data?.length ? (
        <Flex
          gap={{
            initial: 2,
          }}
          style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden' }}
          width="100%"
          direction="column"
          wrap="nowrap"
        >
          {notes.data.map((note) => (
            <NoteListItem
              key={note.documentId}
              note={note}
              onEdit={() => {
                handleOpenModal(note.documentId);
                setIsPreviewing(false);
              }}
              onDelete={() => deleteNote(note.documentId)}
              onPreview={() => {
                handleOpenModal(note.documentId);
                setIsPreviewing(true);
              }}
            />
          ))}
        </Flex>
      ) : (
        <EmptyStateLayout
          content={formatMessage({
            id: getTranslation('component.emptyStateLayout'),
            defaultMessage: 'No notes yet',
          })}
        />
      )}

      <Button
        fullWidth
        variant="default"
        startIcon={<Plus />}
        disabled={notes.isLoading}
        onClick={() => handleOpenModal()}
        marginTop={4}
      >
        {formatMessage({
          id: getTranslation('component.noteListContent.add.button'),
          defaultMessage: 'Add note',
        })}
      </Button>

      {isModalOpen && (
        <NoteModal
          isPreviewing={isPreviewing}
          note={selectedNote}
          entitySlug={slug}
          documentId={id}
          onClose={handleCloseModal}
          onCreateNote={createNote}
          onUpdateNote={updateNote}
          isEditing={!!editingNote}
        />
      )}
    </Box>
  );
};

export default NoteListLayout;
