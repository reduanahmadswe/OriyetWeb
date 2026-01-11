'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import {
  $createColumnsLayout,
  LayoutContainerNode,
  LayoutItemNode,
} from '../nodes/LayoutNode';

export type InsertLayoutPayload = {
  columns: number;
};

export const INSERT_LAYOUT_COMMAND: LexicalCommand<InsertLayoutPayload> = createCommand(
  'INSERT_LAYOUT_COMMAND'
);

export default function LayoutPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([LayoutContainerNode, LayoutItemNode])) {
      throw new Error(
        'LayoutPlugin: LayoutContainerNode or LayoutItemNode not registered on editor'
      );
    }

    return editor.registerCommand(
      INSERT_LAYOUT_COMMAND,
      (payload) => {
        const layoutNode = $createColumnsLayout(payload.columns);
        $insertNodeToNearestRoot(layoutNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
