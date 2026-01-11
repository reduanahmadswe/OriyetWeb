'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  $createParagraphNode,
  $isElementNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread,
} from 'lexical';
import { ChevronDown, ChevronRight } from 'lucide-react';

type SerializedCollapsibleContainerNode = Spread<
  {
    open: boolean;
  },
  SerializedElementNode
>;

export class CollapsibleContainerNode extends ElementNode {
  __open: boolean;

  constructor(open: boolean, key?: NodeKey) {
    super(key);
    this.__open = open;
  }

  static getType(): string {
    return 'collapsible-container';
  }

  static clone(node: CollapsibleContainerNode): CollapsibleContainerNode {
    return new CollapsibleContainerNode(node.__open, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('details');
    dom.classList.add('collapsible-container');
    if (this.__open) {
      dom.open = true;
    }
    return dom;
  }

  updateDOM(prevNode: CollapsibleContainerNode, dom: HTMLDetailsElement): boolean {
    if (prevNode.__open !== this.__open) {
      dom.open = this.__open;
    }
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      details: () => ({
        conversion: convertCollapsibleContainerElement,
        priority: 1,
      }),
    };
  }

  static importJSON(
    serializedNode: SerializedCollapsibleContainerNode
  ): CollapsibleContainerNode {
    const node = $createCollapsibleContainerNode(serializedNode.open);
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('details');
    element.classList.add('collapsible-container');
    if (this.__open) {
      element.open = true;
    }
    return { element };
  }

  exportJSON(): SerializedCollapsibleContainerNode {
    return {
      ...super.exportJSON(),
      type: 'collapsible-container',
      version: 1,
      open: this.__open,
    };
  }

  setOpen(open: boolean): void {
    const writable = this.getWritable();
    writable.__open = open;
  }

  getOpen(): boolean {
    return this.getLatest().__open;
  }

  toggleOpen(): void {
    this.setOpen(!this.getOpen());
  }
}

export class CollapsibleTitleNode extends ElementNode {
  static getType(): string {
    return 'collapsible-title';
  }

  static clone(node: CollapsibleTitleNode): CollapsibleTitleNode {
    return new CollapsibleTitleNode(node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('summary');
    dom.classList.add('collapsible-title');
    return dom;
  }

  updateDOM(prevNode: CollapsibleTitleNode, dom: HTMLElement): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      summary: () => ({
        conversion: convertSummaryElement,
        priority: 1,
      }),
    };
  }

  static importJSON(): CollapsibleTitleNode {
    return $createCollapsibleTitleNode();
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('summary');
    element.classList.add('collapsible-title');
    return { element };
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'collapsible-title',
      version: 1,
    };
  }

  collapseAtStart(): boolean {
    this.getParentOrThrow().insertBefore(this);
    return true;
  }
}

export class CollapsibleContentNode extends ElementNode {
  static getType(): string {
    return 'collapsible-content';
  }

  static clone(node: CollapsibleContentNode): CollapsibleContentNode {
    return new CollapsibleContentNode(node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('div');
    dom.classList.add('collapsible-content');
    return dom;
  }

  updateDOM(prevNode: CollapsibleContentNode, dom: HTMLElement): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {};
  }

  static importJSON(): CollapsibleContentNode {
    return $createCollapsibleContentNode();
  }

  isShadowRoot(): boolean {
    return true;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.classList.add('collapsible-content');
    return { element };
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'collapsible-content',
      version: 1,
    };
  }
}

function convertCollapsibleContainerElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const isOpen = domNode.hasAttribute('open');
  const node = $createCollapsibleContainerNode(isOpen);
  return { node };
}

function convertSummaryElement(): DOMConversionOutput | null {
  const node = $createCollapsibleTitleNode();
  return { node };
}

export function $createCollapsibleContainerNode(
  isOpen: boolean
): CollapsibleContainerNode {
  return new CollapsibleContainerNode(isOpen);
}

export function $isCollapsibleContainerNode(
  node: LexicalNode | null | undefined
): node is CollapsibleContainerNode {
  return node instanceof CollapsibleContainerNode;
}

export function $createCollapsibleTitleNode(): CollapsibleTitleNode {
  return new CollapsibleTitleNode();
}

export function $isCollapsibleTitleNode(
  node: LexicalNode | null | undefined
): node is CollapsibleTitleNode {
  return node instanceof CollapsibleTitleNode;
}

export function $createCollapsibleContentNode(): CollapsibleContentNode {
  return new CollapsibleContentNode();
}

export function $isCollapsibleContentNode(
  node: LexicalNode | null | undefined
): node is CollapsibleContentNode {
  return node instanceof CollapsibleContentNode;
}
