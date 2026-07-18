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
    <div className="prestadores-toolbar-row" role="toolbar" aria-label="Ações do módulo corpo clínico">
      <div className="prestadores-toolbar-actions">
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

      <div className="prestadores-toolbar-filters">
        <Select
          value={especialidade}
          onChange={onEspecialidadeChange}
          className="prestadores-toolbar-select"
          placeholder="Especialidade"
          options={[{ value: '', label: 'Todas as especialidades' }, ...PRESTADORES_ESPECIALIDADES]}
        />
        <Input.Search
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Buscar por nome ou código"
          allowClear
          className="prestadores-toolbar-search"
        />
      </div>
    </div>
  );
}

