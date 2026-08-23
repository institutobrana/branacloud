import { PrestadoresTable } from './PrestadoresTable.jsx';

export function PrestadoresPage({ items, loading, error, selectedId, onSelect, onDoubleClick, footerLabel }) {
  const prestadoresFilterDebug = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
  if (prestadoresFilterDebug) {
    // TEMP DEBUG — remover após diagnóstico do filtro de Prestadores
    console.info('[PRESTADORES_FILTER_DEBUG] PAGE_TO_TABLE', {
      itemsCount: Array.isArray(items) ? items.length : 0,
      codes: Array.isArray(items) ? items.map((item) => String(item?.codigo ?? '').trim()) : [],
    });
  }
  return (
    <div className="prestadores-page servicos-protetico-page">
      <PrestadoresTable
        items={items}
        loading={loading}
        error={error}
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClick={onDoubleClick}
        footerLabel={footerLabel}
      />
    </div>
  );
}
