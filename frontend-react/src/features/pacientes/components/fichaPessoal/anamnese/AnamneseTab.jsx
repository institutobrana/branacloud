import { AnamneseQuestionarioSelect } from './AnamneseQuestionarioSelect.jsx';
import { AnamneseQuestionList } from './AnamneseQuestionList.jsx';
import { useAnamnese } from './useAnamnese.js';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { Modal } from 'antd';
import { AnamnesePendingChangesDialog } from './AnamnesePendingChangesDialog.jsx';

export const AnamneseTab = forwardRef(function AnamneseTab({ pacienteId, patientName, onDirtyStateChange, onInitialCancel }, ref) {
  const enabled = Number(pacienteId || 0) > 0;
  const state = useAnamnese(pacienteId, enabled);
  const [pendingQuestionario, setPendingQuestionario] = useState(null);
  const [initialDialogOpen, setInitialDialogOpen] = useState(false);
  const [initialSelection, setInitialSelection] = useState('');
  useEffect(() => { if (enabled && state.status === 'ready' && !state.questionarioId && state.questionarios.length) setInitialDialogOpen(true); }, [enabled, state.status, state.questionarioId, state.questionarios.length]);
  useImperativeHandle(ref, () => ({ hasPendingChanges: () => state.hasPendingChanges }), [state.hasPendingChanges]);
  const requestQuestionario = (nextId) => {
    if (state.hasPendingChanges) setPendingQuestionario(nextId);
    else state.selectQuestionario(nextId);
  };
  const discardAndContinue = () => { state.discardDraft(); const next = pendingQuestionario; setPendingQuestionario(null); state.selectQuestionario(next); };
  const saveAndContinue = async () => { if (await state.savePendingAnamnese()) { const next = pendingQuestionario; setPendingQuestionario(null); state.selectQuestionario(next); } };
  useLayoutEffect(() => onDirtyStateChange?.({ hasPendingChanges: state.hasPendingChanges, isDirty: state.isDirty, isSaving: state.isSaving, discardDraft: state.discardDraft, savePendingAnamnese: state.savePendingAnamnese }), [onDirtyStateChange, state.hasPendingChanges, state.isDirty, state.isSaving, state.savedItems]);
  if (!enabled) return <section className="ficha-anamnese-tab" aria-label="Ficha de Anamnese"><div className="ficha-anamnese-state">Necessario gravar o paciente antes de abrir esta aba.</div></section>;
  const statusText = state.status === 'loading' ? 'Carregando...' : state.status === 'error' ? state.error : `${state.questionarioNome || 'Questionario'} - ${state.itens.length} perguntas`;
  const confirmInitialQuestionnaire = async () => { if (!initialSelection) return; await state.selectQuestionario(initialSelection); setInitialDialogOpen(false); };
  return <section className="ficha-anamnese-tab" aria-label="Ficha de Anamnese">
    <div className="ficha-anamnese-top"><label className="ficha-anamnese-field"><span>Nome do paciente:</span><input value={patientName || ''} readOnly /></label><AnamneseQuestionarioSelect items={state.questionarios} value={state.questionarioId} onChange={requestQuestionario} disabled={state.status === 'loading' || state.isSaving || !state.questionarios.length || Boolean(pendingQuestionario)} /></div>
    {state.status === 'error' ? <div className="ficha-anamnese-state ficha-anamnese-error">{state.error}</div> : state.status === 'loading' ? <div className="ficha-anamnese-state">Carregando perguntas...</div> : <AnamneseQuestionList items={state.itens} onChange={state.updateDraft} disabled={state.isSaving} />}
    <div className="ficha-anamnese-foot">{statusText}</div>
    <AnamnesePendingChangesDialog open={Boolean(pendingQuestionario)} saving={state.isSaving} error={state.error} onSave={saveAndContinue} onDiscard={discardAndContinue} onCancel={() => setPendingQuestionario(null)} />
    <Modal open={initialDialogOpen} title="Questionário de anamnese" onCancel={() => { setInitialSelection(''); setInitialDialogOpen(false); onInitialCancel?.(); }} onOk={confirmInitialQuestionnaire} okText="Ok" cancelText="Cancelar" okButtonProps={{ disabled: !initialSelection }} maskClosable={false}>
      <label className="ficha-anamnese-field"><span>Questionário:</span><select value={initialSelection} onChange={(event) => setInitialSelection(event.target.value)}><option value="">Selecione...</option>{state.questionarios.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
    </Modal>
  </section>;
});
