'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $isListItemNode, ListItemNode } from '@lexical/list';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_HIGH, INDENT_CONTENT_COMMAND } from 'lexical';

export default function ListMaxIndentLevelPlugin({
  maxDepth = 7,
}: {
  maxDepth?: number;
}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const alreadyHandled = new Set<string>();
        const nodes = selection.getNodes();
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const key = node.getKey();
          if (alreadyHandled.has(key)) {
            continue;
          }
          alreadyHandled.add(key);
          if ($isListItemNode(node)) {
            let depth = 1;
            let parent: ListItemNode | null = node;
            while (parent !== null) {
              parent = parent.getParent() as ListItemNode | null;
              if ($isListItemNode(parent)) {
                depth++;
              } else {
                break;
              }
            }
            if (depth >= maxDepth) {
              return true;
            }
          }
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, maxDepth]);

  return null;
}
