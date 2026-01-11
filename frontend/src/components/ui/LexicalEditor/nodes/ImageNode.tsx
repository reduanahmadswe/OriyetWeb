'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_DELETE_COMMAND,
  KEY_BACKSPACE_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
} from 'lucide-react';

export interface ImagePayload {
  src: string;
  altText: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
  width?: number;
  height?: number;
  key?: NodeKey;
}

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    caption: string;
    alignment: 'left' | 'center' | 'right';
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt: altText } = domNode;
    const node = $createImageNode({ src, altText });
    return { node };
  }
  return null;
}

/**
 * Converts cloud storage sharing links to direct image URLs
 * Supports: Google Drive, Dropbox, OneDrive, etc.
 * Uses the same approach as newsletter page for consistency
 */
function convertToDirectImageUrl(url: string): string {
  if (!url) return '';

  // Check if it's already a direct image URL (not Google Drive)
  if (!url.includes('drive.google.com') && !url.includes('docs.google.com') &&
    !url.includes('dropbox.com') && !url.includes('onedrive.live.com') &&
    !url.includes('1drv.ms')) {
    return url;
  }

  // Google Drive: Extract file ID from various formats
  let fileId = '';

  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }

  // Format: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      fileId = openMatch[1];
    }
  }

  // Format: https://drive.google.com/uc?id=FILE_ID
  if (!fileId) {
    const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
    if (ucMatch) {
      fileId = ucMatch[1];
    }
  }

  // If Google Drive file ID found, use thumbnail API (same as newsletter page)
  if (fileId) {
    // Use larger size for blog images (w2000 for high quality)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  }

  // Dropbox: https://www.dropbox.com/s/FILE_ID/image.jpg?dl=0
  // Convert to: https://dl.dropboxusercontent.com/s/FILE_ID/image.jpg
  if (url.includes('dropbox.com')) {
    return url
      .replace('?dl=0', '')
      .replace('?dl=1', '')
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace('dropbox.com', 'dl.dropboxusercontent.com');
  }

  // OneDrive: Convert sharing link to embed link
  if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
    return url.replace('view.aspx', 'embed.aspx').replace('redir', 'embed');
  }

  // If no conversion needed, return original URL
  return url;
}

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __altText: string;
  __caption: string;
  __alignment: 'left' | 'center' | 'right';
  __width?: number;
  __height?: number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__caption,
      node.__alignment,
      node.__width,
      node.__height,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, caption, alignment, width, height } = serializedNode;
    return new ImageNode(src, altText, caption || '', alignment || 'center', width, height);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    caption: string = '',
    alignment: 'left' | 'center' | 'right' = 'center',
    width?: number,
    height?: number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = convertToDirectImageUrl(src); // Convert cloud storage links
    this.__altText = altText;
    this.__caption = caption;
    this.__alignment = alignment;
    this.__width = width;
    this.__height = height;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      caption: this.__caption,
      alignment: this.__alignment,
      width: this.__width,
      height: this.__height,
    };
  }

  exportDOM(): DOMExportOutput {
    const figure = document.createElement('figure');
    figure.style.textAlign = this.__alignment;

    const img = document.createElement('img');
    img.setAttribute('src', this.__src);
    img.setAttribute('alt', this.__altText);
    img.setAttribute('class', 'editor-image');
    figure.appendChild(img);

    if (this.__caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = this.__caption;
      figure.appendChild(figcaption);
    }

    return { element: figure };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  getCaption(): string {
    return this.__caption;
  }

  getAlignment(): 'left' | 'center' | 'right' {
    return this.__alignment;
  }

  setCaption(caption: string): void {
    const writable = this.getWritable();
    writable.__caption = caption;
  }

  setAlignment(alignment: 'left' | 'center' | 'right'): void {
    const writable = this.getWritable();
    writable.__alignment = alignment;
  }

  setDimensions(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  decorate(): React.ReactElement {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        caption={this.__caption}
        alignment={this.__alignment}
        width={this.__width}
        height={this.__height}
        nodeKey={this.__key}
      />
    );
  }
}

