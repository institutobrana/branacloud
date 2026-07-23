import { Input } from 'antd';

export function BillingToolbarContent({
  searchDraft,
  onSearchChange,
  refreshing,
  onRefresh,
  exportDisabled,
  onExportCsv,
  detailsDisabled,
  onViewDetails,
  accountDisabled,
  onViewAccount,
}) {
  return (
    <div className="admin-billing-toolbar" role="toolbar" aria-label="Controles de leitura de cobranças">
      <div className="materiais-estoque-toolbar-actions admin-billing-toolbar-actions">
        <button
          type="button"
          className="auxiliary-shell-button primary"
          disabled={refreshing}
          aria-busy={refreshing}
          onClick={() => {
            if (!refreshing) onRefresh?.();
          }}
        >
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          disabled={exportDisabled}
          onClick={() => {
            if (!exportDisabled) onExportCsv?.();
          }}
        >
          Exportar CSV
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          disabled={detailsDisabled}
          onClick={() => {
            if (!detailsDisabled) onViewDetails?.();
          }}
        >
          Ver detalhes
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          disabled={accountDisabled}
          onClick={() => {
            if (!accountDisabled) onViewAccount?.();
          }}
        >
          Ver conta
        </button>
      </div>

      <div className="admin-billing-toolbar-search">
        <Input.Search
          allowClear
          size="small"
          value={searchDraft}
          placeholder="Buscar cobrança"
          aria-label="Buscar cobrança"
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
      </div>
    </div>
  );
}
