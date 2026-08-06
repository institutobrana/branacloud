function renderText(value) {
  const text = String(value ?? '').trim();
  return text || '—';
}

function renderSpeciality(value) {
  const text = String(value ?? '').trim();
  return text || '—';
}

export const SIMBOLOS_GRAFICOS_COLUMNS = [
  {
    key: 'nome',
    label: 'Nome',
    width: 300,
    align: 'left',
    render: (row) => renderText(row?.nome),
  },
  {
    key: 'especialidade',
    label: 'Especialidade',
    width: 180,
    align: 'left',
    render: (row) => renderSpeciality(row?.especialidade),
  },
];

export function getSimbolosGraficosTableColumns() {
  return SIMBOLOS_GRAFICOS_COLUMNS.map((column) => ({
    key: column.key,
    title: column.label,
    dataIndex: column.key,
    width: column.width,
    align: column.align,
    render: (_, record) => column.render(record),
  }));
}