function ImageComponent({
  src,
  altText,
  caption,
  alignment,
  width,
  height,
  nodeKey,
}: {
  src: string;
  altText: string;
  caption: string;
  alignment: 'left' | 'center' | 'right';
  width?: number;
  height?: number;
  nodeKey: NodeKey;
}) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [showCaption, setShowCaption] = useState(!!caption);
  const [captionText, setCaptionText] = useState(caption);
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [tempWidth, setTempWidth] = useState<number>(width || 0);
  const [tempHeight, setTempHeight] = useState<number>(height || 0);
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      if (img.complete) {
        setNaturalWidth(img.naturalWidth);
        setNaturalHeight(img.naturalHeight);
        setAspectRatio(img.naturalWidth / img.naturalHeight);
        if (!width || !height) {
          setTempWidth(img.naturalWidth);
          setTempHeight(img.naturalHeight);
        }
      } else {
        img.onload = () => {
          setNaturalWidth(img.naturalWidth);
          setNaturalHeight(img.naturalHeight);
          setAspectRatio(img.naturalWidth / img.naturalHeight);
          if (!width || !height) {
            setTempWidth(img.naturalWidth);
            setTempHeight(img.naturalHeight);
          }
        };
      }
    }
  }, [src, width, height]);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node) {
            node.remove();
          }
        });
        return true;
      }
      return false;
    },
    [editor, isSelected, nodeKey]
  );

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (imageRef.current && imageRef.current.contains(event.target as Node)) {
        if (!event.shiftKey) {
          clearSelection();
        }
        setSelected(true);
        return true;
      }
      return false;
    },
    [clearSelection, setSelected]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW)
    );
  }, [editor, onClick, onDelete]);

  const handleAlignmentChange = (newAlignment: 'left' | 'center' | 'right') => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setAlignment(newAlignment);
      }
    });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setCaptionText(newCaption);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setCaption(newCaption);
      }
    });
  };

  const handleAddCaption = () => {
    setShowCaption(true);
  };

  const handleDeleteImage = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  };

  const handleOpenResizeModal = () => {
    setTempWidth(width || naturalWidth);
    setTempHeight(height || naturalHeight);
    setShowResizeModal(true);
  };

  const handleWidthChange = (newWidth: number) => {
    setTempWidth(newWidth);
    if (lockAspectRatio && aspectRatio) {
      setTempHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setTempHeight(newHeight);
    if (lockAspectRatio && aspectRatio) {
      setTempWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const handleApplyResize = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setDimensions(tempWidth, tempHeight);
      }
    });
    setShowResizeModal(false);
  };

  const handleResetSize = () => {
    setTempWidth(naturalWidth);
    setTempHeight(naturalHeight);
  };

  const alignmentStyles: Record<string, React.CSSProperties> = {
    left: { marginRight: 'auto', marginLeft: 0 },
    center: { marginLeft: 'auto', marginRight: 'auto' },
    right: { marginLeft: 'auto', marginRight: 0 },
  };

  const imageStyle: React.CSSProperties = {
    ...(width && { width: `${width}px` }),
    ...(height && { height: `${height}px` }),
  };

  return (
    <>
      <figure
        className={`image-container ${isSelected ? 'selected' : ''}`}
        style={{ textAlign: alignment }}
      >
        <div className="image-wrapper" style={alignmentStyles[alignment]}>
          <img
            ref={imageRef}
            src={src}
            alt={altText}
            className={`editor-image ${isSelected ? 'selected' : ''}`}
            style={imageStyle}
            draggable="false"
            onDoubleClick={handleOpenResizeModal}
          />

          {isSelected && (
            <div className="image-toolbar">
              <button
                type="button"
                className={`image-toolbar-btn ${alignment === 'left' ? 'active' : ''}`}
                onClick={() => handleAlignmentChange('left')}
                title="Align Left"
              >
                <AlignLeft size={16} />
              </button>
              <button
                type="button"
                className={`image-toolbar-btn ${alignment === 'center' ? 'active' : ''}`}
                onClick={() => handleAlignmentChange('center')}
                title="Align Center"
              >
                <AlignCenter size={16} />
              </button>
              <button
                type="button"
                className={`image-toolbar-btn ${alignment === 'right' ? 'active' : ''}`}
                onClick={() => handleAlignmentChange('right')}
                title="Align Right"
              >
                <AlignRight size={16} />
              </button>
              <div className="image-toolbar-divider" />
              <button
                type="button"
                className="image-toolbar-btn"
                onClick={handleOpenResizeModal}
                title="Resize Image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2h-4M3 9V5a2 2 0 0 1 2-2h4M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
              <div className="image-toolbar-divider" />
              <button
                type="button"
                className="image-toolbar-btn delete"
                onClick={handleDeleteImage}
                title="Delete Image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}

          {!showCaption && isSelected && (
            <button
              type="button"
              className="add-caption-btn"
              onClick={handleAddCaption}
            >
              Add Caption
            </button>
          )}
        </div>

        {showCaption && (
          <figcaption className="image-caption">
            <input
              type="text"
              value={captionText}
              onChange={handleCaptionChange}
              placeholder="Enter caption..."
              className="caption-input"
            />
          </figcaption>
        )}
      </figure>

      {showResizeModal && (
        <div className="image-resize-modal-overlay" onClick={() => setShowResizeModal(false)}>
          <div className="image-resize-modal" onClick={(e) => e.stopPropagation()}>
            <div className="image-resize-modal-header">
              <h3>Resize & Crop Image</h3>
              <button
                type="button"
                className="image-resize-modal-close"
                onClick={() => setShowResizeModal(false)}
              >
                ×
              </button>
            </div>

            <div className="image-resize-modal-body">
              <div className="image-resize-preview">
                <img
                  src={src}
                  alt={altText}
                  style={{
                    width: `${tempWidth}px`,
                    height: `${tempHeight}px`,
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                  }}
                />
              </div>

              <div className="image-resize-controls">
                <div className="image-resize-info">
                  <span>Original: {naturalWidth} × {naturalHeight}px</span>
                  <span>Current: {tempWidth} × {tempHeight}px</span>
                </div>

                <div className="image-resize-inputs">
                  <div className="image-resize-input-group">
                    <label>Width (px)</label>
                    <input
                      type="number"
                      value={tempWidth}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      min="1"
                      max={naturalWidth * 2}
                    />
                  </div>

                  <button
                    type="button"
                    className={`aspect-ratio-lock ${lockAspectRatio ? 'locked' : ''}`}
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    title={lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                  >
                    {lockAspectRatio ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                      </svg>
                    )}
                  </button>

                  <div className="image-resize-input-group">
                    <label>Height (px)</label>
                    <input
                      type="number"
                      value={tempHeight}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      min="1"
                      max={naturalHeight * 2}
                    />
                  </div>
                </div>

                <div className="image-resize-sliders">
                  <div className="image-resize-slider-group">
                    <label>Width: {tempWidth}px</label>
                    <input
                      type="range"
                      value={tempWidth}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      min="50"
                      max={naturalWidth * 2}
                      step="1"
                    />
                  </div>

                  <div className="image-resize-slider-group">
                    <label>Height: {tempHeight}px</label>
                    <input
                      type="range"
                      value={tempHeight}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      min="50"
                      max={naturalHeight * 2}
                      step="1"
                    />
                  </div>
                </div>

                <div className="image-resize-actions">
                  <button
                    type="button"
                    className="image-resize-btn secondary"
                    onClick={handleResetSize}
                  >
                    Reset to Original
                  </button>
                  <div className="image-resize-actions-right">
                    <button
                      type="button"
                      className="image-resize-btn secondary"
                      onClick={() => setShowResizeModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="image-resize-btn primary"
                      onClick={handleApplyResize}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function $createImageNode({
  src,
  altText,
  caption = '',
  alignment = 'center',
  width,
  height,
}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, caption, alignment, width, height);
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
