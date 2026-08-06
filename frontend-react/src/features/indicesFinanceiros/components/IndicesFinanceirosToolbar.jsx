export function IndicesFinanceirosToolbar({
  onNewIndex,
  onEditIndex,
  onDeleteIndex,
  onNewQuotation,
  onEditQuotation,
  onDeleteQuotation,
  disabled = false,
  canEditIndex = false,
  canDeleteIndex = false,
  canCreateQuotation = false,
  canEditQuotation = false,
  canDeleteQuotation = false,
}) {
  return (
    <div className="indices-financeiros-toolbar" role="toolbar" aria-label="Ações do módulo índices financeiros">
      <div className="indices-financeiros-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" disabled={disabled} onClick={onNewIndex}>
          Novo índice
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!canEditIndex || disabled} onClick={onEditIndex}>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled={!canDeleteIndex || disabled} onClick={onDeleteIndex}>
          Elimina
        </button>
        <span className="indices-financeiros-toolbar-divider" aria-hidden="true" />
        <button type="button" className="auxiliary-shell-button" disabled={!canCreateQuotation || disabled} onClick={onNewQuotation}>
          Novo valor
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!canEditQuotation || disabled} onClick={onEditQuotation}>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled={!canDeleteQuotation || disabled} onClick={onDeleteQuotation}>
          Elimina
        </button>
      </div>
    </div>
  );
}
