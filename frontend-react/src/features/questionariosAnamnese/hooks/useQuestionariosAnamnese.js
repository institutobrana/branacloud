import { message } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  atualizarQuestionarioAnamnese,
  atualizarPerguntaQuestionarioAnamnese,
  criarPerguntaQuestionarioAnamnese,
  criarQuestionarioAnamnese,
  excluirQuestionarioAnamnese,
  excluirPerguntaQuestionarioAnamnese,
  listarPerguntasQuestionarioAnamnese,
  listarQuestionariosAnamnese,
} from '../questionariosAnamneseApi.js';

function selectPerguntaAfterDelete(items, deletedId) {
  if (!Array.isArray(items) || !items.length) return null;
  const deletedIndex = items.findIndex((item) => Number(item.id) === Number(deletedId));
  const nextIndex = deletedIndex >= 0 ? deletedIndex : 0;
  return items[nextIndex] || items[nextIndex - 1] || items[0] || null;
}

function normalizeQuestionario(item) {
  return {
    id: item?.id ?? null,
    nome: String(item?.nome || '').trim(),
    ordem: Number(item?.ordem ?? 0) || 0,
    ativo: Boolean(item?.ativo),
  };
}

function normalizePergunta(item) {
  return {
    id: item?.id ?? null,
    numero: Number(item?.numero ?? 0) || 0,
    texto: String(item?.texto || '').trim(),
    tipo_pergunta: Number(item?.tipo_pergunta ?? 0) || 0,
    tipo_resposta: Number(item?.tipo_resposta ?? 0) || 0,
    mensagem_alerta: String(item?.mensagem_alerta || '').trim(),
    ativo: Boolean(item?.ativo),
  };
}

function normalizeName(value) {
  return String(value || '').trim();
}

function selectQuestionarioAfterDelete(items, deletedId) {
  if (!Array.isArray(items) || !items.length) return null;
  const deletedIndex = items.findIndex((item) => Number(item.id) === Number(deletedId));
  const nextIndex = deletedIndex >= 0 ? deletedIndex : 0;
  return items[nextIndex] || items[nextIndex - 1] || items[0] || null;
}

