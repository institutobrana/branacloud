import { ProteticoSelect } from './ProteticoSelect.jsx';

export function ServicosProteticoToolbar({
  proteticoId,
  proteticos,
  loading,
  onProteticoChange,
}) {
  const options = proteticos.map((item) => ({
    value: item.id,
    label: item.nome || `Protético ${item.id}`,
  }));

  return (
    <div className="servicos-protetico-toolbar-row" role="toolbar" aria-label="Ações do módulo serviços de protético">
      <div className="materiais-estoque-toolbar-actions servicos-protetico-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" disabled>
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
          onChange={onProteticoChange}
        />
      </div>
    </div>
  );
}
