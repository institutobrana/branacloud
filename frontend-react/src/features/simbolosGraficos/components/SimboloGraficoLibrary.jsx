import { Alert, Spin, Typography } from 'antd';
import { useMemo, useState } from 'react';

function LibraryThumb({ item, selected, onClick }) {
  const [failed, setFailed] = useState(false);
  const hasImage = String(item?.imageUrl || '').trim() !== '';
  const label = item?.imageAlt || item?.nome || item?.code || item?.codigo || 'Símbolo-base';

  return (
    <button
      type="button"
      className={`simbolos-graficos-library-item ${selected ? 'is-selected' : ''}`.trim()}
      aria-selected={selected}
      aria-pressed={selected}
      role="option"
      aria-label={label}
      onClick={!hasImage ? undefined : onClick}
      disabled={!hasImage}
      title={label}
    >
      {hasImage && !failed ? (
        <img className="simbolos-graficos-library-thumb" src={item.imageUrl} alt={label} onError={() => setFailed(true)} />
      ) : null}
      {(!hasImage || failed) ? <span className="simbolos-graficos-library-placeholder" aria-hidden="true"> </span> : null}
    </button>
  );
}

export function SimboloGraficoLibrary({ items = [], selectedId = null, loading = false, error = '', empty = false, onSelect }) {
  return (
    <div className="simbolos-graficos-library-field">
      <div className="simbolos-graficos-library-header">
        <span className="simbolos-graficos-create-right-title">Biblioteca-base do editor:</span>
      </div>

      {loading ? (
        <div className="simbolos-graficos-library-state" role="status" aria-live="polite">
          <Spin size="small" />
          <Typography.Text type="secondary">Carregando biblioteca...</Typography.Text>
        </div>
      ) : null}

      {!loading && error ? <Alert type="error" showIcon message="Não foi possível carregar a biblioteca." description={error} /> : null}
      {!loading && !error && empty ? <Alert type="info" showIcon message="Nenhum símbolo disponível." /> : null}

      {!loading && !error && !empty ? (
        <div className="simbolos-graficos-library-scroll" role="listbox" aria-label="Biblioteca-base de símbolos gráficos">
          <div className="simbolos-graficos-library-grid">
            {items.map((item) => {
              const itemKey = item?.id || item?.code || item?.codigo || '';
              const selected = String(selectedId || '') === String(itemKey);
              return <LibraryThumb key={String(itemKey)} item={item} selected={selected} onClick={() => onSelect?.(item)} />;
            })}
          </div>
        </div>
      ) : null}

      <style>{`
        .simbolos-graficos-library-field { display: grid; gap: 6px; }
        .simbolos-graficos-library-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .simbolos-graficos-library-state { display: flex; align-items: center; gap: 8px; min-height: 36px; }
        .simbolos-graficos-library-scroll { border: 1px solid var(--brana-border-subtle); background: var(--brana-surface-card); min-height: 118px; max-height: 162px; overflow-y: auto; padding: 6px; }
        .simbolos-graficos-library-grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 3px; }
        .simbolos-graficos-library-item { width: 100%; aspect-ratio: 1 / 1; border: 1px solid var(--brana-border-subtle); background: var(--brana-surface-card); padding: 1px; display: grid; place-items: center; cursor: pointer; overflow: hidden; color: var(--brana-text-primary); }
        .simbolos-graficos-library-item:disabled { cursor: not-allowed; opacity: 0.72; }
        .simbolos-graficos-library-item.is-selected { outline: 2px solid var(--brana-brand-primary); outline-offset: -2px; background: var(--brana-surface-table-row-selected); }
        .simbolos-graficos-library-thumb { width: 100%; height: 100%; object-fit: contain; display: block; position: absolute; inset: 0; }
        .simbolos-graficos-library-item { position: relative; }
        .simbolos-graficos-library-placeholder { width: 100%; height: 100%; display: grid; place-items: center; background: linear-gradient(135deg, var(--brana-surface-panel), var(--brana-surface-disabled)); color: transparent; font-size: 0; text-align: center; padding: 2px; }
        [data-brana-theme='dark'] .simbolos-graficos-library-scroll,
        [data-brana-theme='dark'] .simbolos-graficos-library-item,
        [data-brana-theme='dark'] .simbolos-graficos-library-placeholder {
          background: var(--brana-surface-panel);
          color: var(--brana-text-primary);
          border-color: var(--brana-border-subtle);
        }
        [data-brana-theme='dark'] .simbolos-graficos-library-item.is-selected {
          background: var(--brana-surface-table-row-selected);
        }
        [data-brana-theme='dark'] .simbolos-graficos-library-item:disabled {
          background: var(--brana-surface-disabled);
          color: var(--brana-text-secondary);
        }
      `}</style>
    </div>
  );
}
