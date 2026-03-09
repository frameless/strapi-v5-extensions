import { Paragraph } from '@tiptap/extension-paragraph';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCaption: {
      removeTableCaption: () => ReturnType;
    };
  }
}

export const TableCaption = Paragraph.extend({
  name: 'tableCaption',
  group: 'block',
  content: 'inline*', // Allows any inline content (text, bold, italic, etc.)

  parseHTML() {
    return [{ tag: 'figcaption' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['figcaption', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      removeTableCaption:
        () =>
        ({ commands }) => {
          // This command is now handled by the tableFigure extension
          // to properly remove both figure and caption
          return commands.removeTableCaption();
        },
    };
  },
});
