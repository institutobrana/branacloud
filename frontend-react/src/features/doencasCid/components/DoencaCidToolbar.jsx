import { Input } from 'antd';

export function DoencaCidToolbar({
  hasSelection,
  loading,
  deleting,
  globalSearch,
  onGlobalSearchChange,
  onCreate,
  onEdit,
  onDelete,
  onClose,
}) {
  return (
    <div className="brana-shell-band auxiliary-shell-band doencas-cid-toolbar-band" aria-label="Barra operacional de doenças CID">
      <div className="doencas-cid-shell-toolbar" role="toolbar" aria-label="Ações do módulo doenças CID">
        <div className="doencas-cid-shell-actions">
          <button type="button" className="auxiliary-shell-button primary" onClick={onCreate} disabled={loading}>
            Nova doença...
          </button>
          <button type="button" className="auxiliary-shell-button" onClick={onEdit} disabled={!hasSelection || loading || deleting}>
            Altera...
          </button>
          <button
            type="button"
            className="auxiliary-shell-button danger"
            onClick={onDelete}
            disabled={!hasSelection || loading || deleting}
          >
            Elimina
          </button>
          <span className="materiais-estoque-toolbar-divider" aria-hidden="true" />
          <button type="button" className="auxiliary-shell-button" onClick={onClose} disabled={loading || deleting}>
            Fecha
          </button>
        </div>

        <div className="doencas-cid-shell-search">
          <Input
            allowClear
            value={globalSearch}
            onChange={(event) => onGlobalSearchChange?.(event.target.value)}
            placeholder="Buscar por código ou doença"
            className="doencas-cid-shell-search-input"
          />
        </div>
      </div>
    </div>
  );
}
