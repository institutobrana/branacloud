export const RECIPE_MEDICATION_ALPHABET = Object.freeze(['*', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']);

export function normalizeRecipeMedicationSearch(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

export function getRecipeMedicationName(item) {
  return String(item?.nome ?? '').trim();
}

export function getRecipeMedicationPresentation(item) {
  return String(item?.apresentacao ?? '').trim();
}

export function getRecipeMedicationAlphabetOptions() {
  return [
    { id: 0, label: '*' },
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => ({ id: letter.charCodeAt(0), label: letter })),
  ];
}

export function filterRecipeMedications(items, { group = '*', query = '', letter = '*' } = {}) {
  const normalizedQuery = normalizeRecipeMedicationSearch(query);
  return (Array.isArray(items) ? items : []).filter((item) => {
    const name = getRecipeMedicationName(item);
    if (!name) return false;
    if (group !== '*' && normalizeRecipeMedicationSearch(item?.grupo) !== normalizeRecipeMedicationSearch(group)) return false;
    if (normalizedQuery) {
      const searchable = normalizeRecipeMedicationSearch(`${name} ${getRecipeMedicationPresentation(item)}`);
      if (!searchable.includes(normalizedQuery)) return false;
    }
    if (letter !== '*') {
      const firstLetter = normalizeRecipeMedicationSearch(name).match(/[a-z]/)?.[0]?.toUpperCase() || '#';
      if (firstLetter !== letter) return false;
    }
    return true;
  });
}

export function reconcileRecipeMedicationSelection(items, selectedId) {
  const list = Array.isArray(items) ? items : [];
  const selected = list.find((item) => Number(item?.id) === Number(selectedId));
  return selected ? Number(selected.id) : (list.length ? Number(list[0]?.id) || null : null);
}
