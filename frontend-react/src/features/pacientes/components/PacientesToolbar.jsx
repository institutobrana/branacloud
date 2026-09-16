import { Button, Input, Select, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

function optionLabel(item) {
  return item?.label || item?.name || item?.titulo || String(item?.id ?? '');
}

export function PacientesToolbar({
  loading,
  preferences,
  optionSets,
  queryDraft,
  hasSelection,
  onPreferenceChange,
  onSearchChange,
  onSearchApply,
  onNew,
  onEdit,
}) {
  const [localQuery, setLocalQuery] = useState(queryDraft || '');

  useEffect(() => {
    setLocalQuery(queryDraft || '');
  }, [queryDraft]);

  const cirurgiaoOptions = (optionSets?.cirurgioes?.length
    ? optionSets.cirurgioes
    : [{ id: 0, label: '<<Todos>>' }]
  ).map((item) => ({ value: Number(item.id || 0) || 0, label: optionLabel(item) }));

  const statusOptions = (optionSets?.filtro_status || []).map((item) => ({ value: Number(item.id || 0) || 0, label: optionLabel(item) }));
  const visualizacaoOptions = (optionSets?.visualizacao || []).map((item) => ({ value: Number(item.id || 0) || 0, label: optionLabel(item) }));
  const pesquisaOptions = (optionSets?.pesquisa || []).map((item) => ({ value: Number(item.id || 0) || 0, label: optionLabel(item) }));

  return (
    <div className="pacientes-toolbar" role="toolbar" aria-label="Barra operacional de pacientes">
      <div className="pacientes-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" onClick={onNew}>
          Novo cadastro
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!hasSelection || loading} onClick={onEdit}>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled>
          Elimina
        </button>
        <span className="materiais-estoque-toolbar-divider" aria-hidden="true" />
      </div>

      <div className="pacientes-toolbar-filters">
        <label className="pacientes-toolbar-field">
          <Typography.Text className="pacientes-toolbar-label">Cirurgião</Typography.Text>
          <Select
            value={preferences?.cir_menu_pac ?? 0}
            options={cirurgiaoOptions}
            onChange={(value) => onPreferenceChange?.('cir_menu_pac', value)}
            loading={loading}
            size="small"
            popupClassName="pacientes-toolbar-select-dropdown"
            popupMatchSelectWidth={false}
            showSearch
            optionFilterProp="label"
          />
        </label>

        <label className="pacientes-toolbar-field">
          <Typography.Text className="pacientes-toolbar-label">Filtro</Typography.Text>
          <Select
            value={preferences?.status_menu_pac ?? 0}
            options={statusOptions}
            onChange={(value) => onPreferenceChange?.('status_menu_pac', value)}
            loading={loading}
            size="small"
            popupClassName="pacientes-toolbar-select-dropdown"
            popupMatchSelectWidth={false}
            showSearch
            optionFilterProp="label"
          />
        </label>

        <label className="pacientes-toolbar-field">
          <Typography.Text className="pacientes-toolbar-label">Visualização</Typography.Text>
          <Select
            value={preferences?.visualizacao_menu_pac ?? 1}
            options={visualizacaoOptions}
            onChange={(value) => onPreferenceChange?.('visualizacao_menu_pac', value)}
            loading={loading}
            size="small"
            popupClassName="pacientes-toolbar-select-dropdown"
            popupMatchSelectWidth={false}
            showSearch
            optionFilterProp="label"
          />
        </label>

        <label className="pacientes-toolbar-field">
          <Typography.Text className="pacientes-toolbar-label">Pesquisar</Typography.Text>
          <Select
            value={preferences?.pesquisa_menu_pac ?? 1}
            options={pesquisaOptions}
            onChange={(value) => onPreferenceChange?.('pesquisa_menu_pac', value)}
            loading={loading}
            size="small"
            popupClassName="pacientes-toolbar-select-dropdown"
            popupMatchSelectWidth={false}
          />
        </label>

        <label className="pacientes-toolbar-field pacientes-toolbar-search">
          <Typography.Text className="pacientes-toolbar-label">Pesquisar nome</Typography.Text>
          <Space.Compact block>
            <Input
              allowClear
              value={localQuery}
              prefix={<SearchOutlined />}
              placeholder="Digite nome, número ou sobrenome"
              onChange={(event) => setLocalQuery(event.target.value)}
              onPressEnter={() => onSearchApply?.(localQuery)}
            />
            <Button type="primary" onClick={() => onSearchApply?.(localQuery)}>
              Buscar
            </Button>
          </Space.Compact>
        </label>
      </div>
    </div>
  );
}
