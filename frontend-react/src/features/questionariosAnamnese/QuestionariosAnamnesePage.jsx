import { Alert, Button, Empty, Spin, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { BranaModal } from '../../components/BranaModal.jsx';
import { QuestionarioDeleteDialog } from './components/QuestionarioDeleteDialog.jsx';
import { PerguntaFormModal } from './components/PerguntaFormModal.jsx';
import { PerguntaDeleteDialog } from './components/PerguntaDeleteDialog.jsx';
import { QuestionarioFormModal } from './components/QuestionarioFormModal.jsx';
import { QuestionariosAnamneseTable } from './components/QuestionariosAnamneseTable.jsx';
import { QuestionariosAnamneseToolbar } from './components/QuestionariosAnamneseToolbar.jsx';
import { useQuestionariosAnamnese } from './hooks/useQuestionariosAnamnese.js';
import './questionariosAnamnese.css';

export function QuestionariosAnamnesePage({ onToolbarChange }) {
  const {
    questionarios,
    selectedQuestionarioId,
    setSelectedQuestionarioId,
    perguntas,
    loadingQuestionarios,
    loadingPerguntas,
    errorQuestionarios,
    errorPerguntas,
    questionarioModal,
    questionarioModalLoading,
    questionarioModalError,
    perguntaModal,
    perguntaModalLoading,
    perguntaModalError,
    openCreateQuestionario,
    openCreatePergunta,
    openEditPergunta,
    openDeletePerguntaConfirm,
    openEditQuestionario,
    closeQuestionarioModal,
    saveQuestionario,
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
    closeDeleteBlocked,
  } = useQuestionariosAnamnese();

  const [selectedPerguntaId, setSelectedPerguntaId] = useState(null);
  const [tableScrollY, setTableScrollY] = useState(420);
  const tableShellRef = useRef(null);

  useEffect(() => {
    setSelectedPerguntaId(null);
  }, [selectedQuestionarioId]);

  useEffect(() => {
    const updateScroll = () => {
      const height = window.innerHeight || 900;
      setTableScrollY(Math.max(220, Math.round(height - 260)));
    };

    updateScroll();
    window.addEventListener('resize', updateScroll);
    return () => window.removeEventListener('resize', updateScroll);
  }, []);

  useEffect(() => {
    if (!perguntas.length) {
      setSelectedPerguntaId(null);
      return;
    }

    const stillSelected = perguntas.some((item) => item.id === selectedPerguntaId);
    if (!stillSelected) {
      setSelectedPerguntaId(perguntas[0]?.id ?? null);
    }
  }, [selectedPerguntaId, perguntas]);

  const footerLabel = useMemo(() => {
    const count = perguntas.length;
    return `${count} pergunta${count === 1 ? '' : 's'}`;
  }, [perguntas.length]);

  const selectedPergunta = useMemo(
    () => perguntas.find((item) => Number(item.id) === Number(selectedPerguntaId)) || null,
    [selectedPerguntaId, perguntas],
  );

  const goToFirstPergunta = () => {
    const firstPergunta = perguntas[0] || null;
    setSelectedPerguntaId(firstPergunta?.id ?? null);
    const scrollContainer = tableShellRef.current?.querySelector('.ant-table-body');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  };

  const toolbar = useMemo(
    () => (
      <QuestionariosAnamneseToolbar
        questionarios={questionarios}
        selectedQuestionarioId={selectedQuestionarioId}
        loadingQuestionarios={loadingQuestionarios}
        onSelectQuestionario={setSelectedQuestionarioId}
        onCreateQuestionario={openCreateQuestionario}
        onCreatePergunta={openCreatePergunta}
        onEditPergunta={() => openEditPergunta(selectedPergunta)}
        onDeletePergunta={() => openDeletePerguntaConfirm(selectedPergunta)}
        onEditQuestionario={openEditQuestionario}
        onDeleteQuestionario={openDeleteConfirm}
        onGoToFirstPergunta={goToFirstPergunta}
        createDisabled={loadingQuestionarios || questionarioModalLoading || deleteConfirmState.loading || questionarioModal.open}
        perguntaDisabled={!selectedQuestionarioId || loadingQuestionarios || loadingPerguntas || questionarioModalLoading || perguntaModalLoading || deleteConfirmState.loading || questionarioModal.open || perguntaModal.open}
        editPerguntaDisabled={!selectedQuestionarioId || !selectedPergunta?.id || loadingQuestionarios || loadingPerguntas || questionarioModalLoading || perguntaModalLoading || deleteConfirmState.loading || questionarioModal.open || perguntaModal.open}
        deletePerguntaDisabled={!selectedQuestionarioId || !selectedPergunta?.id || loadingQuestionarios || loadingPerguntas || questionarioModalLoading || perguntaModalLoading || perguntaDeleteState.loading || questionarioModal.open || perguntaModal.open || perguntaDeleteState.open}
        renumeraPerguntasDisabled={!selectedQuestionarioId || !perguntas.length || loadingQuestionarios || loadingPerguntas || questionarioModalLoading || perguntaModalLoading || deleteConfirmState.loading || perguntaDeleteState.loading || questionarioModal.open || perguntaModal.open}
        editDisabled={!selectedQuestionarioId || loadingQuestionarios || questionarioModalLoading || deleteConfirmState.loading || questionarioModal.open}
        deleteDisabled={!selectedQuestionarioId || loadingQuestionarios || questionarioModalLoading || deleteConfirmState.loading || questionarioModal.open}
      />
    ),
    [
      loadingQuestionarios,
      openCreateQuestionario,
      openCreatePergunta,
      openDeleteConfirm,
      openEditQuestionario,
      selectedPergunta,
      perguntaModal.open,
      perguntaModalLoading,
      loadingPerguntas,
      questionarioModal.open,
      questionarioModalLoading,
      questionarios,
      selectedQuestionarioId,
      setSelectedQuestionarioId,
      deleteConfirmState.loading,
      perguntas.length,
    ],
  );

  useEffect(() => {
    onToolbarChange?.(toolbar);
    return () => onToolbarChange?.(null);
  }, [onToolbarChange, toolbar]);

  const hasQuestionarios = questionarios.length > 0;
  const hasPerguntas = perguntas.length > 0;

  return (
    <div className="questionarios-anamnese-page">
      <div className="questionarios-anamnese-content" ref={tableShellRef}>
        {errorQuestionarios ? (
          <Alert
            type="error"
            showIcon
            message="Falha ao carregar questionarios de anamnese."
            description={errorQuestionarios}
          />
        ) : null}

        {!errorQuestionarios && loadingQuestionarios ? (
          <div className="questionarios-anamnese-loading">
            <Spin />
            <Typography.Text type="secondary">Carregando questionarios...</Typography.Text>
          </div>
        ) : null}

        {!errorQuestionarios && !loadingQuestionarios && !hasQuestionarios ? (
          <Empty description="Nenhum questionario de anamnese encontrado." />
        ) : null}

        {!errorQuestionarios && hasQuestionarios ? (
          <>
            {errorPerguntas ? (
              <Alert
                type="error"
                showIcon
                message="Falha ao carregar perguntas."
                description={errorPerguntas}
                className="questionarios-anamnese-alert"
              />
            ) : null}

            {!errorPerguntas && loadingPerguntas ? (
              <div className="questionarios-anamnese-loading">
                <Spin />
                <Typography.Text type="secondary">Carregando perguntas...</Typography.Text>
              </div>
            ) : null}

            {!errorPerguntas && !loadingPerguntas && !hasPerguntas ? (
              <Empty description="Este questionario ainda nao possui perguntas." />
            ) : null}

            {!errorPerguntas && hasPerguntas ? (
              <QuestionariosAnamneseTable
                perguntas={perguntas}
                loading={loadingPerguntas}
                selectedId={selectedPerguntaId}
                onSelect={setSelectedPerguntaId}
                tableScrollY={tableScrollY}
                footerLabel={footerLabel}
              />
            ) : null}
          </>
        ) : null}
      </div>

      <QuestionarioFormModal
        open={questionarioModal.open}
        mode={questionarioModal.mode}
        loading={questionarioModalLoading}
        error={questionarioModalError}
        item={questionarioModal.target}
        questionarios={questionarios}
        loadingQuestionarios={loadingQuestionarios}
        onCancel={closeQuestionarioModal}
        onSave={saveQuestionario}
      />

      <PerguntaFormModal
        open={perguntaModal.open}
        mode={perguntaModal.mode}
        item={perguntaModal.target}
        loading={perguntaModalLoading}
        error={perguntaModalError}
        onCancel={closePerguntaModal}
        onSave={async (payload) => {
          const result = await savePergunta(payload);
          if (result?.valid && result?.item?.id) {
            setSelectedPerguntaId(result.item.id);
          }
          return result;
        }}
      />

      <PerguntaDeleteDialog
        open={perguntaDeleteState.open}
        loading={perguntaDeleteState.loading}
        error={perguntaDeleteState.error}
        target={perguntaDeleteState.target}
        onCancel={closeDeletePerguntaConfirm}
        onConfirm={async () => {
          const result = await confirmDeletePergunta();
          if (result?.valid) {
            const nextSelected = result?.item?.id ?? null;
            setSelectedPerguntaId(nextSelected);
          }
          return result;
        }}
      />

      <QuestionarioDeleteDialog
        open={deleteConfirmState.open}
        loading={deleteConfirmState.loading}
        error={deleteConfirmState.error}
        target={deleteConfirmState.target}
        onCancel={closeDeleteConfirm}
        onConfirm={confirmDeleteQuestionario}
      />

      <BranaModal
        open={deleteBlockedState.open}
        title="Configura questionarios de anamnese"
        centered
        width={520}
        destroyOnClose
        maskClosable
        keyboard
        onCancel={closeDeleteBlocked}
        footer={null}
      >
        <div className="questionarios-anamnese-delete-blocked">
          <Typography.Text>{deleteBlockedState.message}</Typography.Text>
        </div>
        <div className="questionarios-anamnese-modal-actions">
          <Button type="primary" onClick={closeDeleteBlocked}>
            Ok
          </Button>
        </div>
      </BranaModal>
    </div>
  );
}
