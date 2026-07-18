import { Input, Select } from 'antd';

import { PRESTADORES_ESPECIALIDADES } from './prestadoresConstants.js';

export function PrestadoresToolbar({
  especialidade,
  searchValue,
  onEspecialidadeChange,
  onSearchChange,
}) {
  const hasSelection = false;
  const canRunSelectionActions = Boolean(hasSelection);

  return (
    <div className="servicos-protetico-toolbar-row prestadores-toolbar-row" role="toolbar" aria-label="Ações do módulo corpo clínico">
      <div className="materiais-estoque-toolbar-actions servicos-protetico-toolbar-actions prestadores-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" disabled>
          Novo prestador
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!canRunSelectionActions}>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled={!canRunSelectionActions}>
          Elimina
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!canRunSelectionActions}>
          Agenda
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!canRunSelectionActions}>
          Convênios
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!canRunSelectionActions}>
          Comissões
        </button>
      </div>

      <div className="materiais-estoque-toolbar-filters servicos-protetico-toolbar-filters prestadores-toolbar-filters">
        <label className="materiais-estoque-field servicos-protetico-field prestadores-toolbar-field">
          <span className="prestadores-toolbar-label">Especialidade</span>
          <Select
            value={especialidade}
            onChange={onEspecialidadeChange}
            className="prestadores-toolbar-select"
            placeholder="Especialidade"
            options={[{ value: '', label: 'Todas as especialidades' }, ...PRESTADORES_ESPECIALIDADES]}
          />
        </label>
        <label className="materiais-estoque-field grow servicos-protetico-field prestadores-toolbar-field">
          <Input.Search
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Buscar por nome ou código"
            allowClear
            className="prestadores-toolbar-search"
          />
        </label>
      </div>
    </div>
  );
}
