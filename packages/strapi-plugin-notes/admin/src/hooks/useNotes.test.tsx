// ============================================================================
// MOCK SETUP - Must be FIRST before any imports
// ============================================================================

jest.mock('@strapi/strapi/admin', () => ({
  useNotification: jest.fn(() => ({
    toggleNotification: jest.fn(),
  })),
  useFetchClient: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    del: jest.fn(),
  })),
}));

jest.mock('../pluginId', () => ({
  PLUGIN_ID: 'entity-notes',
}));

jest.mock('react-intl', () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(({ defaultMessage }) => defaultMessage),
  })),
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';

import { useNotes } from './useNotes';

// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const mockUseFetchClient = require('@strapi/strapi/admin').useFetchClient as jest.Mock;
// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const mockUseNotification = require('@strapi/strapi/admin').useNotification as jest.Mock;

// ============================================================================
// TEST DATA
// ============================================================================

const LEGACY_NOTE = {
  id: 1,
  documentId: 'doc-1',
  title: 'Legacy Note',
  content: 'This is a legacy note from v4',
  entitySlug: 'api::articles.article',
  entityId: 44,
  createdAt: '2026-02-26T13:28:28.250Z',
  updatedAt: '2026-02-26T13:28:28.250Z',
  publishedAt: '2026-02-26T13:28:28.250Z',
};

const NEW_NOTE = {
  id: 2,
  documentId: 'doc-2',
  title: 'New Note',
  content: 'This is a new note from v5',
  entitySlug: 'api::articles.article',
  entityId: 'ohbcziti8lrm1lloobxaaxnv',
  createdAt: '2026-02-27T08:45:00.180Z',
  updatedAt: '2026-02-27T08:45:00.180Z',
  publishedAt: '2026-02-27T08:45:00.180Z',
};

