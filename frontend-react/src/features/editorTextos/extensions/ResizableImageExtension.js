import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImageNodeView } from '../components/ResizableImageNodeView.jsx';

export const ResizableImageExtension = Node.create({
  name: 'image',
  group: 'inline',
  inline: true,
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      width: { default: null },
      height: { default: null },
      fitPage: { default: true },
    };
  },
  parseHTML() { return [{ tag: 'img[src]' }]; },
  renderHTML({ HTMLAttributes }) { return ['img', mergeAttributes({ alt: 'Imagem' }, HTMLAttributes)]; },
  addNodeView() { return ReactNodeViewRenderer(ResizableImageNodeView); },
});
