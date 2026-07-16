import { useEffect, useState } from 'react';

import { ProteticoSelect } from './ProteticoSelect.jsx';

export function ServicosProteticoToolbar({
  proteticoId,
  proteticos,
  loading,
  hasSelection = false,
  selectionDisabled = false,
  onProteticoChange,
  onNovoServico,
  onAlteraServico,
  onEliminaServico,
  onImprimeServico,
}) {
  const [localHasSelection, setLocalHasSelection] = useState(Boolean(hasSelection));
  const [localModalOpen, setLocalModalOpen] = useState(false);

  useEffect(() => {
    const onState = (event) => {
      const detail = event?.detail || {};
      if (typeof detail.hasSelection === 'boolean') {
        setLocalHasSelection(detail.hasSelection);
      }
    };
    const onUiState = (event) => {
      const detail = event?.detail || {};
      if (typeof detail.modalOpen === 'boolean') {
        setLocalModalOpen(detail.modalOpen);
      }
    };

    window.addEventListener('brana-servicos-protetico-state', onState);
    window.addEventListener('brana-servicos-protetico-ui-state', onUiState);
    return () => {
      window.removeEventListener('brana-servicos-protetico-state', onState);
      window.removeEventListener('brana-servicos-protetico-ui-state', onUiState);
    };
  }, []);

  const resolvedHasSelection = Boolean(hasSelection || localHasSelection);
  const resolvedSelectionDisabled = Boolean(selectionDisabled || localModalOpen);

  const options = proteticos.map((item) => ({
    value: item.id,
    label: item.nome || `Protético ${item.id}`,
  }));

  const canCreate = Boolean(proteticoId) && !loading;
  const canEdit = Boolean(proteticoId) && resolvedHasSelection && !loading;
  const canDelete = Boolean(proteticoId) && resolvedHasSelection && !loading;
  const canPrint = Boolean(proteticoId) && !loading;

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
          <button
            type="button"
            className="auxiliary-shell-button"
            disabled={!canEdit}
            onClick={() => {
            if (!canEdit) return;
            window.dispatchEvent(new CustomEvent('brana-servicos-protetico-toolbar-action', { detail: { action: 'altera-servico' } }));
            onAlteraServico?.();
          }}
        >
          Altera...
        </button>
        <button
          type="button"
          className="auxiliary-shell-button danger"
          disabled={!canDelete}
          onClick={() => {
            if (!canDelete) return;
            window.dispatchEvent(new CustomEvent('brana-servicos-protetico-toolbar-action', { detail: { action: 'elimina-servico' } }));
            onEliminaServico?.();
          }}
        >
          Elimina
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          disabled={!canPrint}
          onClick={() => {
            if (!canPrint) return;
            window.dispatchEvent(new CustomEvent('brana-servicos-protetico-toolbar-action', { detail: { action: 'imprime-servico' } }));
            onImprimeServico?.();
          }}
        >
          Imprime...
        </button>
      </div>

      <div className="materiais-estoque-toolbar-filters servicos-protetico-toolbar-filters">
        <ProteticoSelect
          value={proteticoId}
          options={options}
          loading={loading}
          disabled={resolvedSelectionDisabled}
          onChange={onProteticoChange}
        />
      </div>
    </div>
  );
}
