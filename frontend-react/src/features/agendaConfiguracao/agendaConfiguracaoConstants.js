export const AGENDA_CONFIGURACAO_TITLE = 'Configura horários de agendamento';

export const AGENDA_CONFIGURACAO_TABS = [
  { key: 'escala', label: 'Escala' },
  { key: 'bloqueios', label: 'Bloqueios' },
  { key: 'apresentacao', label: 'Apresentação' },
  { key: 'visualizacao', label: 'Visualização' },
];

export function buildAgendaConfiguracaoContext({
  source = 'prestadores',
  prestadorId = null,
  allowPrestadorChange = false,
  selectedPrestadorSnapshot = null,
} = {}) {
  return {
    source,
    prestadorId: prestadorId == null ? null : Number(prestadorId),
    allowPrestadorChange: Boolean(allowPrestadorChange),
    selectedPrestadorSnapshot: selectedPrestadorSnapshot || null,
  };
}
