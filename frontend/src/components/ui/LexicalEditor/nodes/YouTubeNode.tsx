'use client';

import React from 'react';
import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

export type SerializedYouTubeNode = Spread<
  {
    videoID: string;
  },
  SerializedLexicalNode
>;

function convertYoutubeElement(domNode: HTMLElement): null | DOMConversionOutput {
  const videoID = domNode.getAttribute('data-lexical-youtube');
  if (videoID) {
    const node = $createYouTubeNode(videoID);
    return { node };
  }
  return null;
}

export class YouTubeNode extends DecoratorNode<React.ReactElement> {
  __videoID: string;

  static getType(): string {
    return 'youtube';
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__videoID, node.__key);
  }

  static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
    const node = $createYouTubeNode(serializedNode.videoID);
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-youtube')) {
          return null;
        }
        return {
          conversion: convertYoutubeElement,
          priority: 1,
        };
      },
    };
  }

  constructor(videoID: string, key?: NodeKey) {
    super(key);
    this.__videoID = videoID;
  }

  exportJSON(): SerializedYouTubeNode {
    return {
      type: 'youtube',
      version: 1,
      videoID: this.__videoID,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe');
    element.setAttribute('data-lexical-youtube', this.__videoID);
    element.setAttribute('width', '560');
    element.setAttribute('height', '315');
    element.setAttribute(
      'src',
      `https://www.youtube-nocookie.com/embed/${this.__videoID}`
    );
    element.setAttribute('frameborder', '0');
    element.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    );
    element.setAttribute('allowfullscreen', 'true');
    element.setAttribute('title', 'YouTube video');
    return { element };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getVideoID(): string {
    return this.__videoID;
  }

  decorate(): React.ReactElement {
    return (
      <div className="youtube-embed-container">
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube-nocookie.com/embed/${this.__videoID}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        />
      </div>
    );
  }
}

export function $createYouTubeNode(videoID: string): YouTubeNode {
  return new YouTubeNode(videoID);
}

export function $isYouTubeNode(
  node: LexicalNode | null | undefined
): node is YouTubeNode {
  return node instanceof YouTubeNode;
}
