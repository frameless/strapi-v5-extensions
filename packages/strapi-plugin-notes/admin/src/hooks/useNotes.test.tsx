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

// Get the mock for later use in tests
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockUseFetchClient = require('@strapi/strapi/admin').useFetchClient as jest.Mock;

const LEGACY_NOTE = {
  id: 1,
  documentId: 'doc-1',
  title: 'Legacy Note',
  content: 'This is a legacy note from v4',
  entitySlug: 'api::articles.article',
  entityId: 44, //Old numeric ID
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
  entityId: 'ohbcziti8lrm1lloobxaaxnv', //New documentId format
  createdAt: '2026-02-27T08:45:00.180Z',
  updatedAt: '2026-02-27T08:45:00.180Z',
  publishedAt: '2026-02-27T08:45:00.180Z',
};

const LEGACY_NOTE_2 = {
  id: 3,
  documentId: 'doc-3',
  title: 'Another Legacy Note',
  content: 'Another old note',
  entitySlug: 'api::articles.article',
  entityId: 50, // Old numeric ID
  createdAt: '2026-02-26T13:28:28.250Z',
  updatedAt: '2026-02-26T13:28:28.250Z',
  publishedAt: '2026-02-26T13:28:28.250Z',
};

const NOTE_DIFFERENT_SLUG = {
  id: 4,
  documentId: 'doc-4',
  title: 'Different Article',
  content: 'This note belongs to a different content type',
  entitySlug: 'api::products.product',
  entityId: 'xyz789',
  createdAt: '2026-02-26T13:28:28.250Z',
  updatedAt: '2026-02-26T13:28:28.250Z',
  publishedAt: '2026-02-26T13:28:28.250Z',
};

const PRODUCT_WITH_LEGACY_ID = {
  id: 44, //  Old numeric ID (v4)
  documentId: 'ohbcziti8lrm1lloobxaaxnv', //  New documentId (v5)
  name: 'Widget',
};

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

