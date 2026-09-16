import { NodeViewWrapper } from '@tiptap/react';
import { useRef } from 'react';

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

export function ResizableImageNodeView({ node, updateAttributes, selected }) {
  const start = useRef(null);
  const beginResize = (event, direction) => {
    event.preventDefault();
    event.stopPropagation();
    const image = event.currentTarget.closest('.editor-textos-image-node')?.querySelector('img');
    if (!(image instanceof HTMLImageElement)) return;
    const rect = image.getBoundingClientRect();
    start.current = { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height, ratio: rect.width / Math.max(1, rect.height), direction };
    const move = (moveEvent) => {
      const state = start.current;
      if (!state) return;
      const horizontal = state.direction.includes('e') ? 1 : state.direction.includes('w') ? -1 : 0;
      const vertical = state.direction.includes('s') ? 1 : state.direction.includes('n') ? -1 : 0;
      const delta = horizontal ? (moveEvent.clientX - state.x) * horizontal : (moveEvent.clientY - state.y) * vertical;
      const width = Math.max(24, Math.round(state.width + delta));
      updateAttributes({ width, height: Math.max(24, Math.round(width / state.ratio)) });
    };
    const end = () => { start.current = null; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end, { once: true });
  };
  const style = {
    width: node.attrs.width ? `${node.attrs.width}px` : undefined,
    height: 'auto',
    maxWidth: node.attrs.fitPage ? '100%' : undefined,
  };
  return <NodeViewWrapper as="span" className={`editor-textos-image-node${selected ? ' is-selected' : ''}`} data-fit-page={node.attrs.fitPage ? 'true' : 'false'}>
    <img src={node.attrs.src} alt="Imagem" style={style} draggable="false" />
    {selected && <span className="editor-textos-image-overlay" aria-hidden="true">{HANDLES.map((handle) => <button key={handle} type="button" className={`editor-textos-image-handle is-${handle}`} tabIndex={-1} onPointerDown={(event) => beginResize(event, handle)} />)}</span>}
  </NodeViewWrapper>;
}
