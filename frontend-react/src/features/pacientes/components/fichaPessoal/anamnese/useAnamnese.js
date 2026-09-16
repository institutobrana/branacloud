import { useEffect, useMemo, useRef, useState } from 'react';
import { listarQuestionarios, obterPerguntasERespostas, salvarRespostaAnamnese } from './anamneseApi.js';
import { itemsEqual, serializeLocalAnswer } from './anamneseUtils.js';

export function useAnamnese(pacienteId, enabled) {
  const [questionarios, setQuestionarios] = useState([]);
  const [questionarioId, setQuestionarioId] = useState(null);
  const [questionarioNome, setQuestionarioNome] = useState('');
  const [hasPersistedQuestionnaire, setHasPersistedQuestionnaire] = useState(false);
  const [isNewUnsavedQuestionnaire, setIsNewUnsavedQuestionnaire] = useState(false);
  const [itens, setItens] = useState([]);
  const [status, setStatus] = useState(enabled ? 'loading' : 'idle');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const [draftItems, setDraftItems] = useState([]);
  const requestSeq = useRef(0);
  const hasPendingChanges = useMemo(() => isNewUnsavedQuestionnaire || !itemsEqual(savedItems, draftItems), [isNewUnsavedQuestionnaire, savedItems, draftItems]);

  const applyLoadedItems = (items) => { const next = Array.isArray(items) ? items : []; setSavedItems(next); setDraftItems(next); };

  useEffect(() => {
    if (!enabled || !Number(pacienteId)) {
      setQuestionarios([]); setQuestionarioId(null); setQuestionarioNome(''); setItens([]); applyLoadedItems([]); setHasPersistedQuestionnaire(false); setIsNewUnsavedQuestionnaire(false); setStatus('idle'); setError('');
      return undefined;
    }
    let active = true; const sequence = ++requestSeq.current;
    setStatus('loading'); setError(''); setItens([]);
    listarQuestionarios()
      .then((data) => {
        if (!active || sequence !== requestSeq.current) return null;
        const list = Array.isArray(data) ? data : [];
        setQuestionarios(list);
        return null;
      })
      .then((data) => {
        if (!active || sequence !== requestSeq.current) return;
        setQuestionarioNome(''); setItens([]); applyLoadedItems([]); setStatus('ready');
      })
      .catch((cause) => { if (active && sequence === requestSeq.current) { setStatus('error'); setError(cause?.message || 'Falha ao carregar a Anamnese.'); } });
    return () => { active = false; };
  }, [enabled, pacienteId]);

  const selectQuestionario = (nextId) => {
    const id = Number(nextId) || null;
    if (!id) return Promise.resolve(false);
    let active = true; const sequence = ++requestSeq.current;
    setQuestionarioId(id); setItens([]); setStatus('loading'); setError('');
    return obterPerguntasERespostas(pacienteId, id)
      .then((data) => { if (active && sequence === requestSeq.current) { const nextItems = Array.isArray(data?.itens) ? data.itens : []; setQuestionarioNome(String(data?.questionario_nome || '')); setItens(nextItems); applyLoadedItems(nextItems); setHasPersistedQuestionnaire(Boolean(data?.has_persisted_questionnaire)); setIsNewUnsavedQuestionnaire(!data?.has_persisted_questionnaire); setStatus('ready'); } return data; })
      .catch((cause) => { if (active && sequence === requestSeq.current) { setStatus('error'); setError(cause?.message || 'Falha ao carregar as perguntas.'); } return null; });
  };

  const updateDraft = (questionId, answer, complement) => setDraftItems((current) => current.map((item) => item.pergunta_id === questionId ? { ...item, resposta: serializeLocalAnswer(item, answer, complement) } : item));
  const discardDraft = () => { setDraftItems(savedItems); setIsNewUnsavedQuestionnaire(false); };
  const savePendingAnamnese = async () => {
    if (!Number(pacienteId) || !hasPendingChanges) return true;
    const snapshot = draftItems.map((item) => ({ ...item }));
    const baseById = new Map(savedItems.map((item) => [item.pergunta_id, item]));
    const changed = snapshot.filter((item) => !itemsEqual([baseById.get(item.pergunta_id)], [item]));
    if (isNewUnsavedQuestionnaire && changed.length === 0) {
      setError('Questionario novo sem respostas iniciais persistiveis.');
      return false;
    }
    setIsSaving(true); setError('');
    const confirmedIds = [];
    try {
      for (const item of changed) {
        await salvarRespostaAnamnese(pacienteId, { pergunta_id: item.pergunta_id, resposta: item.resposta || null });
        confirmedIds.push(item.pergunta_id);
      }
    } catch (cause) {
      setSavedItems((current) => current.map((item) => {
        const confirmed = snapshot.find((candidate) => candidate.pergunta_id === item.pergunta_id && confirmedIds.includes(candidate.pergunta_id));
        return confirmed ? { ...item, resposta: confirmed.resposta } : item;
      }));
      setIsSaving(false); setError(cause?.message || 'Falha ao gravar respostas da Anamnese.');
      return false;
    }
    setSavedItems(snapshot); setIsNewUnsavedQuestionnaire(false); setHasPersistedQuestionnaire(true); setIsSaving(false); setError('');
    return true;
  };

  return { questionarios, questionarioId, questionarioNome, itens: draftItems, status, error, selectQuestionario, updateDraft, savedItems, draftItems, isDirty: hasPendingChanges, hasPendingChanges, hasPersistedQuestionnaire, isNewUnsavedQuestionnaire, discardDraft, savePendingAnamnese, isSaving };
}
