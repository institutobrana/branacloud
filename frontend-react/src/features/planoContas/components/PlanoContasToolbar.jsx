import { Tooltip } from 'antd';

export function PlanoContasToolbar({
  onClose,
  onNewGroup,
  onEditGroup,
  onNewCategory,
  onEditCategory,
  onDelete,
  canEditGroup = false,
  canCreateCategory = false,
  canEditCategory = false,
  canDelete = false,
  deleteDisabledReason = '',
  deleting = false,
  saving = false,
}) {
  const deleteButton = (
    <button
      type="button"
      className="auxiliary-shell-button danger"
      onClick={onDelete}
      disabled={!canDelete || saving || deleting}
    >
      Eliminar
    </button>
  );

  return (
    <div className="plano-contas-toolbar" role="toolbar" aria-label="Acoes do plano de contas">
      <div className="plano-contas-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" onClick={onNewGroup} disabled={saving}>
          Novo grupo
        </button>
        <button type="button" className="auxiliary-shell-button" onClick={onNewCategory} disabled={!canCreateCategory || saving}>
          Nova categoria
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          onClick={canEditCategory ? onEditCategory : onEditGroup}
          disabled={(!canEditCategory && !canEditGroup) || saving}
        >
          Alterar
        </button>
        {deleteDisabledReason ? (
          <Tooltip title={deleteDisabledReason} placement="bottom">
            <span className="plano-contas-delete-tooltip">{deleteButton}</span>
          </Tooltip>
        ) : (
          deleteButton
        )}
        <span className="plano-contas-toolbar-divider" aria-hidden="true" />
        <button type="button" className="auxiliary-shell-button" onClick={onClose} disabled={saving}>
          Fechar
        </button>
      </div>
    </div>
  );
}
