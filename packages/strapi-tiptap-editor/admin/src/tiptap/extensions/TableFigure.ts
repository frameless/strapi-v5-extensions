import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { findParentNodeOfType } from 'prosemirror-utils';

import { TableFigureWidget } from '../../components/widgets/TableFigureWidget';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableFigure: {
      insertTableFigure: (options: { rows: number; cols: number; withHeaderRow?: boolean }) => ReturnType;
      updateTableWithCaption: () => ReturnType;
      removeTableCaption: () => ReturnType;
      deleteTableFigure: () => ReturnType;
    };
  }
}

export const TableFigure = Node.create({
  name: 'tableFigure',
  group: 'block',
  content: 'tableCaption? table',
  isolating: true,

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (node) => ((node as HTMLElement).querySelector('table') ? {} : false),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TableFigureWidget, {
      className: 'utrecht-node-viewer--table-figure utrecht-node-viewer',
    });
  },

  addCommands() {
    return {
      insertTableFigure:
        ({ rows, cols, withHeaderRow = true }) =>
        ({ commands }) => {
          const headerRow = {
            type: 'tableRow',
            content: Array.from({ length: cols }, () => ({
              type: withHeaderRow ? 'tableHeader' : 'tableCell',
              content: [{ type: 'paragraph' }],
            })),
          };

          const bodyRows = Array.from({ length: rows - 1 }, () => ({
            type: 'tableRow',
            content: Array.from({ length: cols }, () => ({
              type: 'tableCell',
              content: [{ type: 'paragraph' }],
            })),
          }));

          return commands.insertContent({
            type: 'tableFigure',
            content: [
              {
                type: 'tableCaption',
                content: [{ type: 'text', text: 'Enter table caption here...' }],
              },
              {
                type: 'table',
                content: [headerRow, ...bodyRows],
              },
            ],
          });
        },

      updateTableWithCaption:
        () =>
        ({ state, tr, dispatch }) => {
          const { selection } = state;
          const tableNode = findParentNodeOfType(state.schema.nodes.table)(selection);

          if (!tableNode) return false;

          const alreadyWrapped = findParentNodeOfType(state.schema.nodes.tableFigure)(selection);
          if (alreadyWrapped) return false;

          const tableFigureType = state.schema.nodes.tableFigure;
          const tableCaptionType = state.schema.nodes.tableCaption;
          if (!tableFigureType || !tableCaptionType) return false;

          const figureContent = [
            tableCaptionType.create(null, state.schema.text('Enter table caption here...')),
            tableNode.node,
          ];

          const newFigure = tableFigureType.create(null, figureContent);

          tr.replaceWith(tableNode.pos, tableNode.pos + tableNode.node.nodeSize, newFigure);

          if (dispatch) dispatch(tr);

          return true;
        },

      removeTableCaption:
        () =>
        ({ state, tr, dispatch }) => {
          const { selection } = state;

          // Find the tableFigure node
          const figure = findParentNodeOfType(state.schema.nodes.tableFigure)(selection);
          if (!figure) {
            console.warn('No tableFigure found');
            return false;
          }

          // Extract the table node from the figure
          let tableNode = null;

          figure.node.forEach((child) => {
            if (child.type.name === 'table') {
              tableNode = child;
            }
          });

          if (!tableNode) {
            console.warn('No table found inside tableFigure');
            return false;
          }

          // Replace the entire figure with just the table
          tr.replaceWith(figure.pos, figure.pos + figure.node.nodeSize, tableNode);

          if (dispatch) dispatch(tr);

          return true;
        },

      deleteTableFigure:
        () =>
        ({ state, tr, dispatch }) => {
          const { selection } = state;

          // Find the tableFigure node
          const figure = findParentNodeOfType(state.schema.nodes.tableFigure)(selection);

          if (!figure) {
            console.warn('No tableFigure found to delete');
            return false;
          }

          // Delete the entire figure (caption + table)
          tr.delete(figure.pos, figure.pos + figure.node.nodeSize);

          if (dispatch) dispatch(tr);

          return true;
        },
    };
  },
});
