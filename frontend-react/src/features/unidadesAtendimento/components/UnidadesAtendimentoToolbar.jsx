export function UnidadesAtendimentoToolbar({
  hasSelection,
  loading,
  onCreate,
  onEdit,
  deleteDisabledReason,
}) {
  return (
    <div className="unidades-atendimento-toolbar-row" role="toolbar" aria-label="Acoes do modulo unidades de atendimento">
      <div className="unidades-atendimento-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" disabled={loading} onClick={onCreate}>
          Nova unidade...
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!hasSelection || loading} onClick={onEdit}>
          Altera...
        </button>
        <button
          type="button"
          className="auxiliary-shell-button danger"
          disabled
          title={deleteDisabledReason}
          aria-disabled="true"
        >
          Elimina
        </button>
      </div>
      <div className="unidades-atendimento-toolbar-note" aria-live="polite">
        {deleteDisabledReason}
      </div>
    </div>
  );
}
