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
  documentId: string;
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
  createNote: (_input: CreateNotesInput) => Promise<Notes>;
  updateNote: (_input: UpdateNotesInput) => Promise<Notes>;
  deleteNote: (_id: string | number) => Promise<void>;
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
   * FETCH NOTES WITH SERVER-SIDE LEGACY DATA SUPPORT
   *
   * The server endpoint handles:
   * 1. Document lookup to get legacy ID
   * 2. Filtering by both new documentId and legacy numeric ID
   * 3. Returns only relevant notes for this document
   */
  const notes = useQuery<ApiResponse<Notes[]>, Error, Notes[]>({
    queryKey,
    queryFn: async () => {
      // Use the new server endpoint for efficient filtering
      const query = stringify({ entitySlug, documentId }, { encodeValuesOnly: true });
      const response = await get<ApiResponse<Notes[]>>(`/${PLUGIN_ID}/notes/by-document?${query}`);
      return response.data;
    },
    select: (response: ApiResponse<Notes[]>) => response.data,
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
