import { Input, Select } from 'antd';

const groupOptions = [{ label: 'Todos', value: '' }];

export function MedicamentosToolbar({
  group,
  groups,
  name,
  onGroupChange,
  onNameChange,
  loadingGroups = false,
}) {
  const options = [
    { label: 'Todos', value: '' },
    ...groups.map((item) => ({
      label: item?.descricao || item?.codigo || '',
      value: item?.descricao || item?.codigo || '',
    })).filter((item) => item.value),
  ];

  return (
    <div className="medicamentos-toolbar-row" role="toolbar" aria-label="Acoes do modulo medicamentos">
      <div className="medicamentos-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" disabled>
          Novo medicamento
        </button>
        <button type="button" className="auxiliary-shell-button" disabled>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled>
          Elimina
        </button>
      </div>

      <div className="medicamentos-toolbar-filters">
        <label className="medicamentos-field">
          <Select
            value={group || undefined}
            options={options.length ? options : groupOptions}
            placeholder="Todos"
            size="small"
            loading={loadingGroups}
            onChange={(value) => onGroupChange?.(value || '')}
            aria-label="Grupo"
          />
        </label>

        <label className="medicamentos-field grow">
          <Input.Search
            allowClear
            value={name}
            placeholder="Pesquisar por nome"
            size="small"
            aria-label="Pesquisa por nome"
            onChange={(event) => onNameChange?.(event.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