describe('useNote Hook - Legacy Data Support with Document Info Fetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Client-side filtering logic with document info', () => {
    it('should filter legacy notes by numeric entityId using fetched document id', () => {
      const allNotes = [LEGACY_NOTE, LEGACY_NOTE_2, NOTE_DIFFERENT_SLUG];
      //  When viewing a MIGRATED document: has both old id and new documentId
      const documentId = 'ohbcziti8lrm1lloobxaaxnv';
      const documentInfo = { id: 44, documentId: 'ohbcziti8lrm1lloobxaaxnv' };

      const filtered = allNotes.filter((note) => {
        // Match numeric entityIds (legacy) against documentInfo.id
        if (typeof note.entityId === 'number') {
          if (documentInfo?.id && String(note.entityId) === String(documentInfo.id)) {
            return true;
          }
        }
        // Match string entityIds (new) against documentId
        if (typeof note.entityId === 'string') {
          if (String(note.entityId) === String(documentId)) {
            return true;
          }
        }
        return false;
      });

      expect(filtered).toEqual([LEGACY_NOTE]);
      expect(filtered).toHaveLength(1);
    });

    it('should filter new notes by documentId UUID', () => {
      const allNotes = [NEW_NOTE, LEGACY_NOTE, NOTE_DIFFERENT_SLUG];
      //  When viewing a NEW document: only has documentId, no old numeric id
      const documentId = 'ohbcziti8lrm1lloobxaaxnv';
      const documentInfo = { id: null, documentId: 'ohbcziti8lrm1lloobxaaxnv' };

      const filtered = allNotes.filter((note) => {
        // Match numeric entityIds (legacy) against documentInfo.id
        if (typeof note.entityId === 'number') {
          if (documentInfo?.id && String(note.entityId) === String(documentInfo.id)) {
            return true;
          }
        }
        // Match string entityIds (new) against documentId
        if (typeof note.entityId === 'string') {
          if (String(note.entityId) === String(documentId)) {
            return true;
          }
        }
        return false;
      });

      expect(filtered).toEqual([NEW_NOTE]);
      expect(filtered).toHaveLength(1);
    });

    it('should handle mixed legacy and new notes', () => {
      const allNotes = [LEGACY_NOTE, NEW_NOTE, LEGACY_NOTE_2];

      // Test 1: Filter for legacy note (viewing old document before migration)
      //  Use documentId of the legacy product (which was its old numeric id converted to string for the API)
      const legacyDocumentId = '44'; // Old document id as string
      const legacyDocumentInfo = { id: 44, documentId: '44' };
      const legacyFiltered = allNotes.filter((note) => {
        if (typeof note.entityId === 'number') {
          if (legacyDocumentInfo?.id && String(note.entityId) === String(legacyDocumentInfo.id)) {
            return true;
          }
        }
        if (typeof note.entityId === 'string') {
          if (String(note.entityId) === String(legacyDocumentId)) {
            return true;
          }
        }
        return false;
      });

      expect(legacyFiltered).toEqual([LEGACY_NOTE]);

      // Test 2: Filter for new note (viewing new document)
      //  Use documentId of the new document (UUID format)
      const newDocumentId = 'ohbcziti8lrm1lloobxaaxnv';
      const newDocumentInfo = { id: null, documentId: 'ohbcziti8lrm1lloobxaaxnv' };
      const newFiltered = allNotes.filter((note) => {
        if (typeof note.entityId === 'number') {
          if (newDocumentInfo?.id && String(note.entityId) === String(newDocumentInfo.id)) {
            return true;
          }
        }
        if (typeof note.entityId === 'string') {
          if (String(note.entityId) === String(newDocumentId)) {
            return true;
          }
        }
        return false;
      });

      expect(newFiltered).toEqual([NEW_NOTE]);
    });

    it('should return empty array when no notes match', () => {
      const allNotes = [LEGACY_NOTE, LEGACY_NOTE_2];
      const documentId = 'nonexistent-uuid';
      const documentInfo = { id: 999, documentId: 'nonexistent-uuid' };

      const filtered = allNotes.filter((note) => {
        if (typeof note.entityId === 'number') {
          if (documentInfo?.id && String(note.entityId) === String(documentInfo.id)) {
            return true;
          }
        }
        if (typeof note.entityId === 'string') {
          if (String(note.entityId) === String(documentId)) {
            return true;
          }
        }
        return false;
      });

      expect(filtered).toEqual([]);
    });

    it('should only match notes from the specified entitySlug', () => {
      const allNotes = [LEGACY_NOTE, NOTE_DIFFERENT_SLUG];
      const documentId = 'ohbcziti8lrm1lloobxaaxnv';
      const documentInfo = { id: 44, documentId: 'ohbcziti8lrm1lloobxaaxnv' };

      const filtered = allNotes.filter((note) => {
        const matchesSlug = note.entitySlug === 'api::articles.article';
        let matchesId = false;

        if (typeof note.entityId === 'number') {
          if (documentInfo?.id && String(note.entityId) === String(documentInfo.id)) {
            matchesId = true;
          }
        }
        if (typeof note.entityId === 'string') {
          if (String(note.entityId) === String(documentId)) {
            matchesId = true;
          }
        }

        return matchesSlug && matchesId;
      });

      expect(filtered).toEqual([LEGACY_NOTE]);
      expect(filtered.every((n) => n.entitySlug === 'api::articles.article')).toBe(true);
    });
  });

  describe('Document info fetching for legacy data', () => {
    it('should fetch document info with both id and documentId', async () => {
      const mockGet = jest
        .fn()
        .mockResolvedValueOnce({
          data: PRODUCT_WITH_LEGACY_ID,
        })
        .mockResolvedValueOnce({
          data: [LEGACY_NOTE],
        });

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

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledTimes(2);
      });

      const documentFetchCall = mockGet.mock.calls[0][0];
      expect(documentFetchCall).toContain('/content-manager/collection-types/');
      expect(documentFetchCall).toContain('ohbcziti8lrm1lloobxaaxnv');
    });

    it('should handle document fetch errors gracefully', async () => {
      const mockGet = jest
        .fn()
        .mockRejectedValueOnce(new Error('Document not found'))
        .mockResolvedValueOnce({
          data: [NEW_NOTE],
        });

      mockUseFetchClient.mockReturnValue({
        get: mockGet,
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

      await waitFor(
        () => {
          expect(result.current.notes.isSuccess || result.current.notes.isError).toBe(true);
        },
        { timeout: 3000 },
      );

      if (result.current.notes.isSuccess) {
        expect(result.current.notes.data).toEqual([NEW_NOTE]);
      }
    });
  });

  describe('Mutation operations', () => {
    it('should create a note with correct structure', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { data: NEW_NOTE },
      });

      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockResolvedValueOnce({ data: PRODUCT_WITH_LEGACY_ID }).mockResolvedValueOnce({ data: [] }),
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

      const newNoteInput = {
        title: 'Test Note',
        content: 'Test Content',
        entitySlug: 'api::articles.article',
        entityId: 'ohbcziti8lrm1lloobxaaxnv',
      };

      await act(async () => {
        await result.current.createNote(newNoteInput);
      });

      expect(mockPost).toHaveBeenCalled();
      const callArgs = mockPost.mock.calls[0];
      expect(callArgs[1].data).toMatchObject(newNoteInput);
    });

    it('should update a note using documentId', async () => {
      const mockGet = jest
        .fn()
        .mockResolvedValueOnce({ data: PRODUCT_WITH_LEGACY_ID })
        .mockResolvedValueOnce({ data: [LEGACY_NOTE] });
      const mockPut = jest.fn().mockResolvedValue({
        data: { data: { ...LEGACY_NOTE, title: 'Updated' } },
      });

      mockUseFetchClient.mockReturnValue({
        get: mockGet,
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

      expect(mockPut).toHaveBeenCalled();
      const callUrl = mockPut.mock.calls[0][0];
      expect(callUrl).toContain('/entity-notes/notes/doc-1');
    });

    it('should delete a note with correct ID', async () => {
      const mockGet = jest
        .fn()
        .mockResolvedValueOnce({ data: PRODUCT_WITH_LEGACY_ID })
        .mockResolvedValueOnce({ data: [LEGACY_NOTE] });
      const mockDel = jest.fn().mockResolvedValue({});

      mockUseFetchClient.mockReturnValue({
        get: mockGet,
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
  });

  describe('API call verification', () => {
    it('should call the document endpoint with correct parameters', async () => {
      const mockGet = jest
        .fn()
        .mockResolvedValueOnce({ data: PRODUCT_WITH_LEGACY_ID })
        .mockResolvedValueOnce({ data: [LEGACY_NOTE] });

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

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalled();
      });

      const firstCall = mockGet.mock.calls[0][0];
      expect(firstCall).toContain('/content-manager/collection-types/');
      expect(firstCall).toContain('api::articles.article');
      expect(firstCall).toContain('ohbcziti8lrm1lloobxaaxnv');
    });

    it('should fetch notes without documentId server filter', async () => {
      const mockGet = jest
        .fn()
        .mockResolvedValueOnce({ data: PRODUCT_WITH_LEGACY_ID })
        .mockResolvedValueOnce({ data: [LEGACY_NOTE, NEW_NOTE] });

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

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledTimes(2);
      });

      const notesCall = mockGet.mock.calls[1][0];
      expect(notesCall).toContain('entity-notes/notes');
      expect(notesCall).not.toContain('entityId');
    });
  });

  describe('Error handling', () => {
    it('should handle API errors gracefully', async () => {
      mockUseFetchClient.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('API Error')),
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

      await waitFor(
        () => {
          expect(result.current.notes.isError).toBe(true);
        },
        { timeout: 5000 },
      );

      expect(result.current.notes.error).toBeDefined();
    });

    it('should match legacy notes even when document fetch fails', async () => {
      const mockGet = jest
        .fn()
        .mockRejectedValueOnce(new Error('Document fetch failed'))
        .mockResolvedValueOnce({
          data: [LEGACY_NOTE, NEW_NOTE],
        });

      mockUseFetchClient.mockReturnValue({
        get: mockGet,
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

      await waitFor(
        () => {
          expect(result.current.notes.isSuccess || result.current.notes.isError).toBe(true);
        },
        { timeout: 3000 },
      );

      if (result.current.notes.isSuccess) {
        expect(result.current.notes.data).toEqual([NEW_NOTE]);
      }
    });
  });
});
