export const AGENDA_FONTE_FAMILIES = [
  'MS Sans Serif',
  'MS Serif',
  'Arial',
  'Tahoma',
  'Verdana',
  'Times New Roman',
  'Courier New',
  'Segoe UI',
];

export const AGENDA_FONTE_STYLE_OPTIONS = [
  { value: 'Regular', label: 'Regular', bold: false, italic: false },
  { value: 'Oblíquo', label: 'Oblíquo', bold: false, italic: true },
  { value: 'Negrito', label: 'Negrito', bold: true, italic: false },
  { value: 'Oblíquo e negrito', label: 'Oblíquo e negrito', bold: true, italic: true },
];

export const AGENDA_FONTE_SIZE_OPTIONS = [
  8,
  9,
  10,
  11,
  12,
  ...Array.from({ length: 31 }, (_, index) => 14 + index * 2),
];

export const AGENDA_FONTE_SCRIPT_OPTIONS = [
  { value: 'Ocidental', label: 'Ocidental' },
];

export const AGENDA_FONTE_COLOR_OPTIONS = [
  { value: '#000000', label: 'Preto' },
  { value: '#800000', label: 'Bordo' },
  { value: '#008000', label: 'Verde' },
  { value: '#808000', label: 'Verde-oliva' },
  { value: '#000080', label: 'Azul-marinho' },
  { value: '#800080', label: 'Roxo' },
  { value: '#008080', label: 'Azul-petroleo' },
  { value: '#808080', label: 'Cinza' },
  { value: '#c0c0c0', label: 'Prateado' },
  { value: '#ff0000', label: 'Vermelho' },
  { value: '#00ff00', label: 'Verde-limao' },
  { value: '#ffff00', label: 'Amarelo' },
  { value: '#0000ff', label: 'Azul' },
  { value: '#ff00ff', label: 'Fucsia' },
  { value: '#00ffff', label: 'Azul-piscina' },
  { value: '#ffffff', label: 'Branco' },
];

export const AGENDA_FONTE_COLOR_BY_VALUE = AGENDA_FONTE_COLOR_OPTIONS.reduce((acc, item) => {
  acc[String(item.value || '').toLowerCase()] = item;
  return acc;
}, {});

export const AGENDA_FONTE_DEFAULTS = {
  family: 'MS Sans Serif',
  bold: false,
  italic: false,
  size: 8,
  strike: false,
  underline: false,
  color: '#000000',
  script: 'Ocidental',
};

export function normalizeAgendaFonteValue(value) {
  const source = value && typeof value === 'object' ? value : {};
  const family = String(source.family || AGENDA_FONTE_DEFAULTS.family).trim() || AGENDA_FONTE_DEFAULTS.family;
  const size = Number(source.size || AGENDA_FONTE_DEFAULTS.size) || AGENDA_FONTE_DEFAULTS.size;
  const color = String(source.color || AGENDA_FONTE_DEFAULTS.color).trim().toLowerCase() || AGENDA_FONTE_DEFAULTS.color;
  const script = String(source.script || AGENDA_FONTE_DEFAULTS.script).trim() || AGENDA_FONTE_DEFAULTS.script;
  const styleOption = getAgendaFonteStyleOption(source);
  return {
    family,
    bold: styleOption.bold,
    italic: styleOption.italic,
    size,
    strike: Boolean(source.strike),
    underline: Boolean(source.underline),
    color,
    script,
  };
}

export function getAgendaFonteStyleOption(value) {
  const source = value && typeof value === 'object' ? value : {};
  const directLabel = String(source.style || source.styleLabel || source.styleId || '').trim().toLowerCase();
  if (source.bold && source.italic) {
    return AGENDA_FONTE_STYLE_OPTIONS[3];
  }
  if (source.bold) {
    return AGENDA_FONTE_STYLE_OPTIONS[2];
  }
  if (source.italic) {
    return AGENDA_FONTE_STYLE_OPTIONS[1];
  }
  return (
    AGENDA_FONTE_STYLE_OPTIONS.find((item) => String(item.value || '').toLowerCase() === directLabel) ||
    AGENDA_FONTE_STYLE_OPTIONS[0]
  );
}

export function getAgendaFonteColor(value) {
  return AGENDA_FONTE_COLOR_BY_VALUE[String(value || '').toLowerCase()] || AGENDA_FONTE_COLOR_OPTIONS[0];
}

export function getAgendaFonteStyleLabel(value) {
  return getAgendaFonteStyleOption(value).label;
}

export function buildAgendaFontePreviewStyle(value) {
  const fonte = normalizeAgendaFonteValue(value);
  const styleOption = getAgendaFonteStyleOption(fonte);
  return {
    fontFamily: fonte.family,
    fontSize: `${fonte.size}px`,
    fontWeight: styleOption.bold ? '700' : '400',
    fontStyle: styleOption.italic ? 'italic' : 'normal',
    color: fonte.color,
    textDecoration: [fonte.underline ? 'underline' : '', fonte.strike ? 'line-through' : '']
      .filter(Boolean)
      .join(' ') || 'none',
  };
}
