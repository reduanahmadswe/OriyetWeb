'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import { $createEquationNode, EquationNode } from '../nodes/EquationNode';

export type InsertEquationPayload = {
  equation: string;
  inline?: boolean;
};

export const INSERT_EQUATION_COMMAND: LexicalCommand<InsertEquationPayload> = createCommand(
  'INSERT_EQUATION_COMMAND'
);

export default function EquationPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationPlugin: EquationNode not registered on editor'
      );
    }

    return editor.registerCommand(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const equationNode = $createEquationNode(
          payload.equation,
          payload.inline || false
        );
        $insertNodeToNearestRoot(equationNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
