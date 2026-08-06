import { useEffect, useMemo, useRef, useState } from 'react';

import { BranaModal } from '../../../components/BranaModal.jsx';
import {
  PIXEL_EDITOR_SIZE,
  clearPixelMatrix,
  clonePixelMatrix,
  countActivePixels,
  dataUrlToPixelMatrix,
  matrixToPngDataUrl,
  togglePixel,
} from '../model/simboloGraficoPixelEditorUtils.js';

function matrixFromInitialImage(initialImage) {
  if (!initialImage) return clearPixelMatrix();
  if (Array.isArray(initialImage)) return clonePixelMatrix(initialImage);
  return clearPixelMatrix();
}

export function SimboloGraficoPixelEditor({ open, initialImage, onConfirm, onCancel, disabled = false }) {
  const [matrix, setMatrix] = useState(() => matrixFromInitialImage(initialImage));
  const [tool, setTool] = useState('pencil');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const gridRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setMatrix(matrixFromInitialImage(initialImage));
    setTool('pencil');
    setDragging(false);
    setError('');
  }, [initialImage, open]);

  const preview = useMemo(() => matrixToPngDataUrl(matrix), [matrix]);
  const activePixels = useMemo(() => countActivePixels(matrix), [matrix]);

  const paint = (row, col) => {
    if (disabled) return;
    setMatrix((current) => togglePixel(current, row, col, tool === 'pencil'));
  };

  const handlePointerDown = (event, row, col) => {
    if (disabled) return;
    event.preventDefault();
    setDragging(true);
    paint(row, col);
    event.currentTarget?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerEnter = (event, row, col) => {
    if (!dragging || disabled) return;
    event.preventDefault();
    paint(row, col);
  };

  const stopDragging = (event) => {
    setDragging(false);
    event?.currentTarget?.releasePointerCapture?.(event.pointerId);
  };

  const handleCancel = () => {
    setDragging(false);
    setError('');
    onCancel?.();
  };

  const handleConfirm = () => {
    if (disabled) return;
    const png = matrixToPngDataUrl(matrix);
    onConfirm?.(png || null);
  };

  const handleImageImport = async (value) => {
    try {
      const next = await dataUrlToPixelMatrix(value, PIXEL_EDITOR_SIZE);
      setMatrix(next);
      setError('');
    } catch (err) {
      setError(err?.message || 'Imagem invalida.');
    }
  };

  useEffect(() => {
    const listener = (event) => {
      if (!open) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [open]);

  if (!open) return null;

  return (
    <BranaModal open centered width={720} title="Editor gráfico 15x15" footer={null} keyboard maskClosable={!disabled} onCancel={handleCancel} className="simbolos-graficos-pixel-editor-modal">
      <style>{`
        .simbolos-graficos-pixel-editor-shell { display: grid; grid-template-columns: minmax(0, 1fr) 180px; gap: 12px; align-items: start; }
        .simbolos-graficos-pixel-editor-panel { border: 1px solid var(--brana-border-subtle); background: var(--brana-surface-panel); padding: 10px; color: var(--brana-text-primary); }
        .simbolos-graficos-pixel-editor-grid { display: grid; grid-template-columns: repeat(${PIXEL_EDITOR_SIZE}, 1fr); width: 100%; aspect-ratio: 1 / 1; touch-action: none; user-select: none; }
        .simbolos-graficos-pixel-editor-cell { border: 1px solid var(--brana-border-subtle); background: var(--brana-surface-card); padding: 0; min-height: 0; }
        .simbolos-graficos-pixel-editor-cell.is-active { background: var(--brana-text-primary); }
        .simbolos-graficos-pixel-editor-preview { border: 1px solid var(--brana-border-subtle); background: var(--brana-surface-card); display: grid; place-items: center; padding: 10px; }
        .simbolos-graficos-pixel-editor-preview img { width: 150px; height: 150px; image-rendering: pixelated; }
        .simbolos-graficos-pixel-editor-toolbar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
        .simbolos-graficos-pixel-editor-toolbar button { min-width: 74px; height: 28px; border: 1px solid var(--brana-control-border); background: var(--brana-control-background); color: var(--brana-text-primary); border-radius: 6px; }
        .simbolos-graficos-pixel-editor-toolbar button.is-active { font-weight: 700; border-color: var(--brana-brand-primary); box-shadow: inset 0 0 0 1px var(--brana-brand-primary); }
        .simbolos-graficos-pixel-editor-footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 8px; }
        .simbolos-graficos-pixel-editor-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px; }
        .simbolos-graficos-pixel-editor-actions button { min-width: 92px; height: 38px; border-radius: 6px; border: 1px solid var(--brana-control-border); background: var(--brana-surface-panel); color: var(--brana-text-primary); padding: 0 14px; }
        .simbolos-graficos-pixel-editor-actions button:disabled { color: var(--brana-text-secondary); background: var(--brana-surface-disabled); }
        .simbolos-graficos-pixel-editor-error { color: #c0392b; font-size: 12px; }
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-panel,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-preview,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-cell,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-toolbar button,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-actions button {
          background: var(--brana-surface-panel);
          color: var(--brana-text-primary);
          border-color: var(--brana-border-subtle);
        }
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-cell.is-active { background: var(--brana-text-primary); }
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-actions button:disabled,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-toolbar button:disabled { background: var(--brana-surface-disabled); color: var(--brana-text-secondary); }
      `}</style>

      <div className="simbolos-graficos-pixel-editor-shell">
        <div className="simbolos-graficos-pixel-editor-panel">
          <div className="simbolos-graficos-pixel-editor-toolbar" role="toolbar" aria-label="Ferramentas do editor">
            <button type="button" className={tool === 'pencil' ? 'is-active' : ''} onClick={() => setTool('pencil')} disabled={disabled}>Lápis</button>
            <button type="button" className={tool === 'eraser' ? 'is-active' : ''} onClick={() => setTool('eraser')} disabled={disabled}>Borracha</button>
          </div>

          {error ? <div className="simbolos-graficos-pixel-editor-error" role="alert">{error}</div> : null}

          <div
            ref={gridRef}
            className="simbolos-graficos-pixel-editor-grid"
            onPointerUp={stopDragging}
            onPointerLeave={stopDragging}
            onPointerCancel={stopDragging}
            aria-label="Grade 15 por 15"
          >
            {matrix.map((row, rowIndex) => row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                className={`simbolos-graficos-pixel-editor-cell ${cell ? 'is-active' : ''}`.trim()}
                aria-label={`Linha ${rowIndex + 1} coluna ${colIndex + 1}`}
                onPointerDown={(event) => handlePointerDown(event, rowIndex, colIndex)}
                onPointerEnter={(event) => handlePointerEnter(event, rowIndex, colIndex)}
                onClick={(event) => event.preventDefault()}
                disabled={disabled}
              />
            )))}
          </div>

          <div className="simbolos-graficos-pixel-editor-footer">
            <span>{activePixels} pixels ativos</span>
            <div className="simbolos-graficos-pixel-editor-actions">
              <button type="button" onClick={() => handleImageImport(initialImage)} disabled={disabled}>Recarregar</button>
              <button type="button" onClick={handleConfirm} disabled={disabled}>Confirmar</button>
              <button type="button" onClick={handleCancel} disabled={disabled}>Cancelar</button>
            </div>
          </div>
        </div>

        <div className="simbolos-graficos-pixel-editor-preview">
          {preview ? <img src={preview} alt="Pré-visualização do símbolo" /> : null}
        </div>
      </div>
    </BranaModal>
  );
}
