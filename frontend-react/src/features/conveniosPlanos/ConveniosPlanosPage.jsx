import { Alert, Card, Empty, Modal, Select, Typography, message } from 'antd';
import { useConveniosPlanos } from './hooks/useConveniosPlanos.js';
import { ConveniosTable } from './components/ConveniosTable.jsx';
import { PlanosTable } from './components/PlanosTable.jsx';
import './conveniosPlanos.css';
import { ConvenioModal } from './modals/ConvenioModal.jsx';
import { alterarCalendarioFaturamento, eliminarCalendarioFaturamento, eliminarConvenio, eliminarPlano } from './conveniosPlanosApi.js';
import { useEffect, useRef, useState } from 'react';
import { PlanoModal } from './modals/PlanoModal.jsx';
import { CalendarioFaturamentoTable } from './components/CalendarioFaturamentoTable.jsx';
import { CalendarioFaturamentoModal } from './modals/CalendarioFaturamentoModal.jsx';
import { useCalendarioFaturamento } from './hooks/useCalendarioFaturamento.js';
import { BranaModal } from '../../components/BranaModal.jsx';

export function ConveniosPlanosPage({
  convenioModalOpen = false,
  convenioModalMode = 'new',
  convenioModalRecord = null,
  convenioModalTab = 'principal',
  onCloseConvenioModal,
  onConvenioModalTabChange,
  onOpenEditConvenio,
  onConvenioSelectionChange,
  onPlanoSelectionChange,
  planoModalOpen = false,
  planoModalConvenio = null,
  onClosePlanoModal,
}) {
  const state = useConveniosPlanos();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletePlanTarget, setDeletePlanTarget] = useState(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planModalMode, setPlanModalMode] = useState('new');
  const [planModalRecord, setPlanModalRecord] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState(null);
  const [calendarConvenioRowId, setCalendarConvenioRowId] = useState(null);
  const [calendarNewOpen, setCalendarNewOpen] = useState(false);
  const [calendarEditRecord, setCalendarEditRecord] = useState(null);
  const [calendarDeleteTarget, setCalendarDeleteTarget] = useState(null);
  const [calendarDeleting, setCalendarDeleting] = useState(false);
  const deleteInFlight = useRef(false);
  const deletePlanInFlight = useRef(false);
  useEffect(() => { onPlanoSelectionChange?.(null); }, [onPlanoSelectionChange]);
  useEffect(() => {
    const request = () => {
      const target = state.convenios.find((item) => item.id === state.selectedConvenioId);
      if (target) { setCalendarTarget({ ...target }); setCalendarConvenioRowId(Number(target.id) || null); setCalendarOpen(true); }
    };
    window.addEventListener('brana-convenios-planos-calendar', request);
    return () => window.removeEventListener('brana-convenios-planos-calendar', request);
  }, [state.convenios, state.selectedConvenioId]);
  useEffect(() => {
    const request = () => { const target = state.convenios.find((item) => item.id === state.selectedConvenioId); if (target) setDeleteTarget(target); };
    window.addEventListener('brana-convenios-planos-delete', request);
    return () => window.removeEventListener('brana-convenios-planos-delete', request);
  }, [state.convenios, state.selectedConvenioId]);
  useEffect(() => {
    const request = () => { if (state.selectedConvenioId) setPlanModalOpen(true); };
    window.addEventListener('brana-convenios-planos-new-plan', request);
    return () => window.removeEventListener('brana-convenios-planos-new-plan', request);
  }, [state.selectedConvenioId]);
  useEffect(() => {
    const request = () => {
      const target = state.planosVisiveis.find((item) => item.id === state.selectedPlanoId);
      if (target) setDeletePlanTarget(target);
    };
    window.addEventListener('brana-convenios-planos-delete-plan', request);
    return () => window.removeEventListener('brana-convenios-planos-delete-plan', request);
  }, [state.planosVisiveis, state.selectedPlanoId]);
  useEffect(() => {
    const request = () => {
      const target = state.planosVisiveis.find((item) => item.id === state.selectedPlanoId);
      if (target) openEditPlano(target);
    };
    window.addEventListener('brana-convenios-planos-edit-plan', request);
    return () => window.removeEventListener('brana-convenios-planos-edit-plan', request);
  }, [state.planosVisiveis, state.selectedPlanoId]);
  const confirmDelete = async () => {
    if (!deleteTarget || deleteInFlight.current) return;
    deleteInFlight.current = true; setDeleting(true);
    try { await eliminarConvenio(deleteTarget.id); setDeleteTarget(null); await state.reload(); message.success('Convênio eliminado.'); }
    catch (error) { message.error(error?.message || 'Falha ao eliminar convênio.'); }
    finally { deleteInFlight.current = false; setDeleting(false); }
  };
  const confirmDeletePlan = async () => {
    if (!deletePlanTarget || deletePlanInFlight.current) return;
    deletePlanInFlight.current = true;
    try { await eliminarPlano(deletePlanTarget.id); setDeletePlanTarget(null); await state.reload(state.selectedConvenioId); onPlanoSelectionChange?.(null); message.success('Plano eliminado.'); }
    catch (error) { message.error(error?.message || 'Falha ao eliminar plano.'); }
    finally { deletePlanInFlight.current = false; }
  };
  const openEditCalendar = (record) => { if (!record) return; calendar.select(record.row_id); setCalendarEditRecord(record); setCalendarNewOpen(true); };
  const confirmDeleteCalendar = async () => {
    if (!calendarDeleteTarget || calendarDeleting) return;
    setCalendarDeleting(true);
    try { await eliminarCalendarioFaturamento(calendarDeleteTarget.row_id); setCalendarDeleteTarget(null); await calendar.reload(); calendar.select(null); message.success('Data de faturamento eliminada.'); }
    catch (error) { message.error(error?.message || 'Falha ao eliminar data de faturamento.'); }
    finally { setCalendarDeleting(false); }
  };
  const selectConvenio = (id) => { state.selectConvenio(id); onConvenioSelectionChange?.(state.convenios.find((item) => item.id === id) || null); onPlanoSelectionChange?.(null); };
  const openEdit = (record) => { state.selectConvenio(record.id); onConvenioSelectionChange?.(record); onOpenEditConvenio?.(record); };
  const selectPlano = (id) => { state.selectPlano(id); onPlanoSelectionChange?.(state.planosVisiveis.find((item) => item.id === id) || null); };
  const openEditPlano = (record) => { if (!record || record.convenioId !== state.selectedConvenioId) return; state.selectPlano(record.id); onPlanoSelectionChange?.(record); setPlanModalMode('edit'); setPlanModalRecord(record); setPlanModalOpen(true); };
  const selectedPlanConvenio = state.convenios.find((item) => item.id === state.selectedConvenioId) || null;
  const calendarTargetRowId = Number(calendarConvenioRowId || calendarTarget?.row_id || calendarTarget?.id || 0) || null;
  const calendar = useCalendarioFaturamento(calendarTargetRowId, calendarOpen);
  const closeCalendar = () => { if (!calendarNewOpen) { setCalendarOpen(false); setCalendarTarget(null); setCalendarConvenioRowId(null); } };
  const changeCalendarConvenio = (value) => { setCalendarConvenioRowId(Number(value) || null); calendar.select(null); setCalendarEditRecord(null); };
  return <><div className="convenios-planos-page"><Card className="convenios-planos-card"><div className="convenios-planos-section"><div className="convenios-planos-table-shell convenios-planos-section-title"><Typography.Text strong>Convênios e planos</Typography.Text></div><ConveniosTable items={state.convenios} loading={state.loading} selectedId={state.selectedConvenioId} onSelect={selectConvenio} onDoubleClick={openEdit} /></div><div className="convenios-planos-section convenios-planos-detail"><div className="convenios-planos-table-shell convenios-planos-section-title"><Typography.Text strong>Planos</Typography.Text></div>{!state.loading && !state.selectedConvenioId ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Selecione um convênio para consultar os planos." /> : <PlanosTable items={state.planosVisiveis} loading={state.loading} selectedId={state.selectedPlanoId} onSelect={selectPlano} onDoubleClick={openEditPlano} />}</div>{state.error ? <Alert type="error" showIcon message={state.error} action={<button type="button" className="convenios-planos-retry" onClick={() => void state.reload()}>Tentar novamente</button>} /> : null}</Card></div><ConvenioModal open={convenioModalOpen} mode={convenioModalMode} record={convenioModalRecord} activeTab={convenioModalTab} onTabChange={onConvenioModalTabChange} onClose={onCloseConvenioModal} onSaved={async (saved) => { const id = Number(saved?.row_id || saved?.id || convenioModalRecord?.id || 0) || null; await state.reload(id); }} /><PlanoModal open={planModalOpen} mode={planModalMode} record={planModalRecord} convenio={selectedPlanConvenio} onClose={() => { setPlanModalOpen(false); setPlanModalRecord(null); setPlanModalMode('new'); }} onSaved={async (saved, convenioRowId) => { const planoId = Number(saved?.row_id || saved?.id || 0) || null; await state.reload(convenioRowId, planoId); }} /><BranaModal open={calendarOpen} title="Configuração de calendário de faturamento" width={530} centered keyboard={false} maskClosable onCancel={closeCalendar} footer={null} rootClassName="convenios-planos-calendar-modal-root"><div className="convenios-planos-calendar-toolbar"><button type="button" className="auxiliary-shell-button" onClick={() => { setCalendarEditRecord(null); setCalendarNewOpen(true); }}>Novo</button><button type="button" className="auxiliary-shell-button" disabled={!calendar.selectedId} onClick={() => openEditCalendar(calendar.items.find((item) => Number(item.row_id) === Number(calendar.selectedId)))}>Altera</button><button type="button" className="auxiliary-shell-button" disabled={!calendar.selectedId} onClick={() => setCalendarDeleteTarget(calendar.items.find((item) => Number(item.row_id) === Number(calendar.selectedId)) || null)}>Elimina</button></div><div className="convenios-planos-calendar-filter"><label htmlFor="convenios-planos-calendar-convenio">Convênio:</label><Select id="convenios-planos-calendar-convenio" className="convenios-planos-calendar-convenio-select" aria-label="Convênio:" value={calendarTargetRowId || undefined} options={state.convenios.map((item) => ({ value: item.id, label: item.nome }))} onChange={changeCalendarConvenio} /></div>{calendar.error ? <Alert type="error" showIcon message={calendar.error} /> : null}<CalendarioFaturamentoTable items={calendar.items} loading={calendar.loading} selectedId={calendar.selectedId} onSelect={calendar.select} onDoubleClick={openEditCalendar} /><Typography.Text type="secondary">{calendar.items.length} {calendar.items.length === 1 ? 'data' : 'datas'}</Typography.Text></BranaModal><CalendarioFaturamentoModal open={calendarNewOpen} mode={calendarEditRecord ? 'edit' : 'new'} record={calendarEditRecord} convenioRowId={calendarTargetRowId} onClose={() => { setCalendarNewOpen(false); setCalendarEditRecord(null); }} onSaved={async (saved) => { const next = await calendar.reload(); const id = Number(saved?.row_id || saved?.id || calendarEditRecord?.row_id || 0) || null; if (id) calendar.select(id); else if (next.length) calendar.select(next[next.length - 1].row_id); }} /><Modal open={Boolean(calendarDeleteTarget)} title="Eliminar data de faturamento" onCancel={() => { if (!calendarDeleting) setCalendarDeleteTarget(null); }} onOk={() => void confirmDeleteCalendar()} okText="Eliminar" okType="danger" cancelText="Cancelar" confirmLoading={calendarDeleting} cancelButtonProps={{ disabled: calendarDeleting }} maskClosable={false} centered>Deseja eliminar esta data de faturamento?</Modal><Modal open={Boolean(deleteTarget)} title="Eliminar convênio" onCancel={() => { if (!deleting) setDeleteTarget(null); }} onOk={() => void confirmDelete()} okText="Eliminar" okType="danger" cancelText="Cancelar" confirmLoading={deleting} cancelButtonProps={{ disabled: deleting }} maskClosable={false} centered>Deseja eliminar o convênio '{String(deleteTarget?.nome || '').trim()}'?</Modal><Modal open={Boolean(deletePlanTarget)} title="Eliminar plano" onCancel={() => setDeletePlanTarget(null)} onOk={() => void confirmDeletePlan()} okText="Eliminar" okType="danger" cancelText="Cancelar" maskClosable={false} centered>Deseja eliminar o plano '{String(deletePlanTarget?.nome || '').trim()}'?</Modal></>;
}
