import { Input, Select } from 'antd';
import './prestadores.css';

const PRESTADORES_FILTER_DEBUG = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

export function PrestadoresToolbar({
  especialidade,
  searchValue,
  especialidades = [],
  onEspecialidadeChange,
  onSearchChange,
  onNovoPrestador,
  onAltera,
  onElimina,
  onAgenda,
  onConvenios,
  onComissoes,
  hasSelection = false,
}) {
  const canRunSelectionActions = Boolean(hasSelection);
  const normalizeEspecialidadeOption = (item) => {
    if (typeof item === 'string') {
      return { value: item, label: item };
    }
    const value = String(item?.value ?? item?.codigo ?? item?.nome ?? '').trim();
    const label = String(item?.label ?? item?.nome ?? item?.descricao ?? item?.codigo ?? value).trim();
    return value || label ? { value: value || label, label: label || value } : null;
  };
  const especialidadeOptions = [
    { value: '', label: 'Todas as especialidades' },
    ...especialidades.map(normalizeEspecialidadeOption).filter(Boolean),
  ];

  if (PRESTADORES_FILTER_DEBUG) {
    // TEMP DEBUG — remover após diagnóstico do filtro de Prestadores
    console.info('[PRESTADORES_FILTER_DEBUG] TOOLBAR_RENDER', {
      searchValue: String(searchValue ?? ''),
      especialidade: String(especialidade ?? ''),
    });
  }

  return (
    <div className="servicos-protetico-toolbar-row prestadores-toolbar-row" role="toolbar" aria-label="Ações do módulo corpo clínico">
      <div className="materiais-estoque-toolbar-actions servicos-protetico-toolbar-actions prestadores-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" onClick={onNovoPrestador}>
          Novo prestador
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!canRunSelectionActions} onClick={onAltera}>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled={!canRunSelectionActions} onClick={onElimina}>
          Elimina
        </button>
        <span className="prestadores-toolbar-divider" aria-hidden="true" />
        <button type="button" className="auxiliary-shell-button" disabled={!canRunSelectionActions || !onAgenda} onClick={onAgenda}>
          Agenda
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!canRunSelectionActions} onClick={onConvenios}>
          Convênios
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!canRunSelectionActions} onClick={onComissoes}>
          Comissões
        </button>
        <span className="prestadores-toolbar-divider" aria-hidden="true" />
      </div>

      <div className="materiais-estoque-toolbar-filters servicos-protetico-toolbar-filters prestadores-toolbar-filters">
        <label className="materiais-estoque-field servicos-protetico-field prestadores-toolbar-field">
          <span className="prestadores-toolbar-label">Especialidade</span>
          <Select
            value={especialidade}
            onChange={(value, option) => {
              if (PRESTADORES_FILTER_DEBUG) {
                // TEMP DEBUG — remover após diagnóstico do filtro de Prestadores
                console.info('[PRESTADORES_FILTER_DEBUG] SPECIALTY_INPUT', {
                  value,
                  optionValue: option?.value,
                  optionLabel: option?.label,
                });
              }
              onEspecialidadeChange?.(value, option);
            }}
            className="prestadores-toolbar-select"
            placeholder="Especialidade"
            options={especialidadeOptions}
            showSearch
            optionFilterProp="label"
            allowClear={false}
          />
        </label>
        <label className="materiais-estoque-field grow servicos-protetico-field prestadores-toolbar-field">
          <Input.Search
            value={searchValue}
            onChange={(event) => {
              if (PRESTADORES_FILTER_DEBUG) {
                // TEMP DEBUG — remover após diagnóstico do filtro de Prestadores
                console.info('[PRESTADORES_FILTER_DEBUG] TOOLBAR_INPUT', {
                  value: event.target.value,
                  type: 'change',
                });
              }
              onSearchChange?.(event.target.value);
            }}
            onInput={(event) => {
              if (PRESTADORES_FILTER_DEBUG) {
                // TEMP DEBUG — remover após diagnóstico do filtro de Prestadores
                console.info('[PRESTADORES_FILTER_DEBUG] TOOLBAR_INPUT', {
                  value: event.currentTarget.value,
                  type: 'input',
                });
              }
              onSearchChange?.(event.currentTarget.value);
            }}
            onSearch={(value) => {
              if (PRESTADORES_FILTER_DEBUG) {
                // TEMP DEBUG — remover após diagnóstico do filtro de Prestadores
                console.info('[PRESTADORES_FILTER_DEBUG] TOOLBAR_INPUT', {
                  value: String(value ?? ''),
                  type: 'search',
                });
              }
              onSearchChange?.(String(value ?? ''));
            }}
            placeholder="Buscar por nome ou código"
            allowClear
            className="prestadores-toolbar-search"
          />
        </label>
      </div>
    </div>
  );
}
