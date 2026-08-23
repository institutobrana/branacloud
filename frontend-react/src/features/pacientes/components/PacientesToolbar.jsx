import { Button, Input, Select, Space, Typography } from 'antd';
import { LeftOutlined, RightOutlined, SearchOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';

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
  onNavigate,
}) {
  const cirurgiaoOptions = [
    { value: 0, label: '<<Todos>>' },
    ...(optionSets?.cirurgioes || []).map((item) => ({ value: Number(item.id || 0) || 0, label: optionLabel(item) })),
  ];

  const statusOptions = (optionSets?.filtro_status || []).map((item) => ({ value: Number(item.id || 0) || 0, label: optionLabel(item) }));
  const visualizacaoOptions = (optionSets?.visualizacao || []).map((item) => ({ value: Number(item.id || 0) || 0, label: optionLabel(item) }));
  const pesquisaOptions = (optionSets?.pesquisa || []).map((item) => ({ value: Number(item.id || 0) || 0, label: optionLabel(item) }));

  return (
    <div className="pacientes-toolbar" role="toolbar" aria-label="Barra operacional de pacientes">
      <div className="pacientes-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" disabled>
          Novo cadastro
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!hasSelection || loading}>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled>
          Elimina
        </button>
        <Button icon={<VerticalAlignBottomOutlined />} disabled>
          Imprime
        </Button>
        <Button icon={<LeftOutlined />} disabled={loading} onClick={() => onNavigate?.('first')}>
          |&lt;
        </Button>
        <Button icon={<LeftOutlined />} disabled={loading || !hasSelection} onClick={() => onNavigate?.('prev')}>
          &lt;
        </Button>
        <Button icon={<RightOutlined />} disabled={loading || !hasSelection} onClick={() => onNavigate?.('next')}>
          &gt;
        </Button>
        <Button icon={<RightOutlined />} disabled={loading} onClick={() => onNavigate?.('last')}>
          &gt;|
        </Button>
        <button type="button" className="auxiliary-shell-button" disabled>
          Odontograma
        </button>
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
          />
        </label>

        <label className="pacientes-toolbar-field pacientes-toolbar-search">
          <Typography.Text className="pacientes-toolbar-label">Pesquisar nome do paciente</Typography.Text>
          <Space.Compact block>
            <Input
              allowClear
              value={queryDraft}
              prefix={<SearchOutlined />}
              placeholder="Digite nome, número ou %sobrenome"
              onChange={(event) => onSearchChange?.(event.target.value)}
              onPressEnter={(event) => onSearchApply?.(event.target.value)}
            />
            <Button type="primary" onClick={() => onSearchApply?.(queryDraft)}>
              Buscar
            </Button>
          </Space.Compact>
        </label>
      </div>
    </div>
  );
}
