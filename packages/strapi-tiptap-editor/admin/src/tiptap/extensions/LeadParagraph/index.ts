import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    leadParagraph: {
      setLeadParagraph: () => ReturnType;
      toggleLeadParagraph: () => ReturnType;
    };
  }
}

export const LeadParagraph = Node.create({
  name: 'leadParagraph',
  group: 'block',
  content: 'inline*',
  defining: true,
  addAttributes() {
    return {
      'data-lead': {
        default: true,
        parseHTML: (element) => element.hasAttribute('data-lead') || true,
        renderHTML: (attributes) => {
          return {
            'data-lead': attributes['data-lead'] ?? true,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'p[data-lead]',
        priority: 51, // Higher than regular paragraph
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { 'data-lead': true }), 0];
  },

  addCommands() {
    return {
      setLeadParagraph:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },

      toggleLeadParagraph:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph');
        },
    };
  },
});