export function useQuestionariosAnamnese() {
  const [questionarios, setQuestionarios] = useState([]);
  const [selectedQuestionarioId, setSelectedQuestionarioId] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [loadingQuestionarios, setLoadingQuestionarios] = useState(true);
  const [loadingPerguntas, setLoadingPerguntas] = useState(false);
  const [errorQuestionarios, setErrorQuestionarios] = useState('');
  const [errorPerguntas, setErrorPerguntas] = useState('');
  const [questionarioModal, setQuestionarioModal] = useState({
    open: false,
    mode: 'create',
    target: null,
  });
  const [questionarioModalLoading, setQuestionarioModalLoading] = useState(false);
  const [questionarioModalError, setQuestionarioModalError] = useState('');
  const [perguntaModal, setPerguntaModal] = useState({
    open: false,
    mode: 'create',
    target: null,
    targetQuestionarioId: null,
  });
  const [perguntaModalLoading, setPerguntaModalLoading] = useState(false);
  const [perguntaModalError, setPerguntaModalError] = useState('');
  const [perguntaDeleteState, setPerguntaDeleteState] = useState({
    open: false,
    loading: false,
    error: '',
    target: null,
  });
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    open: false,
    loading: false,
    error: '',
    target: null,
  });
  const [deleteBlockedState, setDeleteBlockedState] = useState({
    open: false,
    message: '',
  });
  const questionariosSeqRef = useRef(0);
  const perguntasSeqRef = useRef(0);

  const loadQuestionarios = useCallback(async (preferredId = null) => {
    const seq = ++questionariosSeqRef.current;
    setLoadingQuestionarios(true);
    setErrorQuestionarios('');
    try {
      const items = await listarQuestionariosAnamnese();
      if (seq !== questionariosSeqRef.current) return [];
      const normalized = items.map(normalizeQuestionario).filter((item) => item.id != null);
      setQuestionarios(normalized);
      setSelectedQuestionarioId((current) => {
        const desired = preferredId != null ? Number(preferredId) : current;
        if (desired != null && normalized.some((item) => Number(item.id) === Number(desired))) {
          return Number(desired);
        }
        return normalized[0]?.id ?? null;
      });
      return normalized;
    } catch (error) {
      if (seq !== questionariosSeqRef.current) return [];
      setQuestionarios([]);
      setSelectedQuestionarioId(null);
      setPerguntas([]);
      setErrorQuestionarios(error?.message || 'Falha ao carregar questionarios.');
      message.error(error?.message || 'Falha ao carregar questionarios.');
      return [];
    } finally {
      if (seq === questionariosSeqRef.current) {
        setLoadingQuestionarios(false);
      }
    }
  }, []);

  const loadPerguntas = useCallback(async (questionarioId) => {
    const qid = Number(questionarioId || 0) || null;
    const seq = ++perguntasSeqRef.current;
    if (!qid) {
      setPerguntas([]);
      setErrorPerguntas('');
      setLoadingPerguntas(false);
      return [];
    }

    setLoadingPerguntas(true);
    setErrorPerguntas('');
    try {
      const items = await listarPerguntasQuestionarioAnamnese(qid);
      if (seq !== perguntasSeqRef.current) return [];
      const normalized = items.map(normalizePergunta).filter((item) => item.id != null);
      setPerguntas(normalized);
      return normalized;
    } catch (error) {
      if (seq !== perguntasSeqRef.current) return [];
      setPerguntas([]);
      setErrorPerguntas(error?.message || 'Falha ao carregar perguntas.');
      message.error(error?.message || 'Falha ao carregar perguntas.');
      return [];
    } finally {
      if (seq === perguntasSeqRef.current) {
        setLoadingPerguntas(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadQuestionarios();
  }, [loadQuestionarios]);

  useEffect(() => {
    void loadPerguntas(selectedQuestionarioId);
  }, [loadPerguntas, selectedQuestionarioId]);

  const selectedQuestionario = useMemo(
    () => questionarios.find((item) => Number(item.id) === Number(selectedQuestionarioId)) || null,
    [questionarios, selectedQuestionarioId],
  );

  const refreshQuestionarios = useCallback(async (preferredId = null) => {
    return loadQuestionarios(preferredId);
  }, [loadQuestionarios]);

  const openCreateQuestionario = useCallback(() => {
    setQuestionarioModal({
      open: true,
      mode: 'create',
      target: null,
    });
    setQuestionarioModalError('');
  }, []);

  const openEditQuestionario = useCallback(() => {
    if (!selectedQuestionario) return;
    setQuestionarioModal({
      open: true,
      mode: 'edit',
      target: selectedQuestionario,
    });
    setQuestionarioModalError('');
  }, [selectedQuestionario]);

  const closeQuestionarioModal = useCallback(() => {
    if (questionarioModalLoading) return;
    setQuestionarioModal({
      open: false,
      mode: 'create',
      target: null,
    });
    setQuestionarioModalError('');
  }, [questionarioModalLoading]);

  const saveQuestionario = useCallback(async ({ nome, copiar_do_questionario_id }) => {
    const trimmedNome = normalizeName(nome);
    if (!trimmedNome) {
      const nextError = 'Informe o nome do questionario.';
      setQuestionarioModalError(nextError);
      return { valid: false, error: nextError };
    }

    const sourceId = Number(copiar_do_questionario_id || 0) || null;
    setQuestionarioModalLoading(true);
    setQuestionarioModalError('');
    try {
      const payload = { nome: trimmedNome };
      if (questionarioModal.mode === 'create' && sourceId) {
        payload.copiar_do_questionario_id = sourceId;
      }
      if (questionarioModal.mode === 'edit' && questionarioModal.target?.id) {
        const saved = await atualizarQuestionarioAnamnese(questionarioModal.target.id, payload);
        const nextItems = await refreshQuestionarios(questionarioModal.target.id);
        const match = nextItems.find((item) => Number(item.id) === Number(questionarioModal.target.id)) || null;
        if (match) {
          setSelectedQuestionarioId(match.id);
        }
        setQuestionarioModal({
          open: false,
          mode: 'create',
          target: null,
        });
        setQuestionarioModalError('');
        message.success('Questionario alterado com sucesso.');
        return { valid: true, item: saved };
      }

      const saved = await criarQuestionarioAnamnese(payload);
      await refreshQuestionarios(saved?.id ?? null);
      if (saved?.id) {
        setSelectedQuestionarioId(saved.id);
      }
      setPerguntas([]);
      setErrorPerguntas('');
      setQuestionarioModal({
        open: false,
        mode: 'create',
        target: null,
      });
      setQuestionarioModalError('');
      message.success(sourceId ? 'Questionario criado com copia com sucesso.' : 'Questionario criado com sucesso.');
      return { valid: true, item: saved };
    } catch (error) {
      const nextError = error?.message || 'Falha ao salvar questionario.';
      setQuestionarioModalError(nextError);
      message.error(nextError);
      return { valid: false, error: nextError };
    } finally {
      setQuestionarioModalLoading(false);
    }
  }, [refreshQuestionarios]);

  const openDeleteConfirm = useCallback(() => {
    if (!selectedQuestionario) return;
    setDeleteConfirmState({
      open: true,
      loading: false,
      error: '',
      target: selectedQuestionario,
    });
  }, [selectedQuestionario]);

  const openCreatePergunta = useCallback(() => {
    if (!selectedQuestionario?.id) return;
    setPerguntaModal({
      open: true,
      mode: 'create',
      target: null,
      targetQuestionarioId: selectedQuestionario.id,
    });
    setPerguntaModalError('');
  }, [selectedQuestionario]);

  const openEditPergunta = useCallback((pergunta) => {
    if (!selectedQuestionario?.id || !pergunta?.id) return;
    setPerguntaModal({
      open: true,
      mode: 'edit',
      target: pergunta,
      targetQuestionarioId: selectedQuestionario.id,
    });
    setPerguntaModalError('');
  }, [selectedQuestionario]);

  const openDeletePerguntaConfirm = useCallback((pergunta) => {
    if (!selectedQuestionario?.id || !pergunta?.id) return;
    const target = perguntas.find((item) => Number(item.id) === Number(pergunta.id)) || null;
    if (!target?.id) return;
    setPerguntaDeleteState({
      open: true,
      loading: false,
      error: '',
      target,
    });
  }, [perguntas, selectedQuestionario]);

  const closeDeletePerguntaConfirm = useCallback(() => {
    if (perguntaDeleteState.loading) return;
    setPerguntaDeleteState({
      open: false,
      loading: false,
      error: '',
      target: null,
    });
  }, [perguntaDeleteState.loading]);

  const confirmDeletePergunta = useCallback(async () => {
    const target = perguntaDeleteState.target || null;
    if (!target?.id || perguntaDeleteState.loading) {
      return { valid: false, error: 'Selecione uma pergunta válida.' };
    }

    setPerguntaDeleteState((current) => ({
      ...current,
      loading: true,
      error: '',
    }));

    const deletedId = Number(target.id);
    const previousItems = perguntas.slice();

    try {
      await excluirPerguntaQuestionarioAnamnese(deletedId);
      const nextItems = previousItems.filter((item) => Number(item.id) !== deletedId);
      const replacement = selectPerguntaAfterDelete(nextItems, deletedId);
      setPerguntas(nextItems);
      setPerguntaDeleteState({
        open: false,
        loading: false,
        error: '',
        target: null,
      });
      setPerguntaModalError('');
      message.success('Pergunta excluida com sucesso.');
      return { valid: true, item: replacement };
    } catch (error) {
      const nextError = error?.message || 'Falha ao excluir pergunta.';
      setPerguntaDeleteState((current) => ({
        ...current,
        loading: false,
        error: nextError,
      }));
      message.error(nextError);
      return { valid: false, error: nextError };
    }
  }, [perguntaDeleteState.loading, perguntaDeleteState.target, perguntas]);

  const closePerguntaModal = useCallback(() => {
    if (perguntaModalLoading) return;
    setPerguntaModal({
      open: false,
      mode: 'create',
      target: null,
      targetQuestionarioId: null,
    });
    setPerguntaModalError('');
  }, [perguntaModalLoading]);

  const savePergunta = useCallback(async ({ numero, tipo_pergunta, tipo_resposta, texto, mensagem_alerta }) => {
    const targetQuestionarioId = perguntaModal.targetQuestionarioId || selectedQuestionario?.id || null;
    if (!targetQuestionarioId) {
      const nextError = 'Selecione um questionario.';
      setPerguntaModalError(nextError);
      return { valid: false, error: nextError };
    }

    const textoLimpo = String(texto || '').trim();
    const alertaLimpo = String(mensagem_alerta || '').trim();
    if (!textoLimpo) {
      const nextError = 'Informe o texto da pergunta.';
      setPerguntaModalError(nextError);
      return { valid: false, error: nextError };
    }

    if (textoLimpo.length > 400) {
      const nextError = 'O texto deve ter no maximo 400 caracteres.';
      setPerguntaModalError(nextError);
      return { valid: false, error: nextError };
    }

    if (alertaLimpo.length > 255) {
      const nextError = 'A mensagem de alerta deve ter no maximo 255 caracteres.';
      setPerguntaModalError(nextError);
      return { valid: false, error: nextError };
    }

    const numeroValido = numero == null || (Number.isInteger(Number(numero)) && Number(numero) > 0);
    if (!numeroValido) {
      const nextError = 'Número inválido.';
      setPerguntaModalError(nextError);
      return { valid: false, error: nextError };
    }

    const tipoPergunta = Number(tipo_pergunta || 1) || 1;
    const tipoResposta = Number(tipo_resposta || 1) || 1;

    setPerguntaModalLoading(true);
    setPerguntaModalError('');
    try {
      const payload = {
        texto: textoLimpo,
        tipo_pergunta: tipoPergunta,
        tipo_resposta: tipoResposta,
        ativo: true,
      };
      if (numero != null) payload.numero = Number(numero);
      if (alertaLimpo) payload.mensagem_alerta = alertaLimpo;

      if (perguntaModal.mode === 'edit' && perguntaModal.target?.id) {
        const saved = await atualizarPerguntaQuestionarioAnamnese(perguntaModal.target.id, payload);
        const nextItems = await loadPerguntas(targetQuestionarioId);
        const match = nextItems.find((item) => Number(item.id) === Number(perguntaModal.target.id)) || null;
        if (match) {
          setPerguntas(nextItems);
        }
        setPerguntaModal({
          open: false,
          mode: 'create',
          target: null,
          targetQuestionarioId: null,
        });
        setPerguntaModalError('');
        message.success('Pergunta alterada com sucesso.');
        return { valid: true, item: saved };
      }

      const saved = await criarPerguntaQuestionarioAnamnese(targetQuestionarioId, payload);
      const nextItems = await loadPerguntas(targetQuestionarioId);
      const match = nextItems.find((item) => Number(item.id) === Number(saved?.id)) || null;
      if (match) {
        setPerguntas(nextItems);
      }
      setPerguntaModal({
        open: false,
        mode: 'create',
        target: null,
        targetQuestionarioId: null,
      });
      setPerguntaModalError('');
      message.success('Pergunta criada com sucesso.');
      return { valid: true, item: saved };
    } catch (error) {
      const nextError = error?.message || 'Falha ao salvar pergunta.';
      setPerguntaModalError(nextError);
      message.error(nextError);
      return { valid: false, error: nextError };
    } finally {
      setPerguntaModalLoading(false);
    }
  }, [loadPerguntas, perguntaModal.mode, perguntaModal.target?.id, perguntaModal.targetQuestionarioId, selectedQuestionario]);

  const closeDeleteConfirm = useCallback(() => {
    if (deleteConfirmState.loading) return;
    setDeleteConfirmState({
      open: false,
      loading: false,
      error: '',
      target: null,
    });
  }, [deleteConfirmState.loading]);

  const confirmDeleteQuestionario = useCallback(async () => {
    const target = deleteConfirmState.target || selectedQuestionario;
    if (!target?.id || deleteConfirmState.loading) return { valid: false, error: 'Selecione um questionario valido.' };

    setDeleteConfirmState((current) => ({
      ...current,
      loading: true,
      error: '',
    }));

    const deletedId = Number(target.id);
    const previousItems = questionarios.slice();

    try {
      await excluirQuestionarioAnamnese(deletedId);
      const nextItems = previousItems.filter((item) => Number(item.id) !== deletedId);
      const replacement = selectQuestionarioAfterDelete(nextItems, deletedId);
      const replacementId = replacement?.id ?? null;
      await refreshQuestionarios(replacementId);
      setSelectedQuestionarioId(replacementId);
      if (!replacementId) {
        setPerguntas([]);
        setErrorPerguntas('');
      }
      setDeleteConfirmState({
        open: false,
        loading: false,
        error: '',
        target: null,
      });
      message.success('Questionario excluido com sucesso.');
      return { valid: true };
    } catch (error) {
      const status = error?.status;
      const detail = error?.message || '';
      const blockedMessage = status === 409
        ? (detail.includes('pergunta') || detail.includes('perguntas')
          ? 'Este questionario nao pode ser eliminado porque possui perguntas vinculadas.'
          : 'Este questionario nao pode ser eliminado pois esta sendo utilizado em um ou mais pacientes.')
        : '';
      if (status === 409) {
        setDeleteConfirmState({
          open: false,
          loading: false,
          error: '',
          target: null,
        });
        setDeleteBlockedState({
          open: true,
          message: blockedMessage,
        });
        message.warning(blockedMessage);
        return { valid: false, error: blockedMessage };
      }
      const nextError = detail || 'Falha ao excluir questionario.';
      setDeleteConfirmState((current) => ({
        ...current,
        loading: false,
        error: nextError,
      }));
      message.error(nextError);
      return { valid: false, error: nextError };
    }
  }, [deleteConfirmState.loading, deleteConfirmState.target, questionarios, refreshQuestionarios, selectedQuestionario]);

  const isBusy = loadingQuestionarios || loadingPerguntas || questionarioModalLoading || perguntaModalLoading || deleteConfirmState.loading || perguntaDeleteState.loading;

  return {
    questionarios,
    selectedQuestionarioId,
    setSelectedQuestionarioId,
    selectedQuestionario,
    perguntas,
    loadingQuestionarios,
    loadingPerguntas,
    errorQuestionarios,
    errorPerguntas,
    totalQuestionarios: questionarios.length,
    totalPerguntas: perguntas.length,
    refreshQuestionarios,
    loadPerguntas,
    questionarioModal,
    questionarioModalLoading,
    questionarioModalError,
    openCreateQuestionario,
    openEditQuestionario,
    closeQuestionarioModal,
    saveQuestionario,
    perguntaModal,
    perguntaModalLoading,
    perguntaModalError,
    openCreatePergunta,
    openEditPergunta,
    openDeletePerguntaConfirm,
    closePerguntaModal,
    savePergunta,
    perguntaDeleteState,
    closeDeletePerguntaConfirm,
    confirmDeletePergunta,
    deleteConfirmState,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteQuestionario,
    deleteBlockedState,
    closeDeleteBlocked: () => setDeleteBlockedState({ open: false, message: '' }),
    isBusy,
  };
}
