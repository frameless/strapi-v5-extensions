import { Core } from '@strapi/strapi';

// Mock @strapi/strapi before any import resolves it — prevents the Strapi
// runtime (undici, ReadableStream, etc.) from loading in the Jest environment.
jest.mock('@strapi/strapi', () => ({
  factories: {
    createCoreController: (_uid: string, factory: (_deps: { strapi: unknown }) => Record<string, unknown>) => factory,
  },
  Core: {},
}));

import noteController from '../note-controller';

// Strapi types
interface StrapiDocument {
  id: number | null;
  documentId: string;
  title?: string;
}

interface Note {
  id: number;
  documentId: string;
  title: string;
  content: string;
  entitySlug: string;
  entityId: string | number;
  createdAt: string;
}

interface MockDocumentQuery {
  findOne: jest.Mock<Promise<StrapiDocument | null>, [{ where: { documentId: string } }]>;
}

interface MockNotesQuery {
  findMany: jest.Mock<Promise<Note[]>, [object]>;
}

// Extract mock fns first so Jest types are preserved on the references,
// then cast the containing object to Core.Strapi for the controller call.
const dbQueryMock = jest.fn();
const mockStrapi = {
  db: { query: dbQueryMock },
  log: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
} as unknown as Core.Strapi;

// Mock context — typed as any to avoid fighting Koa's full Context shape.
// The controller only accesses ctx.query, ctx.badRequest and ctx.internalServerError.
const createMockContext = (query: Record<string, string> = {}): any => ({
  query,
  badRequest: jest.fn((message: string) => ({ error: message, status: 400 })),
  internalServerError: jest.fn((message: string, details: unknown) => ({
    error: message,
    details,
    status: 500,
  })),
});

const LEGACY_DOCUMENT: StrapiDocument = {
  id: 44, // Old numeric ID from v4
  documentId: 'ohbcziti8lrm1lloobxaaxnv', // New UUID from v5
  title: 'Test Article',
};

const LEGACY_NOTE: Note = {
  id: 1,
  documentId: 'note-doc-1',
  title: 'Legacy Note',
  content: 'This note was created in v4',
  entitySlug: 'api::articles.article',
  entityId: 44, // References old numeric ID
  createdAt: '2024-01-01T00:00:00.000Z',
};

const NEW_NOTE: Note = {
  id: 2,
  documentId: 'note-doc-2',
  title: 'New Note',
  content: 'This note was created in v5',
  entitySlug: 'api::articles.article',
  entityId: 'ohbcziti8lrm1lloobxaaxnv', // References new UUID
  createdAt: '2024-01-02T00:00:00.000Z',
};

const MIXED_NOTES: Note[] = [LEGACY_NOTE, NEW_NOTE];

