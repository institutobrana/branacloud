import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { HistoricoPacienteToolbar } from './HistoricoPacienteToolbar.jsx';
import { HistoricoPacienteTable } from './HistoricoPacienteTable.jsx';
import { useHistoricoPaciente } from '../hooks/useHistoricoPaciente.js';
import '../historicoPaciente.css';
import { criarHistoricoPaciente, atualizarHistoricoInline, atualizarHistoricoPropriedades, eliminarHistoricoPaciente } from '../historicoPacienteApi.js';
import { listarPrestadores } from '../../prestadores/prestadoresApi.js';
import { HistoricoPacientePropertiesModal } from './HistoricoPacientePropertiesModal.jsx';
import { handleHistoricoEditorKeyDown, resolveCurrentPrestador } from '../historicoPacienteUtils.js';
import { useAuth } from '../../auth/AuthProvider.jsx';

export const HistoricoPacienteView = forwardRef(function HistoricoPacienteView({ pacienteId, enabled, activeTab = 'historico', fichaOpen = true }, ref) {
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [prestadores, setPrestadores] = useState([]);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { user } = useAuth();
  const history = useHistoricoPaciente({ pacienteId, enabled });
  const selected = history.items.find((item) => (item.id ?? item.row_id) === selectedId);
  useEffect(() => { setSelectedId(null); setEditingId(null); setDraft(null); }, [enabled, pacienteId]);
  useEffect(() => { if (!enabled) return; listarPrestadores().then(setPrestadores).catch(() => setPrestadores([])); }, [enabled]);
  const currentPrestador = resolveCurrentPrestador(user, prestadores);
  const today = new Date().toISOString().slice(0, 10);
  const createDraft = () => {
    if (editingId || draft) return;
    if (!currentPrestador) { setValidationError('O usuário autenticado não possui prestador responsável vinculado.'); return; }
    setValidationError('');
    setDraft({ data: today, regiao: '', descricao: '', cor: 16777215, prestador_id: currentPrestador.id, prestador_apelido: currentPrestador.apelido, prestador_nome: currentPrestador.nome });
  };
  const startEdit = (item) => { const target = item || selected; if (!target || draft) return; setValidationError(''); setSelectedId(target.id); setEditingId(target.id); setDraft({ ...target }); };
  const validate = (value) => { if (!String(value?.descricao || '').trim()) { setValidationError('Campo descrição do procedimento não pode ser nulo.'); return false; } setValidationError(''); return true; };
  const persist = async () => {
    if (!draft) return null;
    if (!validate(draft)) return false;
    const creating = !editingId;
    setActionLoading(true);
    try {
      if (editingId) await atualizarHistoricoInline(pacienteId, editingId, { data: draft.data, regiao: draft.regiao || null, descricao: draft.descricao });
      else await criarHistoricoPaciente(pacienteId, { data: draft.data, regiao: draft.regiao || null, descricao: draft.descricao });
      setEditingId(null);
      setDraft(creating ? { data: today, regiao: '', descricao: '', cor: 16777215, prestador_id: currentPrestador.id, prestador_apelido: currentPrestador.apelido, prestador_nome: currentPrestador.nome } : null);
      history.refresh();
      return true;
    } catch (error) { return false; } finally { setActionLoading(false); }
  };
  const cancelEdit = () => { setEditingId(null); setDraft(null); };
  const handleKeyDown = (event) => handleHistoricoEditorKeyDown(event, { onEnter: persist, onEscape: cancelEdit });
  const openDelete = () => {
    if (selectedId) setDeleteOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedId) return;
    setPropertiesOpen(false);
    setActionLoading(true);
    try {
      await eliminarHistoricoPaciente(pacienteId, selectedId);
      setSelectedId(null);
      setDeleteOpen(false);
      history.refresh();
    } finally { setActionLoading(false); }
  };
  const saveProperties = async (value) => {
    if (!selected || !validate(value)) return;
    setActionLoading(true);
    try {
      await atualizarHistoricoPropriedades(pacienteId, selected.id, { ...value, regiao: value.regiao || null });
      setPropertiesOpen(false);
      history.refresh();
    } finally { setActionLoading(false); }
  };
  const openProperties = () => {
    setPropertiesOpen(true);
  };
  useImperativeHandle(ref, () => ({ flushPending: persist }));

  return (
    <section className="historico-paciente-view" aria-label="Histórico do paciente">
      <HistoricoPacienteToolbar hasSelection={Boolean(selected)} disabled={actionLoading || Boolean(draft) || !currentPrestador} onInsert={createDraft} onEdit={() => startEdit()} onDelete={openDelete} onProperties={openProperties} />
      {validationError ? <div className="historico-paciente-inline-error" role="alert">{validationError}</div> : null}
      {history.loading ? <div className="historico-paciente-state">Carregando histórico...</div> : history.error ? <div className="historico-paciente-state is-error" role="alert">{history.error}</div> : (
        <HistoricoPacienteTable
          items={history.items}
          selectedId={selectedId}
          onSelect={(item) => setSelectedId(item.id ?? item.row_id)}
          sortOrder={history.sortOrder}
          onToggleSort={() => history.setSortOrder(history.sortOrder === 'asc' ? 'desc' : 'asc')}
          editingId={editingId} draft={draft} onChange={(field, value) => setDraft((current) => ({ ...current, [field]: value }))} onKeyDown={handleKeyDown} onDoubleClick={startEdit}
        />
      )}
      <HistoricoPacientePropertiesModal open={propertiesOpen} item={selected} prestadores={prestadores} loading={actionLoading} onCancel={() => setPropertiesOpen(false)} onSave={saveProperties} />
      <Modal
        open={deleteOpen}
        title="Confirma a eliminação do histórico?"
        onCancel={() => setDeleteOpen(false)}
        footer={[
          <Button key="yes" type="primary" loading={actionLoading} onClick={confirmDelete}>Sim</Button>,
          <Button key="no" disabled={actionLoading} onClick={() => setDeleteOpen(false)}>Não</Button>,
        ]}
      />
    </section>
  );
});
