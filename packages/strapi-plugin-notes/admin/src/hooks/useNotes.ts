import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useNotification, useFetchClient } from '@strapi/strapi/admin';
import { stringify } from 'qs';
import { useIntl } from 'react-intl';

import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils';

export interface Notes {
  id: number;
  documentId: string;
  title: string;
  content: string;
  entityId: string | number; // Can be numeric (v4) or UUID (v5)
  entitySlug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CreateNotesInput {
  title: string;
  content: string;
  entitySlug: string;
  entityId?: string;
}

export interface UpdateNotesInput {
  id?: number;
  documentId?: string;
  title: string;
  content: string;
}

export interface UseNotesQueryParams {
  entitySlug: string;
  documentId?: string;
}

type NotificationType = 'info' | 'warning' | 'danger' | 'success';

interface Notification {
  type?: NotificationType;
  message?: string;
}

interface ApiResponse<T> {
  data: T;
}

interface UseNotesReturn {
  notes: UseQueryResult<Notes[]>;
  createNote: (input: CreateNotesInput) => Promise<Notes>;
  updateNote: (input: UpdateNotesInput) => Promise<Notes>;
  deleteNote: (id: string | number) => Promise<void>;
}

const buildQueryKey = (...args: (string | number | undefined)[]): (string | number)[] =>
  args.filter((a): a is string | number => Boolean(a));

// ============================================================================
// Hook - WITH LEGACY DATA SUPPORT
// ============================================================================

export const useNotes = ({ entitySlug, documentId }: UseNotesQueryParams): UseNotesReturn => {
  const { toggleNotification } = useNotification();
  const { del, post, put, get } = useFetchClient();
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();

  const queryKey = buildQueryKey(PLUGIN_ID, 'notes', entitySlug, documentId);

  const showNotification = (notification: Notification) => {
    toggleNotification({
      type: notification.type,
      message: notification.message,
    });
  };

  const handleError = (error: any): void => {
    const errorMessage = error?.response?.data?.error?.message || error?.message || { id: 'notification.error' };

    showNotification({
      type: 'warning',
      message: errorMessage,
    });
  };

  const invalidateNotes = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  /**
   * FETCH DOCUMENT INFO - Get both old ID and new documentId
   *
   * This solves the legacy data problem:
   * - Old v4 notes store entityId: 44 (numeric ID)
   * - After migration, document has: id: 44 AND documentId: "ohbcziti8lrm1lloobxaaxnv"
   * - By fetching the document, we can match BOTH old and new notes
   */
  const { data: documentInfo } = useQuery({
    queryKey: [PLUGIN_ID, 'document-info', entitySlug, documentId],
    queryFn: async () => {
      try {
        if (!documentId) throw new Error('No documentId provided');
        // Fetch the document to get BOTH the old id and new documentId
        const { data } = await get<{ id: number; documentId: string }>(
          `/content-manager/collection-types/${entitySlug}/${documentId}`,
        );

        return {
          id: data.id, // Old numeric ID (e.g., 44)
          documentId: data.documentId, // New UUID (e.g., "ohbcziti8lrm1lloobxaaxnv")
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Could not fetch document info for legacy data support:', error);
        // Fallback: just use the documentId provided
        return { id: null, documentId };
      }
    },
    enabled: !!documentId && !!entitySlug,
  });

  /**
   * FETCH NOTES WITH LEGACY DATA SUPPORT
   *
   * Matches notes by checking BOTH:
   * 1. New format: note.entityId === documentId (UUID match)
   * 2. Legacy format: note.entityId === documentInfo.id (old numeric ID match)
   */
  const notes = useQuery<ApiResponse<Notes[]>, Error, Notes[]>({
    queryKey,
    queryFn: async () => {
      // Fetch all notes for this entitySlug
      const query = stringify(
        {
          filters: {
            entitySlug: {
              $eq: entitySlug,
            },
          },
          sort: ['title:asc'],
          pagination: { pageSize: 1000 },
        },
        { encodeValuesOnly: true },
      );

      const response = await get<ApiResponse<Notes[]>>(`/${PLUGIN_ID}/notes?${query}`);
      return response.data;
    },
    select: (response: ApiResponse<Notes[]>) => {
      return response.data.filter((note) => {
        // CASE 1: NEW FORMAT - entityId stores documentId (UUID)
        // Example: note.entityId = "ohbcziti8lrm1lloobxaaxnv" (new)
        //          documentId = "ohbcziti8lrm1lloobxaaxnv"
        if (note.entityId === documentId) {
          return true;
        }

        // CASE 2: LEGACY FORMAT - entityId stores old numeric ID
        // Example: note.entityId = 44 (old)
        //          documentInfo.id = 44 (from the fetched document)
        if (
          documentInfo?.id &&
          (note.entityId === documentInfo.id || String(note.entityId) === String(documentInfo.id))
        ) {
          return true;
        }

        return false;
      });
    },
    enabled: !!documentId && !!entitySlug,
  });

  // Create note
  const { mutateAsync: createNote } = useMutation<Notes, Error, CreateNotesInput>({
    mutationFn: async (input) => {
      const response = await post<ApiResponse<Notes>>(`/${PLUGIN_ID}/notes`, {
        data: {
          title: input.title,
          content: input.content,
          entitySlug: input.entitySlug,
          entityId: input.entityId, // For new notes, this should be documentId
        },
      });

      return response.data.data;
    },
    onSuccess: () => {
      invalidateNotes();
      showNotification({
        type: 'success',
        message: formatMessage({
          id: getTranslation('notification.noteCreated'),
          defaultMessage: 'Note created successfully',
        }),
      });
    },
    onError: handleError,
  });

  // Update note
  const { mutateAsync: updateNote } = useMutation<Notes, Error, UpdateNotesInput>({
    mutationFn: async (input) => {
      const response = await put<ApiResponse<Notes>>(`/${PLUGIN_ID}/notes/${input.documentId}`, {
        data: { title: input.title, content: input.content },
      });
      return response.data.data;
    },
    onSuccess: () => {
      invalidateNotes();
      showNotification({
        type: 'success',
        message: formatMessage({
          id: getTranslation('notification.noteUpdated'),
          defaultMessage: 'Note updated successfully',
        }),
      });
    },
    onError: handleError,
  });

  // Delete note
  const { mutateAsync: deleteNote } = useMutation<void, Error, string | number>({
    mutationFn: async (id) => {
      await del(`/${PLUGIN_ID}/notes/${id}`);
    },
    onSuccess: () => {
      invalidateNotes();
      showNotification({
        type: 'success',
        message: formatMessage({
          id: getTranslation('notification.noteDeleted'),
          defaultMessage: 'Note deleted successfully',
        }),
      });
    },
    onError: handleError,
  });

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
  };
};
