'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import { $createPageBreakNode, PageBreakNode } from '../nodes/PageBreakNode';

export const INSERT_PAGE_BREAK_COMMAND: LexicalCommand<void> = createCommand(
  'INSERT_PAGE_BREAK_COMMAND'
);

export default function PageBreakPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PageBreakNode])) {
      throw new Error(
        'PageBreakPlugin: PageBreakNode not registered on editor'
      );
    }

    return editor.registerCommand(
      INSERT_PAGE_BREAK_COMMAND,
      () => {
        const pageBreakNode = $createPageBreakNode();
        $insertNodeToNearestRoot(pageBreakNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
