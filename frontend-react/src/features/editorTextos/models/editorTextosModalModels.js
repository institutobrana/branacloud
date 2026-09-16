export const OPEN_TYPE_OPTIONS = [
  { value: 'rich', label: 'Arquivo texto rico', extensions: ['.rtf'] },
  { value: 'text', label: 'Arquivo de texto', extensions: ['.txt'] },
  { value: 'model', label: 'Modelos de texto', extensions: ['.mod'] },
  { value: 'all', label: 'Todos (*.*)', extensions: [] },
];

export const NEW_TEXT_TYPES = [
  { value: 'receita', label: 'Receita', type: 'receitas', extension: '.mod', candidates: ['Receita', 'Receita.mod'] },
  { value: 'atestado', label: 'Atestado', type: 'atestados', extension: '.mod', candidates: ['Atestado', 'Atestado.mod'] },
  { value: 'carta_paciente', label: 'Carta para paciente', type: 'outros', extension: '.mod', candidates: ['CartaPaciente', 'CartaPaciente.mod', 'Carta para paciente'] },
  { value: 'carta_simples', label: 'Carta simples', type: 'outros', extension: '.mod', candidates: ['CartaSimples', 'CartaSimples.mod', 'Carta simples'] },
  { value: 'texto_branco', label: 'Texto em branco', type: 'outros', extension: '.txt', candidates: [] },
];

export function normalizeModelName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

export function matchesOpenType(item, type) {
  if (type === 'all') return true;
  const option = OPEN_TYPE_OPTIONS.find((entry) => entry.value === type);
  const extension = String(item?.extensao || item?.nome_arquivo || '').toLowerCase();
  return option?.extensions.some((value) => extension.endsWith(value)) ?? true;
}
