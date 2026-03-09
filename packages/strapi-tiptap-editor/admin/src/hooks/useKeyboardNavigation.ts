import { useEffect } from 'react';

import { TableAction } from '../components/ui/Toolbar/Table/tableActionGroups';

type ActionGroup = any;

interface UseKeyboardNavigationProps {
  open: boolean;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  currentView: 'main' | 'group';
  setOpen: (open: boolean) => void;
  getCurrentItems: () => any[];
  openGroup: (group: ActionGroup) => void;
  goBack: () => void;
  runCommand: (command: string) => void;
}

export function useKeyboardNavigation({
  open,
  focusedIndex,
  setFocusedIndex,
  currentView,
  setOpen,
  getCurrentItems,
  openGroup,
  goBack,
  runCommand,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = getCurrentItems();
      if (!items.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % items.length);
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0) {
            const item = items[focusedIndex];
            if (currentView === 'main') {
              openGroup(item as ActionGroup);
            } else {
              runCommand((item as TableAction).command);
            }
          }
          break;

        case 'Escape':
          if (currentView === 'group') {
            goBack();
          } else {
            setOpen(false);
          }
          break;

        case 'ArrowLeft':
          if (currentView === 'group') {
            e.preventDefault();
            goBack();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line consistent-return
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, focusedIndex, currentView, getCurrentItems, setFocusedIndex, setOpen, openGroup, goBack, runCommand]);
}
