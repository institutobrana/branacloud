import { getRecipeMedicationName, getRecipeMedicationPresentation } from './recipeMedicationMenu.js';

export function createRecipeAssistantItem({ medication, ageGroup, prescription, quantity, usageId, usageLabel, observations }) {
  const medicationId = Number(medication?.id || 0);
  const medicationName = getRecipeMedicationName(medication);
  if (!medicationId || !medicationName) return null;
  return {
    medicationId,
    medicationName,
    presentation: getRecipeMedicationPresentation(medication),
    prescription: String(prescription || '').trim(),
    quantity: String(quantity || '').trim(),
    usageId: Number(usageId || 0) || null,
    usageLabel: String(usageLabel || '').trim(),
    observations: String(observations || '').trim(),
    adultChildMode: ageGroup === 'crianca' ? 'crianca' : 'adulto',
  };
}

function usageTitle(value) {
  const raw = String(value || '').trim();
  return raw ? raw.charAt(0).toLocaleUpperCase('pt-BR') + raw.slice(1) : 'Uso interno';
}

function lineWithQuantity(left, right, width = 56) {
  const title = String(left || '').trim();
  const amount = String(right || '').trim();
  if (!amount) return title;
  return `${title}${'\u00a0'.repeat(Math.max(2, width - title.length - amount.length))}${amount}`;
}

export function buildRecipeAssistantBody(items) {
  const groups = new Map();
  for (const item of Array.isArray(items) ? items : []) {
    const title = usageTitle(item?.usageLabel);
    if (!groups.has(title)) groups.set(title, []);
    groups.get(title).push(item);
  }
  const lines = [];
  let index = 1;
  for (const [title, group] of groups) {
    if (lines.length) lines.push('');
    lines.push(`${title} :`, '');
    const normalized = group.map((item, offset) => {
      const medication = String(item?.medicationName || 'Item').trim();
      const suffix = item?.adultChildMode === 'crianca' ? ' (Criança)' : '';
      return { item, title: `${String(index + offset).padStart(2, '0')} - ${medication}${suffix}` };
    });
    const width = Math.min(62, Math.max(48, ...normalized.map(({ title: itemTitle }) => itemTitle.length + 6)));
    normalized.forEach(({ item, title: itemTitle }, offset) => {
      lines.push(lineWithQuantity(itemTitle, item?.quantity, width));
      const prescription = String(item?.prescription || '').trim();
      const observations = String(item?.observations || '').trim();
      if (prescription) lines.push(`\u00a0\u00a0\u00a0\u00a0${prescription}`);
      if (observations) lines.push(`\u00a0\u00a0\u00a0\u00a0Obs.: ${observations}`);
      if (offset < normalized.length - 1) lines.push('');
    });
    index += group.length;
  }
  return lines.join('\n').trim();
}

// Merge text-bearing fields on a clone so native Oasis structure and formatting
// remain intact, even when a template contains tokens in more than one run.
export function mergeOasisTextNodes(document, mergedText) {
  const clone = structuredClone(document);
  const slots = [];
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (key === 'text' && typeof child === 'string') slots.push({ owner: value, key });
      else visit(child);
    }
  };
  visit(clone);
  const separator = '\uE000BRANA_RECIPE_MERGE\uE001';
  if (slots.some(({ owner, key }) => owner[key].includes(separator))) throw new Error('Não foi possível preparar os campos de mesclagem do modelo Oasis.');
  const merged = String(mergedText ?? '').split(separator);
  if (merged.length !== slots.length) throw new Error('A mesclagem do modelo Oasis retornou uma estrutura de texto inesperada.');
  slots.forEach(({ owner, key }, index) => { owner[key] = merged[index]; });
  return clone;
}

export function joinOasisTextNodes(document) {
  const values = [];
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach(visit);
    for (const [key, child] of Object.entries(value)) {
      if (key === 'text' && typeof child === 'string') values.push(child);
      else visit(child);
    }
  };
  visit(document);
  return values.join('\uE000BRANA_RECIPE_MERGE\uE001');
}

// Inspect actual text slots rather than their flattened representation:
// joinOasisTextNodes inserts this marker between slots as a structural delimiter.
export function hasOasisMergeSeparatorInText(document) {
  const separator = '\uE000BRANA_RECIPE_MERGE\uE001';
  let found = false;
  const visit = (value) => {
    if (found || !value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (key === 'text' && typeof child === 'string') {
        if (child.includes(separator)) {
          found = true;
          return;
        }
      } else visit(child);
      if (found) return;
    }
  };
  visit(document);
  return found;
}
