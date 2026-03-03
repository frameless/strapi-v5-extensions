import { Core } from '@strapi/strapi';

import plugin from './bootstrap';

describe('strapi-plugin-old-slugs bootstrap', () => {
  let mockStrapi: any;
  let subscribeMock: jest.Mock;
  let findOneMock: jest.Mock;

  beforeEach(() => {
    subscribeMock = jest.fn();
    findOneMock = jest.fn();

    mockStrapi = {
      config: {
        get: jest.fn(),
      },
      db: {
        lifecycles: {
          subscribe: subscribeMock,
        },
        query: jest.fn(() => ({
          findOne: findOneMock,
        })),
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return early if contentTypes config is empty', () => {
    mockStrapi.config.get.mockReturnValue({});
    plugin({ strapi: mockStrapi as Core.Strapi });
    expect(subscribeMock).not.toHaveBeenCalled();
  });

  it('should subscribe to lifecycles if contentTypes exist', () => {
    mockStrapi.config.get.mockReturnValue({
      contentTypes: [{ uid: 'api::product.product' }],
    });

    plugin({ strapi: mockStrapi as Core.Strapi });
    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });

  describe('beforeUpdate lifecycle', () => {
    let beforeUpdate: (...args: any[]) => Promise<void>;

    beforeEach(() => {
      mockStrapi.config.get.mockReturnValue({
        contentTypes: [{ uid: 'api::product.product' }],
      });

      plugin({ strapi: mockStrapi as Core.Strapi });

      const lifecycleConfig = subscribeMock.mock.calls[0][0];
      beforeUpdate = lifecycleConfig.beforeUpdate;
    });

    it('should return early if no where.id in event', async () => {
      await beforeUpdate({
        model: { uid: 'api::product.product' },
        params: { data: { slug: 'new' } },
      });

      expect(findOneMock).not.toHaveBeenCalled();
    });

    it('should return early if no data.slug in event', async () => {
      await beforeUpdate({
        model: { uid: 'api::product.product' },
        params: { where: { id: 1 }, data: {} },
      });

      expect(findOneMock).not.toHaveBeenCalled();
    });

    it('should return early if entry is not found', async () => {
      findOneMock.mockResolvedValue(null);

      await beforeUpdate({
        model: { uid: 'api::product.product' },
        params: { where: { id: 1 }, data: { slug: 'new-slug' } },
      });

      expect(findOneMock).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should update oldSlugs when slug changes', async () => {
      findOneMock.mockResolvedValue({
        id: 1,
        slug: 'old-slug',
        oldSlugs: [],
      });

      const event: any = {
        model: { uid: 'api::product.product' },
        params: { where: { id: 1 }, data: { slug: 'new-slug' } },
      };

      await beforeUpdate(event);

      expect(event.params.data.oldSlugs).toEqual(['old-slug']);
    });

    it('should not duplicate oldSlugs if slug already exists', async () => {
      findOneMock.mockResolvedValue({
        id: 1,
        slug: 'old-slug',
        oldSlugs: ['old-slug'],
      });

      const event: any = {
        model: { uid: 'api::product.product' },
        params: { where: { id: 1 }, data: { slug: 'new-slug' } },
      };

      await beforeUpdate(event);

      expect(event.params.data.oldSlugs).toBeUndefined();
    });
  });
});
