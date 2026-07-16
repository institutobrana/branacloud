import { ProteticoSelect } from './ProteticoSelect.jsx';

export function ServicosProteticoToolbar({
  proteticoId,
  proteticos,
  loading,
  selectionDisabled = false,
  onProteticoChange,
  onNovoServico,
}) {
  const options = proteticos.map((item) => ({
    value: item.id,
    label: item.nome || `Protético ${item.id}`,
  }));

  const canCreate = Boolean(proteticoId) && !loading;

  return (
    <div className="servicos-protetico-toolbar-row" role="toolbar" aria-label="Ações do módulo serviços de protético">
      <div className="materiais-estoque-toolbar-actions servicos-protetico-toolbar-actions">
        <button
          type="button"
          className="auxiliary-shell-button primary"
          disabled={!canCreate}
          onClick={() => {
            if (!canCreate) return;
            window.dispatchEvent(new CustomEvent('brana-servicos-protetico-toolbar-action', { detail: { action: 'novo-servico' } }));
            onNovoServico?.();
          }}
        >
          Novo serviço...
        </button>
        <button type="button" className="auxiliary-shell-button" disabled>
          Altera...
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled>
          Elimina
        </button>
        <button type="button" className="auxiliary-shell-button" disabled>
          Imprime...
        </button>
      </div>

      <div className="materiais-estoque-toolbar-filters servicos-protetico-toolbar-filters">
        <ProteticoSelect
          value={proteticoId}
          options={options}
          loading={loading}
          disabled={selectionDisabled}
          onChange={onProteticoChange}
        />
      </div>
    </div>
  );
}
