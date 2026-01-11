'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import { $createFigmaNode, FigmaNode } from '../nodes/FigmaNode';

export type InsertFigmaPayload = {
  documentId: string;
};

export const INSERT_FIGMA_COMMAND: LexicalCommand<InsertFigmaPayload> = createCommand(
  'INSERT_FIGMA_COMMAND'
);

export default function FigmaPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([FigmaNode])) {
      throw new Error(
        'FigmaPlugin: FigmaNode not registered on editor'
      );
    }

    return editor.registerCommand(
      INSERT_FIGMA_COMMAND,
      (payload) => {
        const figmaNode = $createFigmaNode(payload.documentId);
        $insertNodeToNearestRoot(figmaNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
