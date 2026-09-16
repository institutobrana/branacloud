import { useState } from 'react';
import { useEditorState } from '@tiptap/react';

const RULER_UNITS = 36;
const MAJOR_TICK_EVERY = 6;
const MM_TO_PX = 96 / 25.4;
const MIN_TEXT_WIDTH_PX = 24;

export function isSelectionInsideList(state) {
  if (!state?.selection) return false;
  const resolved = state.doc.resolve(state.selection.head);
  for (let depth = resolved.depth; depth > 0; depth -= 1) {
    if (['bulletList', 'orderedList', 'listItem'].includes(resolved.node(depth).type.name)) return true;
  }
  return false;
}

export function isSelectionInsideTable(state) {
  if (!state?.selection) return false;
  const resolved = state.doc.resolve(state.selection.head);
  for (let depth = resolved.depth; depth > 0; depth -= 1) {
    if (['tableCell', 'tableHeader'].includes(resolved.node(depth).type.name)) return true;
  }
  return false;
}

export function EditorTextosRuler({ pageConfig, editor }) {
  const [preview, setPreview] = useState(null);
  const ticks = Array.from({ length: RULER_UNITS + 1 }, (_, unit) => unit);
  const config = pageConfig || { largura_mm: 215.9, margem_esquerda_mm: 33.16, margem_direita_mm: 33.16 };
  const selected = editor?.state?.selection;
  useEditorState({ editor, selector: ({ editor: current }) => current?.state?.selection });
  let paragraph = null;
  if (editor && selected) {
    editor.state.doc.nodesBetween(selected.from, selected.to, (node) => { if (!paragraph && node.type.name === 'paragraph') paragraph = node; });
    if (!paragraph) paragraph = editor.state.doc.resolve(selected.head).parent;
  }
  const listContext = isSelectionInsideList(editor?.state);
  const tableContext = isSelectionInsideTable(editor?.state);
  const rulerDisabled = listContext || tableContext;
  const leftValue = preview?.side === 'left' ? preview.value : (Number(paragraph?.attrs?.leftIndentPx ?? paragraph?.attrs?.indent ?? 0) || 0);
  const rightValue = preview?.side === 'right' ? preview.value : (Number(paragraph?.attrs?.rightIndentPx || 0) || 0);
  const usefulPx = Math.max(MIN_TEXT_WIDTH_PX, (config.largura_mm - config.margem_esquerda_mm - config.margem_direita_mm) * MM_TO_PX);
  const left = Math.min(100, Math.max(0, (config.margem_esquerda_mm / config.largura_mm) * 100));
  const right = Math.min(100, Math.max(0, ((config.largura_mm - config.margem_direita_mm) / config.largura_mm) * 100));
  const leftHandle = left + (leftValue / (config.largura_mm * MM_TO_PX)) * 100;
  const rightHandle = right - (rightValue / (config.largura_mm * MM_TO_PX)) * 100;
  const valueFromPointer = (side, clientX, rect) => {
    if (!editor || !paragraph) return;
    const x = Math.max(0, Math.min(usefulPx, clientX - rect.left - (config.margem_esquerda_mm * MM_TO_PX)));
    const opposite = side === 'left' ? rightValue : leftValue;
    const value = Math.max(0, Math.min(usefulPx - MIN_TEXT_WIDTH_PX - opposite, side === 'left' ? x : usefulPx - x));
    return value;
  };
  const drag = (side) => (event) => {
    if (rulerDisabled) { event.preventDefault(); return; }
    event.preventDefault();
    const rect = event.currentTarget.parentElement.getBoundingClientRect();
    let lastX = event.clientX;
    const move = (moveEvent) => { lastX = moveEvent.clientX; setPreview({ side, value: valueFromPointer(side, lastX, rect) }); };
    const finish = () => { const value = valueFromPointer(side, lastX, rect); if (value != null) editor.commands[side === 'left' ? 'setRulerLeftIndent' : 'setRulerRightIndent']({ value }); cleanup(); };
    const cleanup = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', cancel); setPreview(null); };
    const cancel = () => cleanup();
    setPreview({ side, value: valueFromPointer(side, lastX, rect) });
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', finish, { once: true });
    window.addEventListener('pointercancel', cancel, { once: true });
  };
  const handleKeyDown = (side) => (event) => {
    if (rulerDisabled || !editor || !paragraph || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const current = side === 'left' ? leftValue : rightValue;
    const delta = side === 'right'
      ? (event.key === 'ArrowLeft' ? 1 : -1)
      : (event.key === 'ArrowRight' ? 1 : -1);
    const next = Math.max(0, current + delta);
    editor.commands[side === 'left' ? 'setRulerLeftIndent' : 'setRulerRightIndent']({ value: next });
  };
  return (
    <div className="editor-textos-ruler" data-testid="editor-textos-ruler" aria-label="Régua horizontal" style={{ width: `max(360px, ${config.largura_mm * (96 / 25.4)}px)` }}>
      <div className="editor-textos-ruler-track">
        {ticks.map((unit) => {
          const major = unit % MAJOR_TICK_EVERY === 0;
          return (
            <span
              key={unit}
              className={`editor-textos-ruler-tick${major ? ' is-major' : ''}`}
              style={{ left: `${(unit / RULER_UNITS) * 100}%` }}
            >
              {major && <span className="editor-textos-ruler-label">{unit}</span>}
            </span>
          );
        })}
        <span className={`editor-textos-ruler-marker is-left${rulerDisabled ? ' is-disabled' : ''}`} role="slider" tabIndex={rulerDisabled ? -1 : 0} aria-disabled={rulerDisabled} aria-label="Recuo esquerdo" aria-valuemin={0} aria-valuenow={leftValue} aria-valuemax={usefulPx - MIN_TEXT_WIDTH_PX - rightValue} onPointerDown={drag('left')} onKeyDown={handleKeyDown('left')} style={{ left: `${leftHandle}%` }} />
        <span className={`editor-textos-ruler-marker is-right${rulerDisabled ? ' is-disabled' : ''}`} data-testid="editor-textos-ruler-right" role="slider" tabIndex={rulerDisabled ? -1 : 0} aria-disabled={rulerDisabled} aria-label="Recuo direito" aria-valuemin={0} aria-valuenow={rightValue} aria-valuemax={usefulPx - MIN_TEXT_WIDTH_PX - leftValue} onPointerDown={drag('right')} onKeyDown={handleKeyDown('right')} style={{ left: `${rightHandle}%` }} />
      </div>
    </div>
  );
}
