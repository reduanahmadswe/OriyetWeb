'use client';

import React from 'react';
import {
  ElementNode,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
  $createParagraphNode,
  $isElementNode,
} from 'lexical';

export type SerializedLayoutContainerNode = Spread<
  {
    columns: number;
  },
  SerializedElementNode
>;

export class LayoutContainerNode extends ElementNode {
  __columns: number;

  static getType(): string {
    return 'layout-container';
  }

  static clone(node: LayoutContainerNode): LayoutContainerNode {
    return new LayoutContainerNode(node.__columns, node.__key);
  }

  static importJSON(serializedNode: SerializedLayoutContainerNode): LayoutContainerNode {
    const node = $createLayoutContainerNode(serializedNode.columns);
    return node;
  }

  constructor(columns: number = 2, key?: NodeKey) {
    super(key);
    this.__columns = columns;
  }

  exportJSON(): SerializedLayoutContainerNode {
    return {
      ...super.exportJSON(),
      type: 'layout-container',
      version: 1,
      columns: this.__columns,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.classList.add('layout-container');
    element.style.gridTemplateColumns = `repeat(${this.__columns}, 1fr)`;
    return { element };
  }

  createDOM(): HTMLElement {
    const el = document.createElement('div');
    el.classList.add('layout-container');
    el.style.display = 'grid';
    el.style.gridTemplateColumns = `repeat(${this.__columns}, 1fr)`;
    el.style.gap = '12px';
    return el;
  }

  updateDOM(prevNode: LayoutContainerNode, dom: HTMLElement): boolean {
    if (prevNode.__columns !== this.__columns) {
      dom.style.gridTemplateColumns = `repeat(${this.__columns}, 1fr)`;
      return true;
    }
    return false;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export type SerializedLayoutItemNode = Spread<{}, SerializedElementNode>;

export class LayoutItemNode extends ElementNode {
  static getType(): string {
    return 'layout-item';
  }

  static clone(node: LayoutItemNode): LayoutItemNode {
    return new LayoutItemNode(node.__key);
  }

  static importJSON(serializedNode: SerializedLayoutItemNode): LayoutItemNode {
    return $createLayoutItemNode();
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  exportJSON(): SerializedLayoutItemNode {
    return {
      ...super.exportJSON(),
      type: 'layout-item',
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.classList.add('layout-item');
    return { element };
  }

  createDOM(): HTMLElement {
    const el = document.createElement('div');
    el.classList.add('layout-item');
    el.style.border = '1px dashed #ccc';
    el.style.padding = '8px';
    el.style.borderRadius = '4px';
    el.style.minHeight = '100px';
    return el;
  }

  updateDOM(): boolean {
    return false;
  }

  isShadowRoot(): boolean {
    return true;
  }
}

export function $createLayoutContainerNode(columns: number = 2): LayoutContainerNode {
  return new LayoutContainerNode(columns);
}

export function $createLayoutItemNode(): LayoutItemNode {
  return new LayoutItemNode();
}

export function $isLayoutContainerNode(
  node: LexicalNode | null | undefined
): node is LayoutContainerNode {
  return node instanceof LayoutContainerNode;
}

export function $isLayoutItemNode(
  node: LexicalNode | null | undefined
): node is LayoutItemNode {
  return node instanceof LayoutItemNode;
}

// Helper to create a layout with columns and content
export function $createColumnsLayout(columns: number): LayoutContainerNode {
  const container = $createLayoutContainerNode(columns);
  for (let i = 0; i < columns; i++) {
    const item = $createLayoutItemNode();
    item.append($createParagraphNode());
    container.append(item);
  }
  return container;
}