describe('Note Controller - findByDocument', () => {
  let controller: (_ctx: any) => Promise<unknown>;
  let mockDocumentQuery: MockDocumentQuery;
  let mockNotesQuery: MockNotesQuery;

  beforeEach(() => {
    jest.clearAllMocks();

    // The mock makes createCoreController return the factory function directly.
    // Calling it with { strapi } gives us the methods object.
    const methods = (
      noteController as unknown as (_deps: { strapi: Core.Strapi }) => Record<string, (_ctx: any) => Promise<unknown>>
    )({ strapi: mockStrapi });
    controller = methods.findByDocument;

    // Setup query mocks
    mockDocumentQuery = {
      findOne: jest.fn(),
    };
    mockNotesQuery = {
      findMany: jest.fn(),
    };

    dbQueryMock.mockImplementationOnce(() => mockDocumentQuery).mockImplementationOnce(() => mockNotesQuery);
  });

  describe('Input Validation', () => {
    it('should return bad request when entitySlug is missing', async () => {
      const ctx = createMockContext({ documentId: 'test-doc-id' });

      const result = await controller(ctx);

      expect(ctx.badRequest).toHaveBeenCalledWith('entitySlug and documentId are required');
      expect(result).toEqual({ error: 'entitySlug and documentId are required', status: 400 });
    });

    it('should return bad request when documentId is missing', async () => {
      const ctx = createMockContext({ entitySlug: 'api::articles.article' });

      const result = await controller(ctx);

      expect(ctx.badRequest).toHaveBeenCalledWith('entitySlug and documentId are required');
      expect(result).toEqual({ error: 'entitySlug and documentId are required', status: 400 });
    });

    it('should return bad request when both parameters are missing', async () => {
      const ctx = createMockContext({});

      await controller(ctx);

      expect(ctx.badRequest).toHaveBeenCalledWith('entitySlug and documentId are required');
    });
  });

  describe('Legacy Data Support', () => {
    it('should find legacy notes using numeric entityId when document has legacy ID', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      // Mock document lookup returning legacy document
      mockDocumentQuery.findOne.mockResolvedValue(LEGACY_DOCUMENT);

      // Mock notes query returning legacy note
      mockNotesQuery.findMany.mockResolvedValue([LEGACY_NOTE]);

      const result = await controller(ctx);

      expect(dbQueryMock).toHaveBeenNthCalledWith(1, 'api::articles.article');
      expect(mockDocumentQuery.findOne).toHaveBeenCalledWith({
        where: { documentId: 'ohbcziti8lrm1lloobxaaxnv' },
      });

      // Verify notes query includes both new and legacy IDs
      expect(dbQueryMock).toHaveBeenNthCalledWith(2, 'plugin::entity-notes.note');
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['ohbcziti8lrm1lloobxaaxnv', 44, '44'] },
        },
        orderBy: { title: 'asc' },
      });

      expect(result).toEqual({ data: [LEGACY_NOTE] });
    });

    it('should find new notes using UUID entityId when document has no legacy ID', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      // Mock document lookup returning document without legacy ID
      mockDocumentQuery.findOne.mockResolvedValue({
        id: null,
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      // Mock notes query returning new note
      mockNotesQuery.findMany.mockResolvedValue([NEW_NOTE]);

      const result = await controller(ctx);

      // Verify notes query only includes documentId (no legacy ID)
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['ohbcziti8lrm1lloobxaaxnv'] },
        },
        orderBy: { title: 'asc' },
      });

      expect(result).toEqual({ data: [NEW_NOTE] });
    });

    it('should handle mixed legacy and new notes for migrated documents', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      // Mock document lookup returning migrated document (has both IDs)
      mockDocumentQuery.findOne.mockResolvedValue(LEGACY_DOCUMENT);

      // Mock notes query returning both legacy and new notes
      mockNotesQuery.findMany.mockResolvedValue(MIXED_NOTES);

      const result = await controller(ctx);

      // Verify notes query includes all possible ID formats
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['ohbcziti8lrm1lloobxaaxnv', 44, '44'] },
        },
        orderBy: { title: 'asc' },
      });

      expect(result).toEqual({ data: MIXED_NOTES });
    });
  });

  describe('Performance Optimization', () => {
    it('should use server-side filtering instead of client-side filtering', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      mockDocumentQuery.findOne.mockResolvedValue(LEGACY_DOCUMENT);
      mockNotesQuery.findMany.mockResolvedValue([LEGACY_NOTE]);

      await controller(ctx);

      // Verify that filtering is done at database level, not after fetching all notes
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['ohbcziti8lrm1lloobxaaxnv', 44, '44'] },
        },
        orderBy: { title: 'asc' },
      });

      // Verify we're not fetching all notes and then filtering
      expect(mockNotesQuery.findMany).not.toHaveBeenCalledWith({
        where: { entitySlug: { $eq: 'api::articles.article' } },
      });
    });

    it('should minimize database queries (only 2 queries total)', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      mockDocumentQuery.findOne.mockResolvedValue(LEGACY_DOCUMENT);
      mockNotesQuery.findMany.mockResolvedValue([LEGACY_NOTE]);

      await controller(ctx);

      // Verify only 2 database queries are made
      expect(dbQueryMock).toHaveBeenCalledTimes(2);
      expect(mockDocumentQuery.findOne).toHaveBeenCalledTimes(1);
      expect(mockNotesQuery.findMany).toHaveBeenCalledTimes(1);
    });

    it('should handle large datasets efficiently by filtering at database level', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      // Simulate scenario with many notes but only few relevant ones
      const relevantNotes: Note[] = [LEGACY_NOTE, NEW_NOTE];

      mockDocumentQuery.findOne.mockResolvedValue(LEGACY_DOCUMENT);
      mockNotesQuery.findMany.mockResolvedValue(relevantNotes);

      const result = await controller(ctx);

      // Verify database-level filtering prevents fetching irrelevant notes
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['ohbcziti8lrm1lloobxaaxnv', 44, '44'] },
        },
        orderBy: { title: 'asc' },
      });

      expect(result).toEqual({ data: relevantNotes });
    });
  });

  describe('Error Handling', () => {
    it('should continue gracefully when document lookup fails', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      // Mock document lookup failure
      mockDocumentQuery.findOne.mockRejectedValue(new Error('Document not found'));

      // Mock notes query still succeeds
      mockNotesQuery.findMany.mockResolvedValue([NEW_NOTE]);

      const result = await controller(ctx);

      // Verify notes query continues with just documentId (no legacy ID)
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['ohbcziti8lrm1lloobxaaxnv'] },
        },
        orderBy: { title: 'asc' },
      });

      expect(result).toEqual({ data: [NEW_NOTE] });
    });

    it('should return internal server error when notes query fails', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      mockDocumentQuery.findOne.mockResolvedValue(LEGACY_DOCUMENT);
      mockNotesQuery.findMany.mockRejectedValue(new Error('Database connection failed'));

      const result = await controller(ctx);

      expect(ctx.internalServerError).toHaveBeenCalledWith('Failed to fetch notes', {
        error: 'Database connection failed',
      });
      expect(result).toEqual({
        error: 'Failed to fetch notes',
        details: { error: 'Database connection failed' },
        status: 500,
      });
    });

    it('should handle unknown errors gracefully', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      mockDocumentQuery.findOne.mockResolvedValue(LEGACY_DOCUMENT);
      mockNotesQuery.findMany.mockRejectedValue('Unknown error');

      await controller(ctx);

      expect(ctx.internalServerError).toHaveBeenCalledWith('Failed to fetch notes', { error: 'Unknown error' });
    });

    it('should handle null/undefined document gracefully', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'nonexistent-doc-id',
      });

      mockDocumentQuery.findOne.mockResolvedValue(null);
      mockNotesQuery.findMany.mockResolvedValue([]);

      const result = await controller(ctx);

      // Verify notes query continues with just documentId
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['nonexistent-doc-id'] },
        },
        orderBy: { title: 'asc' },
      });

      expect(result).toEqual({ data: [] });
    });
  });

  describe('Data Consistency', () => {
    it('should return notes sorted by title in ascending order', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      const unsortedNotes: Note[] = [
        { ...NEW_NOTE, title: 'Z Note' },
        { ...LEGACY_NOTE, title: 'A Note' },
      ];

      mockDocumentQuery.findOne.mockResolvedValue(LEGACY_DOCUMENT);
      mockNotesQuery.findMany.mockResolvedValue(unsortedNotes);

      await controller(ctx);

      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['ohbcziti8lrm1lloobxaaxnv', 44, '44'] },
        },
        orderBy: { title: 'asc' },
      });
    });

    it('should handle entitySlug filtering correctly', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::products.product',
        documentId: 'product-doc-id',
      });

      mockDocumentQuery.findOne.mockResolvedValue({ id: 123, documentId: 'product-doc-id' });
      mockNotesQuery.findMany.mockResolvedValue([]);

      await controller(ctx);

      // Verify correct entitySlug is used in both queries
      expect(dbQueryMock).toHaveBeenNthCalledWith(1, 'api::products.product');
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::products.product' },
          entityId: { $in: ['product-doc-id', 123, '123'] },
        },
        orderBy: { title: 'asc' },
      });
    });

    it('should include all possible ID formats for maximum compatibility', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      mockDocumentQuery.findOne.mockResolvedValue({ id: 42, documentId: 'ohbcziti8lrm1lloobxaaxnv' });
      mockNotesQuery.findMany.mockResolvedValue([]);

      await controller(ctx);

      // Verify all ID formats are included: UUID, numeric, and string numeric
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['ohbcziti8lrm1lloobxaaxnv', 42, '42'] },
        },
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty notes result', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      mockDocumentQuery.findOne.mockResolvedValue(LEGACY_DOCUMENT);
      mockNotesQuery.findMany.mockResolvedValue([]);

      const result = await controller(ctx);

      expect(result).toEqual({ data: [] });
    });

    it('should handle document with zero as legacy ID', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::articles.article',
        documentId: 'ohbcziti8lrm1lloobxaaxnv',
      });

      mockDocumentQuery.findOne.mockResolvedValue({ id: 0, documentId: 'ohbcziti8lrm1lloobxaaxnv' });
      mockNotesQuery.findMany.mockResolvedValue([]);

      const result = await controller(ctx);

      // Verify zero ID is not included (falsy value check)
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::articles.article' },
          entityId: { $in: ['ohbcziti8lrm1lloobxaaxnv'] },
        },
        orderBy: { title: 'asc' },
      });

      expect(result).toEqual({ data: [] });
    });

    it('should handle special characters in entitySlug and documentId', async () => {
      const ctx = createMockContext({
        entitySlug: 'api::special-content.content-type',
        documentId: 'doc-with-special-chars-123',
      });

      mockDocumentQuery.findOne.mockResolvedValue({ id: 999, documentId: 'doc-with-special-chars-123' });
      mockNotesQuery.findMany.mockResolvedValue([]);

      const result = await controller(ctx);

      expect(dbQueryMock).toHaveBeenNthCalledWith(1, 'api::special-content.content-type');
      expect(mockNotesQuery.findMany).toHaveBeenCalledWith({
        where: {
          entitySlug: { $eq: 'api::special-content.content-type' },
          entityId: { $in: ['doc-with-special-chars-123', 999, '999'] },
        },
        orderBy: { title: 'asc' },
      });

      expect(result).toEqual({ data: [] });
    });
  });
});
