import { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { FichaPessoalTabs } from './FichaPessoalTabs.jsx';
import { FichaPessoalToolbar } from './FichaPessoalToolbar.jsx';
import { DadosPessoaisTab } from './DadosPessoaisTab.jsx';
import { useFichaPessoalForm } from './useFichaPessoalForm.js';
import { HistoricoPacienteView } from '../../../historicoPaciente/components/HistoricoPacienteView.jsx';
import { DadosComplementaresTab } from './dadosComplementares/DadosComplementaresTab.jsx';
import './fichaPessoal.css';

const tabContent = {
  dados: 'Dados pessoais sera implementado na etapa seguinte.',
  complementares: 'Dados complementares sera implementado na etapa seguinte.',
  anotacoes: 'Anotacoes sera implementado na etapa seguinte.',
};

export function FichaPessoalModal({ open, onClose, patientId = null, mode = 'new' }) {
  const [activeTab, setActiveTab] = useState('dados');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const historicoRef = useRef(null);
  const ficha = useFichaPessoalForm(open, mode, patientId);


  useEffect(() => {
    if (open) {
      setActiveTab('dados');
      setDeleteConfirmOpen(false);
    }
  }, [open, mode, patientId]);

  const confirmDelete = () => setDeleteConfirmOpen(true);
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
        onCancel={onClose}
        footer={null}
        width={820}
        centered
        destroyOnClose
        maskClosable={false}
        keyboard
        className="ficha-pessoal-modal"
        styles={{ body: { padding: 0 } }}
      >
        <FichaPessoalToolbar onClose={onClose} onSave={async () => { const historySaved = await historicoRef.current?.flushPending?.(); if (historySaved === false) return; const saved = await ficha.save(); if (saved) window.dispatchEvent(new CustomEvent('brana-paciente-created')); }} onDelete={confirmDelete} saving={ficha.saving} deleting={ficha.deleting} isNew={ficha.isNew} dirty={ficha.dirty} />
        <FichaPessoalTabs activeTab={activeTab} onChange={setActiveTab} hasPersistedPaciente={ficha.hasPersistedPaciente} />
        <div className="ficha-pessoal-content" role="tabpanel">
          {ficha.loading && mode === 'existing' ? <div className="ficha-pessoal-placeholder">Carregando paciente...</div> : activeTab === 'dados' ? <DadosPessoaisTab {...ficha} /> : activeTab === 'complementares' ? <DadosComplementaresTab value={{ ...ficha.form.complementares, matricula: ficha.form.matricula }} onChange={(value) => { const { matricula, ...extra } = value; ficha.setField('matricula', matricula); ficha.setComplementares(extra); }} catalogs={ficha.complementaryCatalogs} loading={ficha.loading} lookupCep={ficha.lookupCepCommercial} cepLookupLoading={ficha.cepLookupLoading} cepLookupError={ficha.cepLookupError} surname={ficha.form.sobrenome} nameSuggestions={ficha.nameSuggestions} nameSuggestionsLoading={ficha.nameSuggestionsLoading} buscarSugestoesSobrenome={ficha.buscarSugestoesSobrenome} selecionarResponsavel={ficha.selecionarResponsavel} /> : activeTab === 'historico' ? <HistoricoPacienteView ref={historicoRef} pacienteId={ficha.pacienteId} enabled={ficha.hasPersistedPaciente} activeTab={activeTab} fichaOpen={open} /> : <div className="ficha-pessoal-placeholder">{tabContent[activeTab] || 'Esta aba estara disponivel apos o salvamento do paciente.'}</div>}
        </div>
        <div className="ficha-pessoal-status">{tabsLabel(activeTab)}</div>
      </Modal>
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
