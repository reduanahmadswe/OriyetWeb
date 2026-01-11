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

export type SerializedEquationNode = Spread<
  {
    equation: string;
    inline: boolean;
  },
  SerializedLexicalNode
>;

export class EquationNode extends DecoratorNode<React.ReactElement> {
  __equation: string;
  __inline: boolean;

  static getType(): string {
    return 'equation';
  }

  static clone(node: EquationNode): EquationNode {
    return new EquationNode(node.__equation, node.__inline, node.__key);
  }

  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    return $createEquationNode(serializedNode.equation, serializedNode.inline);
  }

  constructor(equation: string, inline: boolean = false, key?: NodeKey) {
    super(key);
    this.__equation = equation;
    this.__inline = inline;
  }

  exportJSON(): SerializedEquationNode {
    return {
      type: 'equation',
      version: 1,
      equation: this.__equation,
      inline: this.__inline,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement(this.__inline ? 'span' : 'div');
    element.classList.add('equation');
    element.setAttribute('data-equation', this.__equation);
    element.setAttribute('data-inline', this.__inline ? 'true' : 'false');
    return { element };
  }

  createDOM(): HTMLElement {
    const el = document.createElement(this.__inline ? 'span' : 'div');
    el.classList.add('equation-wrapper');
    return el;
  }

  updateDOM(): false {
    return false;
  }

  setEquation(equation: string): void {
    const writable = this.getWritable();
    writable.__equation = equation;
  }

  decorate(): React.ReactElement {
    return (
      <EquationComponent
        equation={this.__equation}
        inline={this.__inline}
        nodeKey={this.__key}
      />
    );
  }

  isInline(): boolean {
    return this.__inline;
  }
}

function EquationComponent({
  equation,
  inline,
  nodeKey,
}: {
  equation: string;
  inline: boolean;
  nodeKey: string;
}) {
  const [showEditor, setShowEditor] = React.useState(false);
  const [latexValue, setLatexValue] = React.useState(equation);

  // Render LaTeX using basic HTML for common math symbols
  const renderLatex = (latex: string) => {
    // Basic LaTeX to HTML conversion for common symbols
    let html = latex
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="frac"><span class="num">$1</span><span class="denom">$2</span></span>')
      .replace(/\\sqrt\{([^}]+)\}/g, '√<span class="sqrt">$1</span>')
      .replace(/\\sum/g, '∑')
      .replace(/\\int/g, '∫')
      .replace(/\\infty/g, '∞')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\theta/g, 'θ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\pi/g, 'π')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\omega/g, 'ω')
      .replace(/\\pm/g, '±')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\neq/g, '≠')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\approx/g, '≈')
      .replace(/\^([0-9]+)/g, '<sup>$1</sup>')
      .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
      .replace(/_([0-9]+)/g, '<sub>$1</sub>')
      .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    return html;
  };

  return (
    <span
      className={`equation ${inline ? 'inline' : 'block'}`}
      contentEditable={false}
      onClick={() => setShowEditor(true)}
    >
      {showEditor ? (
        <span className="equation-editor">
          <input
            type="text"
            value={latexValue}
            onChange={(e) => setLatexValue(e.target.value)}
            onBlur={() => setShowEditor(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setShowEditor(false);
              }
            }}
            autoFocus
            className="equation-input"
            placeholder="Enter LaTeX equation..."
          />
        </span>
      ) : (
        <span
          className="equation-display"
          dangerouslySetInnerHTML={{ __html: renderLatex(latexValue) || '∅' }}
        />
      )}
    </span>
  );
}

export function $createEquationNode(
  equation: string = '',
  inline: boolean = false
): EquationNode {
  return new EquationNode(equation, inline);
}

export function $isEquationNode(
  node: LexicalNode | null | undefined
): node is EquationNode {
  return node instanceof EquationNode;
}
