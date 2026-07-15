export function PlanoContasToolbar({
  onClose,
  onNewGroup,
  onEditGroup,
  onNewCategory,
  onEditCategory,
  onDeleteCategory,
  canEditGroup = false,
  canCreateCategory = false,
  canEditCategory = false,
  canDelete = false,
  deleting = false,
  saving = false,
}) {
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
        <button
          type="button"
          className="auxiliary-shell-button danger"
          onClick={onDeleteCategory}
          disabled={!canDelete || saving || deleting}
        >
          Eliminar
        </button>
        <span className="plano-contas-toolbar-divider" aria-hidden="true" />
        <button type="button" className="auxiliary-shell-button" onClick={onClose} disabled={saving}>
          Fechar
        </button>
      </div>
    </div>
  );
}
