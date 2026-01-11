'use client';

import React from 'react';
import {
  DecoratorNode,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

export type SerializedFigmaNode = Spread<
  {
    documentId: string;
  },
  SerializedLexicalNode
>;

export class FigmaNode extends DecoratorNode<React.ReactElement> {
  __documentId: string;

  static getType(): string {
    return 'figma';
  }

  static clone(node: FigmaNode): FigmaNode {
    return new FigmaNode(node.__documentId, node.__key);
  }

  static importJSON(serializedNode: SerializedFigmaNode): FigmaNode {
    return $createFigmaNode(serializedNode.documentId);
  }

  constructor(documentId: string, key?: NodeKey) {
    super(key);
    this.__documentId = documentId;
  }

  exportJSON(): SerializedFigmaNode {
    return {
      type: 'figma',
      version: 1,
      documentId: this.__documentId,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.classList.add('figma-embed');
    element.setAttribute('data-figma-id', this.__documentId);
    return { element };
  }

  createDOM(): HTMLElement {
    const el = document.createElement('div');
    el.classList.add('figma-wrapper');
    return el;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactElement {
    return <FigmaComponent documentId={this.__documentId} />;
  }
}

function FigmaComponent({ documentId }: { documentId: string }) {
  const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(documentId)}`;

  return (
    <div className="figma-container" contentEditable={false}>
      <iframe
        src={embedUrl}
        className="figma-iframe"
        allowFullScreen
        title="Figma Document"
      />
    </div>
  );
}

export function $createFigmaNode(documentId: string): FigmaNode {
  return new FigmaNode(documentId);
}

export function $isFigmaNode(
  node: LexicalNode | null | undefined
): node is FigmaNode {
  return node instanceof FigmaNode;
}

// Helper to extract Figma URL
export function isValidFigmaUrl(url: string): boolean {
  return /(?:www\.)?figma\.com\/(file|proto)\//.test(url);
}
