'use client';

import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';
import {
  $createCollapsibleContainerNode,
  $createCollapsibleContentNode,
  $createCollapsibleTitleNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
} from '../nodes/CollapsibleNode';
import { $wrapNodeInElement } from '@lexical/utils';

export const INSERT_COLLAPSIBLE_COMMAND: LexicalCommand<void> =
  createCommand('INSERT_COLLAPSIBLE_COMMAND');

export default function CollapsiblePlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (
      !editor.hasNodes([
        CollapsibleContainerNode,
        CollapsibleTitleNode,
        CollapsibleContentNode,
      ])
    ) {
      throw new Error(
        'CollapsiblePlugin: CollapsibleContainerNode, CollapsibleTitleNode, or CollapsibleContentNode not registered on editor'
      );
    }

    return editor.registerCommand(
      INSERT_COLLAPSIBLE_COMMAND,
      () => {
        const title = $createCollapsibleTitleNode();
        const paragraph = $createParagraphNode();
        const content = $createCollapsibleContentNode().append(paragraph);
        const container = $createCollapsibleContainerNode(true).append(
          title,
          content
        );
        $insertNodes([container]);
        title.selectEnd();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