// ============================================================================
// HELPERS
// ============================================================================

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useNotes hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------------------------------------------------------
  describe('Query — enabled guard', () => {
    it('should NOT fetch when documentId is missing', () => {
      const mockGet = jest.fn();
      mockUseFetchClient.mockReturnValue({
        get: mockGet,
        post: jest.fn(),
        put: jest.fn(),
        del: jest.fn(),
      });

      renderHook(() => useNotes({ entitySlug: 'api::articles.article', documentId: undefined }), {
        wrapper: createWrapper(),
      });

      // query is disabled — get should never be called
      expect(mockGet).not.toHaveBeenCalled();
    });

    it('should NOT fetch when entitySlug is missing', () => {
      const mockGet = jest.fn();
      mockUseFetchClient.mockReturnValue({
        get: mockGet,
        post: jest.fn(),
        put: jest.fn(),
        del: jest.fn(),
      });

      renderHook(() => useNotes({ entitySlug: '', documentId: 'ohbcziti8lrm1lloobxaaxnv' }), {
        wrapper: createWrapper(),
      });

      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  describe('Query — fetching notes', () => {
    it('should call the by-document endpoint with encoded entitySlug and documentId', async () => {
      const mockGet = jest.fn().mockResolvedValue({ data: { data: [LEGACY_NOTE] } });
      mockUseFetchClient.mockReturnValue({
        get: mockGet,
        post: jest.fn(),
        put: jest.fn(),
        del: jest.fn(),
      });

      renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));

      const url: string = mockGet.mock.calls[0][0];
      expect(url).toContain('/entity-notes/notes/by-document');
      expect(url).toContain('entitySlug=api%3A%3Aarticles.article');
      expect(url).toContain('documentId=ohbcziti8lrm1lloobxaaxnv');
    });

    it('should return a flat Notes[] array from the server response', async () => {
      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [LEGACY_NOTE, NEW_NOTE] } }),
        post: jest.fn(),
        put: jest.fn(),
        del: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.notes.isSuccess).toBe(true));

      // Verify select() unwraps the wrapper — result must be a plain array
      expect(result.current.notes.data).toEqual([LEGACY_NOTE, NEW_NOTE]);
      expect(Array.isArray(result.current.notes.data)).toBe(true);
    });

    it('should return an empty array when the server returns no notes', async () => {
      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [] } }),
        post: jest.fn(),
        put: jest.fn(),
        del: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.notes.isSuccess).toBe(true));
      expect(result.current.notes.data).toEqual([]);
    });
  });

  // --------------------------------------------------------------------------
  describe('Query — error handling', () => {
    it('should set isError when the notes endpoint throws', async () => {
      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Network error')),
        post: jest.fn(),
        put: jest.fn(),
        del: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.notes.isError).toBe(true), { timeout: 5000 });
      expect(result.current.notes.error).toBeInstanceOf(Error);
    });
  });

  // --------------------------------------------------------------------------
  describe('Mutations — createNote', () => {
    it('should POST to the notes endpoint with the correct payload', async () => {
      const mockPost = jest.fn().mockResolvedValue({ data: { data: NEW_NOTE } });
      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [] } }),
        post: mockPost,
        put: jest.fn(),
        del: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      const input = {
        title: 'Test Note',
        content: 'Test Content',
        entitySlug: 'api::articles.article',
        entityId: 'ohbcziti8lrm1lloobxaaxnv',
      };

      await act(async () => {
        await result.current.createNote(input);
      });

      expect(mockPost).toHaveBeenCalledWith('/entity-notes/notes', { data: input });
    });

    it('should return the created note', async () => {
      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [] } }),
        post: jest.fn().mockResolvedValue({ data: { data: NEW_NOTE } }),
        put: jest.fn(),
        del: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      let created: unknown;
      await act(async () => {
        created = await result.current.createNote({
          title: 'T',
          content: 'C',
          entitySlug: 'api::articles.article',
          entityId: 'ohbcziti8lrm1lloobxaaxnv',
        });
      });

      expect(created).toEqual(NEW_NOTE);
    });

    it('should invalidate the notes query after a successful create', async () => {
      const mockGet = jest
        .fn()
        // first fetch (initial load)
        .mockResolvedValueOnce({ data: { data: [] } })
        // second fetch (after invalidation)
        .mockResolvedValueOnce({ data: { data: [NEW_NOTE] } });

      mockUseFetchClient.mockReturnValue({
        get: mockGet,
        post: jest.fn().mockResolvedValue({ data: { data: NEW_NOTE } }),
        put: jest.fn(),
        del: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.notes.isSuccess).toBe(true));

      await act(async () => {
        await result.current.createNote({
          title: 'T',
          content: 'C',
          entitySlug: 'api::articles.article',
          entityId: 'ohbcziti8lrm1lloobxaaxnv',
        });
      });

      // After invalidation the query re-fetches — get should be called twice total
      await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
      expect(result.current.notes.data).toEqual([NEW_NOTE]);
    });

    it('should show a success notification after creating a note', async () => {
      const toggleNotification = jest.fn();
      mockUseNotification.mockReturnValue({ toggleNotification });

      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [] } }),
        post: jest.fn().mockResolvedValue({ data: { data: NEW_NOTE } }),
        put: jest.fn(),
        del: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.createNote({
          title: 'T',
          content: 'C',
          entitySlug: 'api::articles.article',
          entityId: 'ohbcziti8lrm1lloobxaaxnv',
        });
      });

      expect(toggleNotification).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
    });
  });

  // --------------------------------------------------------------------------
  describe('Mutations — updateNote', () => {
    it('should PUT to the correct documentId URL', async () => {
      const mockPut = jest.fn().mockResolvedValue({
        data: { data: { ...LEGACY_NOTE, title: 'Updated' } },
      });
      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [LEGACY_NOTE] } }),
        post: jest.fn(),
        put: mockPut,
        del: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.updateNote({
          documentId: 'doc-1',
          title: 'Updated Title',
          content: 'Updated Content',
        });
      });

      expect(mockPut).toHaveBeenCalledWith('/entity-notes/notes/doc-1', {
        data: { title: 'Updated Title', content: 'Updated Content' },
      });
    });

    it('should invalidate the notes query after a successful update', async () => {
      const updatedNote = { ...LEGACY_NOTE, title: 'Updated' };
      const mockGet = jest
        .fn()
        .mockResolvedValueOnce({ data: { data: [LEGACY_NOTE] } })
        .mockResolvedValueOnce({ data: { data: [updatedNote] } });

      mockUseFetchClient.mockReturnValue({
        get: mockGet,
        post: jest.fn(),
        put: jest.fn().mockResolvedValue({ data: { data: updatedNote } }),
        del: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.notes.isSuccess).toBe(true));

      await act(async () => {
        await result.current.updateNote({
          documentId: 'doc-1',
          title: 'Updated',
          content: 'Updated Content',
        });
      });

      await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
      expect(result.current.notes.data).toEqual([updatedNote]);
    });
  });

  // --------------------------------------------------------------------------
  describe('Mutations — deleteNote', () => {
    it('should DELETE using the correct note ID', async () => {
      const mockDel = jest.fn().mockResolvedValue({});
      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [LEGACY_NOTE] } }),
        post: jest.fn(),
        put: jest.fn(),
        del: mockDel,
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.deleteNote(1);
      });

      expect(mockDel).toHaveBeenCalledWith('/entity-notes/notes/1');
    });

    it('should also accept a string ID', async () => {
      const mockDel = jest.fn().mockResolvedValue({});
      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [LEGACY_NOTE] } }),
        post: jest.fn(),
        put: jest.fn(),
        del: mockDel,
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await result.current.deleteNote('doc-1');
      });

      expect(mockDel).toHaveBeenCalledWith('/entity-notes/notes/doc-1');
    });

    it('should invalidate the notes query after a successful delete', async () => {
      const mockGet = jest
        .fn()
        .mockResolvedValueOnce({ data: { data: [LEGACY_NOTE] } })
        .mockResolvedValueOnce({ data: { data: [] } });

      mockUseFetchClient.mockReturnValue({
        get: mockGet,
        post: jest.fn(),
        put: jest.fn(),
        del: jest.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.notes.isSuccess).toBe(true));

      await act(async () => {
        await result.current.deleteNote(1);
      });

      await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
      expect(result.current.notes.data).toEqual([]);
    });

    it('should show a warning notification when delete fails', async () => {
      const toggleNotification = jest.fn();
      mockUseNotification.mockReturnValue({ toggleNotification });

      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { data: [LEGACY_NOTE] } }),
        post: jest.fn(),
        put: jest.fn(),
        del: jest.fn().mockRejectedValue(new Error('Delete failed')),
      });

      const { result } = renderHook(
        () =>
          useNotes({
            entitySlug: 'api::articles.article',
            documentId: 'ohbcziti8lrm1lloobxaaxnv',
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        try {
          await result.current.deleteNote(1);
        } catch {
          // mutation throws on error — we only care about the notification
        }
      });

      expect(toggleNotification).toHaveBeenCalledWith(expect.objectContaining({ type: 'warning' }));
    });
  });
});
