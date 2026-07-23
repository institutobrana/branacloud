import { Input } from 'antd';

export function AuditToolbarContent({ searchDraft, onSearchChange, refreshing, onRefresh, exportDisabled, onExportCsv, detailsDisabled, onViewDetails }) {
  return (
    <div className="admin-audit-toolbar" role="toolbar" aria-label="Controles de leitura de auditoria">
      <div className="materiais-estoque-toolbar-actions admin-audit-toolbar-actions">
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
      </div>

      <div className="admin-audit-toolbar-search">
        <Input.Search
          allowClear
          size="small"
          value={searchDraft}
          placeholder="Buscar evento"
          aria-label="Buscar evento"
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
      </div>
    </div>
  );
}
