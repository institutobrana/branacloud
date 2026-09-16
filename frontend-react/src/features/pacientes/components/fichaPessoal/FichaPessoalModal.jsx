import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { FichaPessoalTabs } from './FichaPessoalTabs.jsx';
import { FichaPessoalToolbar } from './FichaPessoalToolbar.jsx';
import { DadosPessoaisTab } from './DadosPessoaisTab.jsx';
import { useFichaPessoalForm } from './useFichaPessoalForm.js';
import { HistoricoPacienteView } from '../../../historicoPaciente/components/HistoricoPacienteView.jsx';
import { DadosComplementaresTab } from './dadosComplementares/DadosComplementaresTab.jsx';
import { AnotacoesTab } from './anotacoes/AnotacoesTab.jsx';
import { AnamneseTab } from './anamnese/AnamneseTab.jsx';
import { AnamnesePendingChangesDialog } from './anamnese/AnamnesePendingChangesDialog.jsx';
import './fichaPessoal.css';

const tabContent = {
  dados: 'Dados pessoais sera implementado na etapa seguinte.',
  complementares: 'Dados complementares sera implementado na etapa seguinte.',
  anotacoes: 'Anotacoes sera implementado na etapa seguinte.',
};

export function FichaPessoalModal({ open, onClose, onCreated, onSaved, patientId = null, mode = 'new' }) {
  const [activeTab, setActiveTab] = useState('dados');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [anamneseStatus, setAnamneseStatus] = useState({ isDirty: false, isSaving: false });
  const historicoRef = useRef(null);
  const anamneseRef = useRef(null);
  const anamneseStateRef = useRef({ hasPendingChanges: false, discardDraft: () => {}, savePendingAnamnese: async () => true });
  const [anamneseSaveError, setAnamneseSaveError] = useState('');
  const ficha = useFichaPessoalForm(open, mode, patientId);



  useEffect(() => {
    if (open) {
      setActiveTab('dados');
      setDeleteConfirmOpen(false);
      setPendingNavigation(null);
      setAnamneseStatus({ isDirty: false, isSaving: false });
      anamneseStateRef.current = { hasPendingChanges: false, isSaving: false, discardDraft: () => {}, savePendingAnamnese: async () => true };
    }
  }, [open, mode, patientId]);

  const handleAnamneseStateChange = useCallback((value) => {
    anamneseStateRef.current = value;
    setAnamneseStatus({ isDirty: Boolean(value?.isDirty), isSaving: Boolean(value?.isSaving) });
  }, []);

  const confirmDelete = () => setDeleteConfirmOpen(true);
  const handleTabChange = (nextTab) => {
    if (activeTab === 'anamnese' && anamneseRef.current?.hasPendingChanges?.()) {
      setPendingNavigation({ type: 'tab', value: nextTab });
      return;
    }
    setActiveTab(nextTab);
  };
  const requestCloseFicha = () => {
    if (activeTab === 'anamnese' && anamneseRef.current?.hasPendingChanges?.()) {
      setPendingNavigation({ type: 'close' });
      return;
    }
    onClose();
  };
  const discardAndNavigate = () => {
    anamneseStateRef.current.discardDraft();
    const navigation = pendingNavigation;
    setPendingNavigation(null);
    if (navigation?.type === 'close') onClose();
    else if (navigation?.value) setActiveTab(navigation.value);
  };
  const saveAndNavigate = async () => {
    setAnamneseSaveError('');
    const saved = await anamneseStateRef.current.savePendingAnamnese();
    if (saved) {
      const navigation = pendingNavigation;
      setPendingNavigation(null);
      if (navigation?.type === 'close') onClose();
      else if (navigation?.value) setActiveTab(navigation.value);
    } else setAnamneseSaveError('Falha ao gravar respostas da Anamnese.');
  };
  const saveWithAnamnese = async () => {
    setAnamneseSaveError('');
    if (!(await anamneseStateRef.current.savePendingAnamnese())) { setAnamneseSaveError('Falha ao gravar respostas da Anamnese.'); return; }
    const historySaved = await historicoRef.current?.flushPending?.();
    if (historySaved === false) return;
    const saved = await ficha.save();
    if (saved) {
      window.dispatchEvent(new CustomEvent('brana-paciente-created', { detail: saved }));
      if (mode === 'new') onCreated?.(saved);
      else onSaved?.(saved);
    }
  };
  const executeDelete = async () => {
    const deleted = await ficha.remove();
    if (!deleted) return;
    setDeleteConfirmOpen(false);
    window.dispatchEvent(new CustomEvent('brana-paciente-deleted'));
    onClose();
  };
  const deleteName = String(ficha.form.nome || '').trim() || `#${ficha.form.codigo || ''}`;

  return (
    <>
      <Modal
        open={open}
        title={`Ficha pessoal -${mode === 'existing' && ficha.loading ? '' : ficha.isNew ? '' : ` ${ficha.form.nome || ''}`}`}
        onCancel={requestCloseFicha}
        footer={null}
        width={820}
        centered
        destroyOnClose
        maskClosable={false}
        keyboard
        className="ficha-pessoal-modal"
        styles={{ body: { padding: 0 } }}
      >
        <FichaPessoalToolbar onClose={requestCloseFicha} onSave={saveWithAnamnese} onDelete={confirmDelete} saving={ficha.saving || anamneseStatus.isSaving} deleting={ficha.deleting} isNew={ficha.isNew} dirty={ficha.dirty || anamneseStatus.isDirty} />
        <FichaPessoalTabs activeTab={activeTab} onChange={handleTabChange} hasPersistedPaciente={ficha.hasPersistedPaciente} />
        <div className="ficha-pessoal-content" role="tabpanel">
          {ficha.loading && mode === 'existing' ? <div className="ficha-pessoal-placeholder">Carregando paciente...</div> : activeTab === 'dados' ? <DadosPessoaisTab {...ficha} /> : activeTab === 'complementares' ? <DadosComplementaresTab value={{ ...ficha.form.complementares, matricula: ficha.form.matricula }} onChange={(value) => { const { matricula, ...extra } = value; ficha.setField('matricula', matricula); ficha.setComplementares(extra); }} catalogs={ficha.complementaryCatalogs} loading={ficha.loading} lookupCep={ficha.lookupCepCommercial} cepLookupLoading={ficha.cepLookupLoading} cepLookupError={ficha.cepLookupError} surname={ficha.form.sobrenome} nameSuggestions={ficha.nameSuggestions} nameSuggestionsLoading={ficha.nameSuggestionsLoading} buscarSugestoesSobrenome={ficha.buscarSugestoesSobrenome} selecionarResponsavel={ficha.selecionarResponsavel} /> : activeTab === 'anotacoes' ? <AnotacoesTab content={ficha.form.anotacoes} onChange={(value) => ficha.setField('anotacoes', value)} /> : activeTab === 'anamnese' ? <AnamneseTab ref={anamneseRef} pacienteId={ficha.pacienteId} patientName={[ficha.form.nome, ficha.form.sobrenome].filter(Boolean).join(' ')} onDirtyStateChange={handleAnamneseStateChange} onInitialCancel={() => setActiveTab('dados')} /> : activeTab === 'historico' ? <HistoricoPacienteView ref={historicoRef} pacienteId={ficha.pacienteId} enabled={ficha.hasPersistedPaciente} activeTab={activeTab} fichaOpen={open} /> : <div className="ficha-pessoal-placeholder">{tabContent[activeTab] || 'Esta aba estara disponivel apos o salvamento do paciente.'}</div>}
        </div>
        <div className="ficha-pessoal-status">{tabsLabel(activeTab)}</div>
      </Modal>
      <AnamnesePendingChangesDialog open={Boolean(pendingNavigation)} saving={anamneseStateRef.current.isSaving} error={anamneseSaveError} onSave={saveAndNavigate} onDiscard={discardAndNavigate} onCancel={() => setPendingNavigation(null)} />
      <Modal
        open={deleteConfirmOpen}
        title="Eliminar paciente"
        onCancel={() => setDeleteConfirmOpen(false)}
        onOk={executeDelete}
        okText="Eliminar"
        cancelText="Cancelar"
        okButtonProps={{ danger: true, loading: ficha.deleting }}
        cancelButtonProps={{ disabled: ficha.deleting }}
        maskClosable={false}
        centered
      >
        Deseja eliminar o paciente '{deleteName}'?
      </Modal>
    </>
  );
}

function tabsLabel(activeTab) {
  return {
    dados: 'Dados pessoais',
    complementares: 'Dados complementares',
    anotacoes: 'Anotacoes',
    anamnese: 'Anamnese',
    historico: 'Histórico',
  }[activeTab] || 'Dados pessoais';
}
