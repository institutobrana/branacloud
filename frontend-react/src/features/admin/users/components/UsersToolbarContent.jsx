import { Input } from 'antd';

export function UsersToolbarContent({
  searchDraft,
  onSearchChange,
  refreshing,
  onRefresh,
  exporting,
  onExportCsv,
  detailsDisabled,
  onViewDetails,
  accountDisabled,
  onViewAccount,
}) {
  return (
    <div className="admin-users-toolbar" role="toolbar" aria-label="Controles de leitura de usuários">
      <div className="materiais-estoque-toolbar-actions admin-users-toolbar-actions">
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
          disabled={exporting}
          aria-busy={exporting}
          onClick={() => {
            if (!exporting) onExportCsv?.();
          }}
        >
          {exporting ? 'Exportando...' : 'Exportar CSV'}
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

      <div className="admin-users-toolbar-search">
        <Input.Search
          size="small"
          allowClear
          placeholder="Buscar usuário"
          aria-label="Buscar usuário"
          value={searchDraft}
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
      </div>
    </div>
  );
}
