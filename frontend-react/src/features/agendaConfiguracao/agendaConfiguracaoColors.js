export const AGENDA_APRESENTACAO_COLORS = [
  { value: '#ffff00', label: 'Amarelo' },
  { value: '#0000ff', label: 'Azul' },
  { value: '#00e5ef', label: 'Azul água' },
  { value: '#000080', label: 'Azul marinho' },
  { value: '#ffffff', label: 'Branco' },
  { value: '#808080', label: 'Cinza' },
  { value: '#d9d9d9', label: 'Cinza claro' },
  { value: '#666666', label: 'Cinza escuro' },
  { value: '#c61ad9', label: 'Lilás' },
  { value: '#8b4513', label: 'Marrom' },
  { value: '#c0c0c0', label: 'Prata' },
  { value: '#000000', label: 'Preto' },
  { value: '#800080', label: 'Roxo' },
  { value: '#008000', label: 'Verde' },
  { value: '#006400', label: 'Verde escuro' },
  { value: '#00ff00', label: 'Verde limão' },
  { value: '#808000', label: 'Verde oliva' },
  { value: '#ff0000', label: 'Vermelho' },
];

export const AGENDA_APRESENTACAO_COLOR_BY_VALUE = AGENDA_APRESENTACAO_COLORS.reduce((acc, item) => {
  acc[item.value.toLowerCase()] = item;
  return acc;
}, {});

export function getAgendaApresentacaoColor(value) {
  return AGENDA_APRESENTACAO_COLOR_BY_VALUE[String(value || '').toLowerCase()] || AGENDA_APRESENTACAO_COLORS[0];
}
