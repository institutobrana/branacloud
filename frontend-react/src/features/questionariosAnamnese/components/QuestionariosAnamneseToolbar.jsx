import { Select, Typography } from 'antd';

export function QuestionariosAnamneseToolbar({
  questionarios,
  selectedQuestionarioId,
  loadingQuestionarios,
  onSelectQuestionario,
  onCreateQuestionario,
  onCreatePergunta,
  onEditPergunta,
  onDeletePergunta,
  onGoToFirstPergunta,
  onEditQuestionario,
  onDeleteQuestionario,
  createDisabled = false,
  perguntaDisabled = false,
  editPerguntaDisabled = false,
  deletePerguntaDisabled = false,
  renumeraPerguntasDisabled = false,
  editDisabled = false,
  deleteDisabled = false,
}) {
  const options = questionarios.map((item) => ({
    value: item.id,
    label: item.nome || `Questionario ${item.id}`,
  }));

  return (
    <div className="questionarios-anamnese-toolbar" role="toolbar" aria-label="Controles de questionarios de anamnese">
      <div className="questionarios-anamnese-toolbar-actions">
        <Typography.Text className="questionarios-anamnese-toolbar-label" type="secondary">
          Questionario:
        </Typography.Text>
        <Select
          className="questionarios-anamnese-toolbar-select"
          value={selectedQuestionarioId ?? undefined}
          loading={loadingQuestionarios}
          options={options}
          placeholder="Selecione um questionario"
          onChange={onSelectQuestionario}
          allowClear={false}
          showSearch
          optionFilterProp="label"
          virtual={false}
          popupMatchSelectWidth={false}
        />
        <button type="button" className="auxiliary-shell-button primary" onClick={onCreateQuestionario} disabled={createDisabled}>
          Novo questionario
        </button>
        <button type="button" className="auxiliary-shell-button" onClick={onEditQuestionario} disabled={editDisabled}>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" onClick={onDeleteQuestionario} disabled={deleteDisabled}>
          Elimina
        </button>
        <span className="questionarios-anamnese-toolbar-divider" aria-hidden="true" />
        <button type="button" className="auxiliary-shell-button" onClick={onCreatePergunta} disabled={perguntaDisabled}>
          Nova pergunta
        </button>
        <button type="button" className="auxiliary-shell-button" onClick={onEditPergunta} disabled={editPerguntaDisabled}>
          Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" onClick={onDeletePergunta} disabled={deletePerguntaDisabled}>
          Elimina
        </button>
        <button type="button" className="auxiliary-shell-button" onClick={onGoToFirstPergunta} disabled={renumeraPerguntasDisabled}>
          1,2... Renumera perguntas
        </button>
        <button type="button" className="auxiliary-shell-button" disabled>
          Imprime
        </button>
      </div>
    </div>
  );
}
