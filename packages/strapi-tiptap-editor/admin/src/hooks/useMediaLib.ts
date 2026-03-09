import { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/react';

import type { FormattedImage, MediaAsset } from '../components/ui/MediaLib';

export interface UseMediaLibOptions {
  /** TipTap editor instance */
  editor: Editor;
  /** Optional: Force insert even if image is already active */
  forceInsert?: boolean;
}

export interface UseMediaLibReturn {
  /** Whether the media library is open */
  isOpen: boolean;
  /** Open the media library */
  open: () => void;
  /** Close the media library */
  close: () => void;
  /** Toggle the media library */
  toggle: () => void;
  /** Handle asset selection */
  handleSelectAssets: (assets: MediaAsset[]) => void;
  /** Set force insert mode */
  setForceInsert: (force: boolean) => void;
}

/**
 * Custom hook for managing media library state and image insertion
 *
 * @example
 * ```tsx
 * const mediaLib = useMediaLib({ editor });
 *
 * // In your toolbar
 * <button onClick={mediaLib.open}>Insert Image</button>
 *
 * // In your component
 * <MediaLib
 *   editor={editor}
 *   isOpen={mediaLib.isOpen}
 *   onClose={mediaLib.close}
 * />
 * ```
 */
export const useMediaLib = ({
  editor,
  forceInsert: initialForceInsert = false,
}: UseMediaLibOptions): UseMediaLibReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [forceInsert, setForceInsert] = useState(initialForceInsert);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  /**
   * Transform media asset to TipTap image attributes
   */
  const formatImageForEditor = useCallback((asset: MediaAsset): FormattedImage => {
    const image: FormattedImage = {
      src: asset.url,
      alt: asset.alternativeText ?? '',
      'data-figcaption': asset.caption,
    };

    if (asset.width) {
      image.width = asset.width;
    }
    if (asset.height) {
      image.height = asset.height;
    }

    if (asset.url?.includes('lazy') || asset.caption === 'lazy') {
      image.loading = 'lazy';
    }

    return image;
  }, []);

  /**
   * Handle asset selection from media library
   */
  const handleSelectAssets = useCallback(
    (assets: MediaAsset[]) => {
      const imageAssets = assets.filter((asset) => asset.mime.includes('image'));

      if (imageAssets.length === 0) {
        close();
        return;
      }

      const shouldUpdate = !forceInsert && editor.isActive('image');

      imageAssets.forEach((asset) => {
        const formattedImage = formatImageForEditor(asset);

        if (shouldUpdate) {
          editor.chain().focus().setImage(formattedImage).run();
        } else {
          editor.commands.setImage(formattedImage);
        }
      });

      // Reset forceInsert after use
      setForceInsert(false);
      close();
    },
    [editor, forceInsert, formatImageForEditor, close],
  );

  return {
    isOpen,
    open,
    close,
    toggle,
    handleSelectAssets,
    setForceInsert,
  };
};
