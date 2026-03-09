import type { Editor } from '@tiptap/core';
import type { Node } from 'prosemirror-model';

import { findClosestTable } from './findClosestTable';

type CursorPositionHandlerParameters = {
  editor: Editor;
  position: 'above' | 'below';
};
export const cursorPositionHandler = ({ editor, position }: CursorPositionHandlerParameters) => {
  try {
    const { state, dispatch } = editor.view;
    const { selection, schema } = state;
    const tableNode = findClosestTable({ selection });

    if (tableNode) {
      const posAbove = tableNode.pos;
      const posBelow = tableNode.pos + tableNode.node.content.size;
      const pos = position === 'above' ? posAbove : posBelow;

      const paragraphNode = schema.nodes.paragraph.createAndFill();
      if (!paragraphNode) {
        // eslint-disable-next-line no-console
        console.error('Failed to create paragraph node');
        return;
      }

      const transaction = state.tr.insert(pos, paragraphNode as Node);
      dispatch(transaction);
      editor.commands.setTextSelection(pos);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error handling cursor position:', err);
  }
};
