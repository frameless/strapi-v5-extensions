import type { Selection } from '@tiptap/pm/state';
import type { Node } from '@tiptap/pm/model';

interface FindClosestTableParameters {
  selection: Selection;
}

interface FindClosestComponentParameter {
  selection: Selection;
  nodeType?: string;
}

interface TableNodeResult {
  node: Node;
  pos: number;
}

export const findClosestComponent = ({
  selection,
  nodeType,
}: FindClosestComponentParameter): TableNodeResult | null => {
  const { $from, $to } = selection;

  let tableNode: TableNodeResult | null = null;
  const range = $from.blockRange($to);
  if (range) {
    range.$to.doc.nodesBetween(range.$from.pos, range.$to.pos, (node, pos) => {
      if (node.type.name === nodeType) {
        tableNode = { node, pos };
      }
      return false;
    });
  }
  return tableNode;
};

export const findClosestTable = ({ selection }: FindClosestTableParameters) => {
  // Check for tableFigure first, then fall back to table
  return (
    findClosestComponent({ selection, nodeType: 'tableFigure' }) ||
    findClosestComponent({ selection, nodeType: 'table' })
  );
};
