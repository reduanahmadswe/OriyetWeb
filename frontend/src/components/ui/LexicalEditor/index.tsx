'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HashtagNode } from '@lexical/hashtag';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { TRANSFORMERS } from '@lexical/markdown';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import OnChangePlugin from './plugins/OnChangePlugin';
import ImagePlugin from './plugins/ImagePlugin';
import YouTubePlugin from './plugins/YouTubePlugin';
import PageBreakPlugin from './plugins/PageBreakPlugin';
import { ImageNode } from './nodes/ImageNode';
import { YouTubeNode } from './nodes/YouTubeNode';
import { PageBreakNode } from './nodes/PageBreakNode';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import './styles.css';

function Placeholder() {
  return <div className="editor-placeholder">Start writing your content...</div>;
}

const editorConfig = {
  namespace: 'LexicalEditor',
  theme: {
    root: 'editor-root',
    link: 'editor-link',
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
      strikethrough: 'editor-text-strikethrough',
      underlineStrikethrough: 'editor-text-underlineStrikethrough',
      code: 'editor-text-code',
      subscript: 'editor-text-subscript',
      superscript: 'editor-text-superscript',
    },
    heading: {
      h1: 'editor-heading-h1',
      h2: 'editor-heading-h2',
      h3: 'editor-heading-h3',
      h4: 'editor-heading-h4',
      h5: 'editor-heading-h5',
    },
    list: {
      nested: {
        listitem: 'editor-nested-listitem',
      },
      ol: 'editor-list-ol',
      ul: 'editor-list-ul',
      listitem: 'editor-listitem',
      checklist: 'editor-checklist',
      listitemChecked: 'editor-listitem-checked',
      listitemUnchecked: 'editor-listitem-unchecked',
    },
    table: 'editor-table',
    tableCell: 'editor-table-cell',
    tableCellHeader: 'editor-table-cell-header',
    quote: 'editor-quote',
    code: 'editor-code',
    codeHighlight: {
      atrule: 'editor-tokenAttr',
      attr: 'editor-tokenAttr',
      boolean: 'editor-tokenProperty',
      builtin: 'editor-tokenSelector',
      cdata: 'editor-tokenComment',
      char: 'editor-tokenSelector',
      class: 'editor-tokenFunction',
      'class-name': 'editor-tokenFunction',
      comment: 'editor-tokenComment',
      constant: 'editor-tokenProperty',
      deleted: 'editor-tokenProperty',
      doctype: 'editor-tokenComment',
      entity: 'editor-tokenOperator',
      function: 'editor-tokenFunction',
      important: 'editor-tokenVariable',
      inserted: 'editor-tokenSelector',
      keyword: 'editor-tokenAttr',
      namespace: 'editor-tokenVariable',
      number: 'editor-tokenProperty',
      operator: 'editor-tokenOperator',
      prolog: 'editor-tokenComment',
      property: 'editor-tokenProperty',
      punctuation: 'editor-tokenPunctuation',
      regex: 'editor-tokenVariable',
      selector: 'editor-tokenSelector',
      string: 'editor-tokenSelector',
      symbol: 'editor-tokenProperty',
      tag: 'editor-tokenProperty',
      url: 'editor-tokenOperator',
      variable: 'editor-tokenVariable',
    },
    image: 'editor-image',
    paragraph: 'editor-paragraph',
  },
  onError(error: Error) {
    console.error('Lexical Error:', error);
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    HashtagNode,
    HorizontalRuleNode,
    ImageNode,
    YouTubeNode,
    PageBreakNode,
  ],
};

interface LexicalEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function LexicalEditor({ value, onChange, placeholder, className }: LexicalEditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={`lexical-editor-container ${className || ''}`}>
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={placeholder ? <div className="editor-placeholder">{placeholder}</div> : <Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <AutoLinkPlugin />
          <CodeHighlightPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <TabIndentationPlugin />
          <OnChangePlugin value={value} onChange={onChange} />
          <ImagePlugin />
          <YouTubePlugin />
          <PageBreakPlugin />
          <FloatingLinkEditorPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default LexicalEditor;
