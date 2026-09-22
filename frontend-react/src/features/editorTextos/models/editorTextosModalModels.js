export const OPEN_TYPE_OPTIONS = [
  { value: 'rich', label: 'Arquivo texto rico', extensions: ['.rtf'] },
  { value: 'text', label: 'Arquivo de texto', extensions: ['.txt'] },
  { value: 'model', label: 'Modelos de texto', extensions: ['.mod'] },
  { value: 'all', label: 'Todos (*.*)', extensions: [] },
];

export const NEW_TEXT_TYPES = [
  { value: 'receita', label: 'Receita', code: 'receita', type: 'receitas', extension: '.mod', candidates: ['Receita', 'Receita.mod'] },
  { value: 'atestado', label: 'Atestado', code: 'atestado', type: 'atestados', extension: '.mod', candidates: ['Atestado', 'Atestado.mod'] },
  { value: 'carta_paciente', label: 'Carta para paciente', code: 'carta_paciente', type: 'outros', extension: '.mod', candidates: ['CartaPaciente', 'CartaPaciente.mod', 'Carta para paciente'] },
  { value: 'carta_simples', label: 'Carta simples', code: 'carta_simples', type: 'outros', extension: '.mod', candidates: ['CartaSimples', 'CartaSimples.mod', 'Carta simples'] },
  { value: 'texto_branco', label: 'Texto em branco', code: 'texto_branco', type: 'outros', extension: '.txt', candidates: [] },
];

export function getNewTextType(value) {
  return NEW_TEXT_TYPES.find((item) => item.value === value) || null;
}

export function findNewTextTemplate(items, type) {
  if (!type?.candidates?.length) return null;
  return (Array.isArray(items) ? items : [])
    .filter((item) => String(item?.tipo_modelo || '').trim().toLowerCase() === type.type)
    .filter((item) => type.candidates.some((candidate) => normalizeModelName(candidate) === normalizeModelName(item?.nome || item?.nome_arquivo)))
    .sort((a, b) => Number(Boolean(b?.sistema)) - Number(Boolean(a?.sistema)) || Number(a?.id || 0) - Number(b?.id || 0))[0] || null;
}

export function normalizeModelName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

export function matchesOpenType(item, type) {
  if (type === 'all') return true;
  const option = OPEN_TYPE_OPTIONS.find((entry) => entry.value === type);
  const extension = String(item?.extensao || item?.nome_arquivo || '').toLowerCase();
  return option?.extensions.some((value) => extension.endsWith(value)) ?? true;
}
