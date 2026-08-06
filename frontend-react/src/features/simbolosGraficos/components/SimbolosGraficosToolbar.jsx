export function SimbolosGraficosToolbar({ hasSelection = false, onNovo, onAltera, onElimina } = {}) {
  return (
    <div className="simbolos-graficos-toolbar" role="toolbar" aria-label="Acoes do modulo simbolos graficos">
      <div className="simbolos-graficos-toolbar-actions">
        <button
          type="button"
          className="auxiliary-shell-button primary"
          onClick={() => {
            onNovo?.();
          }}
        >
          Novo
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!hasSelection} onClick={() => onAltera?.()}>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled={!hasSelection} onClick={() => onElimina?.()}>
          Elimina
        </button>
      </div>
    </div>
  );
}
