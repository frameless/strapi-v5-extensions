import { renderHook, act } from '@testing-library/react';
import type { Editor } from '@tiptap/react';

import { MediaAsset } from '../components/ui/MediaLib';

import { useMediaLib } from './useMediaLib';

const mockAsset: MediaAsset = {
  id: 1,
  name: 'test-image.jpg',
  alternativeText: 'Test image alt text',
  caption: 'Test caption',
  width: 800,
  height: 600,
  hash: 'test_hash_123',
  ext: '.jpg',
  mime: 'image/jpeg',
  size: 150000,
  url: '/uploads/test-image.jpg',
  previewUrl: null,
  provider: 'local',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

type MockedEditor = {
  isActive: jest.Mock;
  chain: jest.Mock;
  commands: {
    setImage: jest.Mock;
  };
};

export const createMockEditor = () => {
  const chainObj = {
    focus: jest.fn().mockReturnThis(),
    setImage: jest.fn().mockReturnThis(),
    run: jest.fn(),
  };

  const editor: MockedEditor = {
    isActive: jest.fn().mockReturnValue(false),
    chain: jest.fn(() => chainObj),
    commands: {
      setImage: jest.fn(),
    },
  };

  return editor as unknown as Editor;
};

describe('useMediaLib', () => {
  let mockEditor: Partial<Editor>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEditor = createMockEditor() as any;
  });

  describe('State Management', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      expect(result.current.isOpen).toBe(false);
    });

    it('should open media library', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should close media library', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));

      act(() => {
        result.current.open();
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should toggle media library', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));

      act(() => result.current.toggle());
      expect(result.current.isOpen).toBe(true);

      act(() => result.current.toggle());
      expect(result.current.isOpen).toBe(false);
    });

    it('should set forceInsert', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));

      act(() => result.current.setForceInsert(true));

      (mockEditor.isActive as jest.Mock).mockReturnValue(true);

      act(() => {
        result.current.handleSelectAssets([mockAsset]);
      });

      expect((mockEditor.commands as any).setImage).toHaveBeenCalled();
      expect(mockEditor.chain).not.toHaveBeenCalled();
    });

    it('should initialize with custom forceInsert value', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor, forceInsert: true }));

      (mockEditor.isActive as jest.Mock).mockReturnValue(true);

      act(() => {
        result.current.handleSelectAssets([mockAsset]);
      });

      expect((mockEditor.commands as any).setImage).toHaveBeenCalled();
    });
  });

  describe('handleSelectAssets', () => {
    it('should insert image when no image is active', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      (mockEditor.isActive as jest.Mock).mockReturnValue(false);

      act(() => {
        result.current.handleSelectAssets([mockAsset]);
      });

      expect((mockEditor.commands as any).setImage).toHaveBeenCalledWith({
        src: '/uploads/test-image.jpg',
        alt: 'Test image alt text',
        'data-figcaption': 'Test caption',
        width: 800,
        height: 600,
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should update image when image is active and forceInsert is false', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      (mockEditor.isActive as jest.Mock).mockReturnValue(true);

      const mockChain = {
        focus: jest.fn().mockReturnThis(),
        setImage: jest.fn().mockReturnThis(),
        run: jest.fn(),
      };

      (mockEditor.chain as jest.Mock).mockReturnValue(mockChain);

      act(() => {
        result.current.handleSelectAssets([mockAsset]);
      });

      expect(mockEditor.chain).toHaveBeenCalled();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.setImage).toHaveBeenCalledWith({
        src: '/uploads/test-image.jpg',
        alt: 'Test image alt text',
        'data-figcaption': 'Test caption',
        width: 800,
        height: 600,
      });
      expect(mockChain.run).toHaveBeenCalled();
    });

    it('should close media library after selection', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));

      act(() => result.current.open());
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.handleSelectAssets([mockAsset]);
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should reset forceInsert after handling assets', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      (mockEditor.isActive as jest.Mock).mockReturnValue(true);

      act(() => {
        result.current.setForceInsert(true);
        result.current.handleSelectAssets([mockAsset]);
      });

      const mockChain = {
        focus: jest.fn().mockReturnThis(),
        setImage: jest.fn().mockReturnThis(),
        run: jest.fn(),
      };

      (mockEditor.chain as jest.Mock).mockReturnValue(mockChain);

      act(() => {
        result.current.handleSelectAssets([mockAsset]);
      });

      expect(mockEditor.chain).toHaveBeenCalled();
    });

    it('should handle multiple images', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      const secondAsset = { ...mockAsset, id: 2, url: '/uploads/image-2.jpg' };

      act(() => {
        result.current.handleSelectAssets([mockAsset, secondAsset]);
      });

      expect((mockEditor.commands as any)?.setImage).toHaveBeenCalledTimes(2);
    });

    it('should filter out non-image assets', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      const pdfAsset = { ...mockAsset, mime: 'application/pdf' };

      act(() => {
        result.current.handleSelectAssets([mockAsset, pdfAsset]);
      });

      expect((mockEditor.commands as any).setImage).toHaveBeenCalledTimes(1);
    });

    it('should close without inserting if no images selected', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      const pdfAsset = { ...mockAsset, mime: 'application/pdf' };

      act(() => {
        result.current.open();
        result.current.handleSelectAssets([pdfAsset]);
      });

      expect((mockEditor.commands as any).setImage).not.toHaveBeenCalled();
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Image Formatting', () => {
    it('should add lazy loading when URL contains "lazy"', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      const lazyAsset = { ...mockAsset, url: '/uploads/test-lazy-image.jpg' };

      act(() => {
        result.current.handleSelectAssets([lazyAsset]);
      });

      expect((mockEditor.commands as any).setImage).toHaveBeenCalledWith(expect.objectContaining({ loading: 'lazy' }));
    });

    it('should add lazy loading when caption is "lazy"', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      const lazyAsset = { ...mockAsset, caption: 'lazy' };

      act(() => {
        result.current.handleSelectAssets([lazyAsset]);
      });

      expect((mockEditor.commands as any).setImage).toHaveBeenCalledWith(expect.objectContaining({ loading: 'lazy' }));
    });

    it('should omit dimensions when not available', () => {
      const { result } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));
      const noDimensionsAsset = { ...mockAsset, width: 0, height: 0 };

      act(() => {
        result.current.handleSelectAssets([noDimensionsAsset]);
      });

      const call = ((mockEditor.commands as any).setImage as jest.Mock).mock.calls[0][0];
      expect(call).not.toHaveProperty('width');
      expect(call).not.toHaveProperty('height');
    });
  });

  describe('Callback Stability', () => {
    it('should maintain stable callback references', () => {
      const { result, rerender } = renderHook(() => useMediaLib({ editor: mockEditor as Editor }));

      const firstOpen = result.current.open;
      const firstClose = result.current.close;
      const firstToggle = result.current.toggle;

      rerender();

      expect(result.current.open).toBe(firstOpen);
      expect(result.current.close).toBe(firstClose);
      expect(result.current.toggle).toBe(firstToggle);
    });
  });
});
