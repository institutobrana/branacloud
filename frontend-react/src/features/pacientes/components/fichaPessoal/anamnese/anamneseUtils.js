export function normalizeAnswer(value, type) {
  const raw = String(value ?? '');
  let stored = null;
  if (raw.trim().startsWith('{')) {
    try { stored = JSON.parse(raw); } catch { stored = null; }
  }
  if (stored && typeof stored === 'object') {
    const answer = String(stored.resposta ?? stored.answer ?? '').trim().toLowerCase();
    const complement = String(stored.complemento ?? stored.complement ?? '');
    if (Number(type) === 3) return { answer: String(stored.resposta ?? stored.answer ?? complement), complement: '' };
    return { answer: ['sim', 's'].includes(answer) ? 'sim' : (['nao', 'não', 'nÃ£o', 'n'].includes(answer) ? 'nao' : ''), complement };
  }
  if (Number(type) === 3) return { answer: raw, complement: '' };
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'sim' || normalized === 's') return { answer: 'sim', complement: '' };
  if (['nao', 'não', 'nÃ£o', 'n'].includes(normalized)) return { answer: 'nao', complement: '' };
  return { answer: '', complement: raw };
}

export function serializeLocalAnswer(item, answer, complement) {
  const type = Number(item?.tipo_resposta || 1);
  if (type === 3) return answer;
  if (type === 2) return JSON.stringify({ resposta: answer, complemento: complement });
  return answer;
}

export function nextYesNoAnswer(current, selected) {
  return selected;
}

export function comparableItems(items) {
  return (items || []).map((item) => {
    const parsed = normalizeAnswer(item.resposta, item.tipo_resposta);
    return { pergunta_id: item.pergunta_id, answer: parsed.answer, complement: parsed.complement };
  });
}

export function itemsEqual(left, right) {
  return JSON.stringify(comparableItems(left)) === JSON.stringify(comparableItems(right));
}

export function shouldShowAlert(question, answer) {
  const type = Number(question?.tipo_pergunta || 1);
  return (type === 2 && answer === 'sim') || (type === 3 && answer === 'nao');
}

export function answerMode(type) {
  const normalizedType = Number(type);
  if (normalizedType === 2) return 'complement';
  if (normalizedType === 3) return 'text';
  return 'yes-no';
}

export const ANAMNESE_QUESTION_STRUCTURE = Object.freeze([
  'ficha-anamnese-card',
  'ficha-anamnese-question-head',
  'ficha-anamnese-answer-row',
  'ficha-anamnese-opcoes',
  'ficha-anamnese-answer-slot',
]);
