'use client';

import React from 'react';
import {
  DecoratorNode,
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from 'lexical';

export class PageBreakNode extends DecoratorNode<React.ReactElement> {
  static getType(): string {
    return 'page-break';
  }

  static clone(node: PageBreakNode): PageBreakNode {
    return new PageBreakNode(node.__key);
  }

  static importJSON(): PageBreakNode {
    return $createPageBreakNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figure: (domNode: HTMLElement) => {
        if (domNode.style.pageBreakAfter === 'always') {
          return {
            conversion: () => ({ node: $createPageBreakNode() }),
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: 'page-break',
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('figure');
    element.style.pageBreakAfter = 'always';
    element.classList.add('page-break');
    return { element };
  }

  createDOM(): HTMLElement {
    const el = document.createElement('figure');
    el.style.pageBreakAfter = 'always';
    el.classList.add('page-break');
    return el;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactElement {
    return (
      <div className="page-break-container" contentEditable={false}>
        <div className="page-break-line">
          <span className="page-break-label">PAGE BREAK</span>
        </div>
      </div>
    );
  }
}

export function $createPageBreakNode(): PageBreakNode {
  return new PageBreakNode();
}

export function $isPageBreakNode(
  node: LexicalNode | null | undefined
): node is PageBreakNode {
  return node instanceof PageBreakNode;
}
