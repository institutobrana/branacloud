import { useEffect, useMemo, useRef, useState } from 'react';

import { BranaModal } from '../../../components/BranaModal.jsx';
import {
  SIMBOLO_GRAFICO_EDITOR_SIZE,
  clearPixelMatrix,
  clonePixelMatrix,
  loadImageSourceToPixelMatrix,
  matrixToPngDataUrl,
  isPixelActive,
  normalizePixelValue,
  togglePixel,
} from '../model/simboloGraficoPixelEditorUtils.js';
import { SIMBOLO_GRAFICO_PALETTE, SIMBOLO_GRAFICO_PALETTE_LIGHT_COLORS } from '../model/simboloGraficoPalette.js';

function applyPixelTool(matrix, row, col, tool, color) {
  return togglePixel(matrix, row, col, tool === 'pencil' ? color : null);
}

export function SimboloGraficoPixelEditor({
  open,
  initialImage,
  initialName = '',
  onConfirm,
  onCancel,
  disabled = false,
}) {
  const [matrix, setMatrix] = useState(() => clearPixelMatrix());
  const [tool, setTool] = useState('pencil');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [activeColor, setActiveColor] = useState('#111111');
  const dragCommittedRef = useRef(false);

  const resolvedName = String(initialName || '').trim();

  const resetEditorState = (nextMatrix, { keepHistory = false } = {}) => {
    setMatrix(nextMatrix);
    if (!keepHistory) {
      setHistory([]);
    }
    setTool('pencil');
    setDragging(false);
    dragCommittedRef.current = false;
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const hydrate = async () => {
      try {
        const next = await loadImageSourceToPixelMatrix(initialImage, SIMBOLO_GRAFICO_EDITOR_SIZE);
        if (cancelled) return;
        resetEditorState(next);
        setError('');
      } catch (err) {
        if (cancelled) return;
        resetEditorState(clearPixelMatrix());
        setError(err?.message || 'Imagem inválida.');
      }
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [initialImage, open]);

  const preview = useMemo(() => matrixToPngDataUrl(matrix), [matrix]);
  const resolveCellBackground = (cell) => normalizePixelValue(cell) || '#ffffff';

  const pushHistorySnapshot = (snapshotMatrix) => {
    setHistory((current) => [...current, clonePixelMatrix(snapshotMatrix)].slice(-40));
  };

  const paint = (row, col) => {
    if (disabled) return;
    setMatrix((current) => {
      const next = clonePixelMatrix(current);
      return applyPixelTool(next, row, col, tool, activeColor);
    });
  };

  const handlePointerDown = (event, row, col) => {
    if (disabled) return;
    event.preventDefault();
    dragCommittedRef.current = true;
    setDragging(true);
    pushHistorySnapshot(matrix);
    setMatrix((current) => applyPixelTool(current, row, col, tool, activeColor));
    event.currentTarget?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerEnter = (event, row, col) => {
    if (!dragging || disabled) return;
    event.preventDefault();
    paint(row, col);
  };

  const stopDragging = (event) => {
    setDragging(false);
    dragCommittedRef.current = false;
    event?.currentTarget?.releasePointerCapture?.(event.pointerId);
  };

  const handleCancel = () => {
    setDragging(false);
    dragCommittedRef.current = false;
    setError('');
    onCancel?.();
  };

  const handleConfirm = () => {
    if (disabled) return;
    const png = matrixToPngDataUrl(matrix);
    onConfirm?.(png || null);
  };

  const handleReload = async () => {
    if (disabled) return;
    try {
      pushHistorySnapshot(matrix);
      const next = await loadImageSourceToPixelMatrix(initialImage, SIMBOLO_GRAFICO_EDITOR_SIZE);
      resetEditorState(next, { keepHistory: true });
      setError('');
    } catch (err) {
      resetEditorState(clearPixelMatrix());
      setError(err?.message || 'Imagem inválida.');
    }
  };

  const handleUndo = () => {
    if (disabled) return;
    setHistory((currentHistory) => {
      if (!currentHistory.length) {
        setError('Desfazer não está disponível neste modo.');
        return currentHistory;
      }
      const previous = currentHistory[currentHistory.length - 1];
      setMatrix(clonePixelMatrix(previous));
      setError('');
      return currentHistory.slice(0, -1);
    });
  };

  const handleClear = () => {
    if (disabled) return;
    pushHistorySnapshot(matrix);
    resetEditorState(clearPixelMatrix(), { keepHistory: true });
    setError('');
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
    <BranaModal open centered width={958} title="Editor de símbolos gráficos" footer={null} keyboard maskClosable={!disabled} onCancel={handleCancel} className="simbolos-graficos-pixel-editor-modal">
      <style>{`
        .simbolos-graficos-pixel-editor-shell {
          display: grid;
          grid-template-columns: 360px 528px;
          gap: 22px;
          align-items: start;
          width: fit-content;
        }
        .simbolos-graficos-pixel-editor-group,
        .simbolos-graficos-pixel-editor-stage {
          border: 1px solid var(--brana-border-subtle);
          border-radius: 12px;
          background: var(--brana-surface-panel);
          color: var(--brana-text-primary);
        }
        .simbolos-graficos-pixel-editor-group {
          padding: 12px;
          height: fit-content;
          align-self: start;
        }
        .simbolos-graficos-pixel-editor-stage {
          padding: 12px;
          height: fit-content;
          width: 100%;
          align-self: start;
        }
        .simbolos-graficos-pixel-editor-left-column {
          display: grid;
          gap: 12px;
        }
        .simbolos-graficos-pixel-editor-group h3,
        .simbolos-graficos-pixel-editor-stage h3 {
          margin: 0 0 10px;
          font-size: 13px;
          font-weight: 700;
        }
        .simbolos-graficos-pixel-editor-field { margin-bottom: 12px; }
        .simbolos-graficos-pixel-editor-field label {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          color: var(--brana-text-primary);
        }
        .simbolos-graficos-pixel-editor-field input,
        .simbolos-graficos-pixel-editor-field .ant-select { width: 100%; }
        .simbolos-graficos-pixel-editor-field input,
        .simbolos-graficos-pixel-editor-field .ant-select-selector {
          height: 28px;
          border: 1px solid var(--brana-control-border) !important;
          background: var(--brana-surface-card) !important;
          color: var(--brana-text-primary) !important;
          padding: 0 8px !important;
          font: inherit;
        }
        .simbolos-graficos-pixel-editor-tools-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .simbolos-graficos-pixel-editor-stage-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }
        .simbolos-graficos-pixel-editor-stage-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 140px;
          gap: 12px;
          align-items: start;
          width: 100%;
        }
        .simbolos-graficos-pixel-editor-card {
          border: 1px solid var(--brana-border-subtle);
          border-radius: 12px;
          background: var(--brana-surface-card);
          padding: 12px;
          width: 100%;
          box-sizing: border-box;
        }
        .simbolos-graficos-pixel-editor-sample {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 10px;
        }
        .simbolos-graficos-pixel-editor-button {
          width: auto;
          min-width: 0;
          height: 38px;
          padding: 0 10px;
          border: 1px solid var(--brana-control-border);
          border-radius: 6px;
          background: var(--brana-surface-panel);
          color: var(--brana-text-primary);
          box-shadow: none;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          box-sizing: border-box;
        }
        .simbolos-graficos-pixel-editor-button:hover:not(:disabled) {
          background: var(--brana-surface-table-row-hover);
          border-color: var(--brana-control-hover);
        }
        .simbolos-graficos-pixel-editor-button:focus-visible {
          outline: 2px solid #5b9bd5;
          outline-offset: 1px;
        }
        .simbolos-graficos-pixel-editor-button[disabled] {
          color: var(--brana-text-secondary);
          background: var(--brana-surface-disabled);
          border-color: var(--brana-border-subtle);
          cursor: not-allowed;
        }
        .simbolos-graficos-pixel-editor-button.is-active {
          font-weight: 700;
          border-color: var(--brana-brand-primary);
          box-shadow: inset 0 0 0 1px var(--brana-brand-primary);
        }
        .simbolos-graficos-pixel-editor-grid {
          display: grid;
          grid-template-columns: repeat(${SIMBOLO_GRAFICO_EDITOR_SIZE}, 1fr);
          width: min(100%, 100%);
          max-width: 440px;
          aspect-ratio: 1 / 1;
          touch-action: none;
          user-select: none;
          border: 1px solid var(--brana-border-subtle);
          background: #fff;
        }
        .simbolos-graficos-pixel-editor-cell {
          border: 0;
          border-right: 1px solid #ebf0f5;
          border-bottom: 1px solid #ebf0f5;
          background: #fff;
          padding: 0;
          min-height: 0;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          box-shadow: none;
          outline: none;
        }
        .simbolos-graficos-pixel-editor-cell.is-active { background: var(--brana-text-primary); }
        .simbolos-graficos-pixel-editor-stage-tools-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }
        .simbolos-graficos-pixel-editor-stage-tools-grid button {
          min-width: 0;
          height: 38px;
          padding: 0 10px;
          border-radius: 6px;
          font-size: 12px;
          line-height: 1;
        }
        .simbolos-graficos-pixel-editor-stage-actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }
        .simbolos-graficos-pixel-editor-stage-actions .simbolos-graficos-pixel-editor-button {
          min-width: 0;
          width: 100%;
          white-space: nowrap;
        }
        .simbolos-graficos-pixel-editor-stage-tools-card {
          display: grid;
          gap: 10px;
        }
        .simbolos-graficos-pixel-editor-preview-card {
          border: 1px solid var(--brana-border-subtle);
          border-radius: 12px;
          background: var(--brana-surface-panel);
          color: var(--brana-text-primary);
          padding: 12px;
          display: grid;
          gap: 14px;
          height: fit-content;
          align-self: start;
          width: 100%;
          box-sizing: border-box;
        }
        .simbolos-graficos-pixel-editor-preview-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: stretch;
        }
        .simbolos-graficos-pixel-editor-preview-block strong {
          display: block;
          margin-bottom: 6px;
        }
        .simbolos-graficos-pixel-editor-preview-box {
          border: 1px solid var(--brana-control-border);
          background: var(--brana-surface-card);
          width: 100%;
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
          overflow: hidden;
          max-width: 100%;
        }
        .simbolos-graficos-pixel-editor-preview-box.is-expanded { aspect-ratio: 1 / 1; }
        .simbolos-graficos-pixel-editor-preview-box img {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
          object-fit: contain;
          display: block;
          flex: none;
        }
        .simbolos-graficos-pixel-editor-preview-box:not(.is-expanded) img {
          width: 24px;
          height: 24px;
          margin: auto;
        }
        .simbolos-graficos-pixel-editor-preview-box.is-expanded img {
          width: min(120px, 100%);
          height: min(120px, 100%);
        }
        .simbolos-graficos-pixel-editor-palette {
          display: grid;
          grid-template-columns: repeat(11, minmax(0, 1fr));
          gap: 7px;
          margin-top: 2px;
        }
        .simbolos-graficos-pixel-editor-color {
          width: 100%;
          aspect-ratio: 1;
          min-width: 20px;
          min-height: 20px;
          border: 1px solid rgba(60, 79, 69, 0.28);
          border-radius: 2px;
          cursor: pointer;
          position: relative;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.26);
          transition: transform 0.12s ease, box-shadow 0.12s ease, outline-color 0.12s ease;
        }
        .simbolos-graficos-pixel-editor-color.is-active {
          box-shadow: 0 0 0 2px #0f8a83, 0 0 0 4px rgba(15, 138, 131, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.34);
          transform: translateY(-1px);
        }
        .simbolos-graficos-pixel-editor-color.is-light { border-color: rgba(73, 88, 76, 0.5); }
        .simbolos-graficos-pixel-editor-help { margin: 14px 0 0; color: var(--brana-text-secondary); line-height: 1.55; }
        .simbolos-graficos-pixel-editor-error { color: #c0392b; font-size: 12px; margin-bottom: 8px; }
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-group,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-stage,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-card,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-preview-box,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-grid,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-cell,
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-button {
          background: var(--brana-surface-panel);
          color: var(--brana-text-primary);
          border-color: var(--brana-border-subtle);
        }
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-button.is-active {
          background: var(--brana-surface-panel);
          border-color: var(--brana-brand-primary);
          color: var(--brana-text-primary);
        }
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-button[disabled] {
          background: var(--brana-surface-disabled);
          color: var(--brana-text-secondary);
        }
        [data-brana-theme='dark'] .simbolos-graficos-pixel-editor-cell.is-active { background: var(--brana-text-primary); }
      `}</style>

      <div className="simbolos-graficos-pixel-editor-shell">
        <div className="simbolos-graficos-pixel-editor-left-column">
          <aside className="simbolos-graficos-pixel-editor-group">
            <h3>Dados do Símbolo</h3>
            <div className="simbolos-graficos-pixel-editor-field">
              <label>Nome do símbolo</label>
              <input type="text" value={resolvedName} readOnly disabled />
            </div>
            <div className="simbolos-graficos-pixel-editor-field">
              <div className="simbolos-graficos-pixel-editor-stage-actions" style={{ marginTop: 10 }}>
                <button type="button" className="auxiliary-shell-button simbolos-graficos-pixel-editor-button" onClick={handleReload} disabled={disabled}>Recarregar</button>
                <button type="button" className="auxiliary-shell-button simbolos-graficos-pixel-editor-button" onClick={handleConfirm} disabled={disabled}>Salvar como</button>
                <button type="button" className="auxiliary-shell-button simbolos-graficos-pixel-editor-button" onClick={handleCancel} disabled={disabled}>Cancela</button>
              </div>
            </div>
          </aside>

          <aside className="simbolos-graficos-pixel-editor-group">
            <h3>Ferramentas</h3>
            <div className="simbolos-graficos-pixel-editor-stage-tools-card">
              <div className="simbolos-graficos-pixel-editor-stage-tools-grid">
                <button type="button" className={`auxiliary-shell-button simbolos-graficos-pixel-editor-button ${tool === 'pencil' ? 'is-active' : ''}`.trim()} onClick={() => setTool('pencil')} disabled={disabled}>Lápis</button>
                <button type="button" className={`auxiliary-shell-button simbolos-graficos-pixel-editor-button ${tool === 'eraser' ? 'is-active' : ''}`.trim()} onClick={() => setTool('eraser')} disabled={disabled}>Borracha</button>
                <button type="button" className="auxiliary-shell-button simbolos-graficos-pixel-editor-button" onClick={handleUndo} disabled={disabled || history.length === 0}>Desfazer</button>
                <button type="button" className="auxiliary-shell-button simbolos-graficos-pixel-editor-button" onClick={handleClear} disabled={disabled}>Limpar</button>
              </div>
              <div>
                <strong>Paleta</strong>
                <div className="simbolos-graficos-pixel-editor-palette">
                  {SIMBOLO_GRAFICO_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`simbolos-graficos-pixel-editor-color ${activeColor === color ? 'is-active' : ''} ${SIMBOLO_GRAFICO_PALETTE_LIGHT_COLORS.has(String(color).toUpperCase()) ? 'is-light' : ''}`.trim()}
                      style={{ background: color }}
                      onClick={() => setActiveColor(color)}
                      disabled={disabled}
                      aria-label={`Selecionar cor ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="simbolos-graficos-pixel-editor-stage">
          <div className="simbolos-graficos-pixel-editor-stage-head">
            <h3>Área de edição do desenho</h3>
          </div>

          <div className="simbolos-graficos-pixel-editor-stage-body">
            <div className="simbolos-graficos-pixel-editor-card">
              {error ? <div className="simbolos-graficos-pixel-editor-error" role="alert">{error}</div> : null}

              <div
                className="simbolos-graficos-pixel-editor-grid"
                onPointerUp={stopDragging}
                onPointerLeave={stopDragging}
                onPointerCancel={stopDragging}
                aria-label="Editor de pixels"
              >
                {matrix.map((row, rowIndex) => row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    className={`simbolos-graficos-pixel-editor-cell ${isPixelActive(cell) ? 'is-active' : ''}`.trim()}
                    aria-label={`Linha ${rowIndex + 1} coluna ${colIndex + 1}`}
                    onPointerDown={(event) => handlePointerDown(event, rowIndex, colIndex)}
                    onPointerEnter={(event) => handlePointerEnter(event, rowIndex, colIndex)}
                    onClick={(event) => event.preventDefault()}
                    disabled={disabled}
                    style={{ backgroundColor: resolveCellBackground(cell) }}
                  />
                )))}
              </div>
            </div>

            <aside className="simbolos-graficos-pixel-editor-preview-card">
              <div className="simbolos-graficos-pixel-editor-preview-stack">
                <div className="simbolos-graficos-pixel-editor-preview-block">
                  <strong>Prévia 1x</strong>
                  <div className="simbolos-graficos-pixel-editor-preview-box">
                    {preview ? <img src={preview} alt="Pré-visualização 1x do símbolo" /> : null}
                  </div>
                </div>
                <div className="simbolos-graficos-pixel-editor-preview-block">
                  <strong>Prévia ampliada</strong>
                  <div className="simbolos-graficos-pixel-editor-preview-box is-expanded">
                    {preview ? <img src={preview} alt="Pré-visualização ampliada do símbolo" /> : null}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </BranaModal>
  );
}
