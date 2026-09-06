import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Input, InputNumber, Modal, Radio, Select, Tooltip, Tabs } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import './agendaEventModal.css';
import { listarPacientes, obterPaciente } from '../../pacientes/pacientesApi.js';
import { createAgendaEvent, deleteAgendaEvent, fetchAgendaCompromissoSubjects, repeatAgendaEvent, updateAgendaEvent } from '../api/agendaSemanalApi.js';
import { buildAgendaPayload, validateAgendaEditPayload } from '../utils/agendaEventPayload.js';
import { createRepeatState, saveBaseThenRepeat } from '../utils/agendaRepeatConfig.js';
import { AgendaDeleteConfirmModal } from './AgendaDeleteConfirmModal.jsx';

const PHONE_TYPES = ['Residencial', 'Comercial', 'Celular', 'Recado'];
const WEEKDAYS = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
function phoneTypeLabel(value, fallback) { if (typeof value === 'string' && PHONE_TYPES.includes(value)) return value; return PHONE_TYPES[Number(value) - 1] || fallback; }
function addMinutes(value, minutes) { const [hours, mins] = String(value || '00:00').split(':').map(Number); const total = (hours * 60) + mins + (Number(minutes) || 0); return `${String(Math.floor((total % 1440) / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`; }
function eventTime(event) { if (event?.start instanceof Date) return `${String(event.start.getHours()).padStart(2, '0')}:${String(event.start.getMinutes()).padStart(2, '0')}`; return String(event?.start || '').slice(11, 16); }
function eventDate(event) { if (event?.start instanceof Date) return `${event.start.getFullYear()}-${String(event.start.getMonth() + 1).padStart(2, '0')}-${String(event.start.getDate()).padStart(2, '0')}`; return String(event?.start || '').slice(0, 10); }
function createNewDraft(editor, initialDuration) { return { date: editor.context?.date || '', startTime: editor.context?.startTime || '', duration: editor.context?.duration || initialDuration || 5, room: '1', period: '', type: '1', name: '', status: '', subject: '', phones: ['', '', ''], phoneTypes: ['Residencial', 'Celular', 'Comercial'], observations: '', inclusion: '', change: '', eventId: '', patientId: '', patientIdExplicit: false, providerId: editor.context?.providerId || '', unitId: editor.context?.unitId || '' }; }
function createEditDraft(event) { const raw = event?.extendedProps?.metadata || {}; const props = event?.extendedProps || {}; const type = String(raw.tipo ?? props.type ?? ''); const startTime = eventTime(event); const rawDuration = Number(raw.hora_fim) > Number(raw.hora_inicio) ? (Number(raw.hora_fim) - Number(raw.hora_inicio)) / 60000 : Number(props.durationMinutes || 5); return { date: eventDate(event), startTime, duration: rawDuration || 5, room: raw.sala ?? '', period: '', type, name: type === '2' ? '' : (raw.nome || props.patientName || event.title || ''), status: raw.status == null ? (props.status == null ? '' : String(props.status)) : String(raw.status), subject: raw.motivo ?? '', phones: [raw.fone1 ?? '', raw.fone2 ?? '', raw.fone3 ?? ''], phoneTypes: [phoneTypeLabel(raw.tip_fone1, 'Residencial'), phoneTypeLabel(raw.tip_fone2, 'Celular'), phoneTypeLabel(raw.tip_fone3, 'Comercial')], observations: raw.observ ?? '', inclusion: raw.inclusao ?? raw.created_at ?? '', change: raw.alteracao ?? raw.updated_at ?? '', eventId: String(event.id), patientId: raw.patient_id ?? raw.nro_pac ?? props.patientId ?? '', patientIdExplicit: false, providerId: raw.id_prestador ?? props.providerId ?? '', unitId: raw.id_unidade ?? null, unitName: raw.unidade_nome ?? raw.unidade ?? '' }; }
function mapPatientToAgendaDraft(patient) { return { patientId: String(patient?.id ?? ''), name: String(patient?.nome_completo || patient?.nome || '').trim(), phones: [patient?.fone1 || '', patient?.fone2 || '', patient?.fone3 || ''], phoneTypes: [patient?.tipo_fone1 || 'Residencial', patient?.tipo_fone2 || 'Celular', patient?.tipo_fone3 || 'Comercial'], fone1: patient?.fone1 || '', fone2: patient?.fone2 || '', fone3: patient?.fone3 || '' }; }
function Field({ label, children, className = '' }) { return <label className={`agenda-event-modal__field ${className}`}><span>{label}:</span>{children}</label>; }
const phoneOptions = PHONE_TYPES.map((value) => ({ value, label: value }));
const typeOptions = [{ value: '1', label: 'Paciente' }, { value: '2', label: 'Compromisso' }];

function DataTab({ draft, setDraft, endTime, statusCatalog, subjectOptions, isNew, onPatientResolve, subjectRef }) {
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const updateArray = (key, index, value) => update(key, draft[key].map((item, itemIndex) => itemIndex === index ? value : item));
  const statusOptions = [{ value: '', label: ' ' }, ...statusCatalog.flatMap((item) => { const value = item.valor_int; if (value == null || Number(value) === 0) return []; return [{ value: String(value), label: item.label ?? item.descricao ?? item.name }]; })];
  const compromisso = draft.type === '2';
  return <div className="agenda-event-modal__data" role="tabpanel" aria-label="Dados do agendamento">
    <div className="agenda-event-modal__grid agenda-event-modal__grid--line1"><Field label="Data"><Input aria-label="Data" value={draft.date} readOnly className="agenda-event-modal__readonly" /></Field><Field label="Horário"><Input aria-label="Horário" value={draft.startTime} onChange={(e) => update('startTime', e.target.value)} /></Field><Field label="Duração"><InputNumber aria-label="Duração" min={5} step={5} value={Number(draft.duration) || 0} onChange={(value) => update('duration', value ?? '')} /></Field><Input aria-label="min" value="min" readOnly className="agenda-event-modal__unit" /><Field label="Sala"><InputNumber aria-label="Sala" value={draft.room === '' ? null : Number(draft.room)} onChange={(value) => update('room', value ?? '')} /></Field>{['manhã', 'tarde', 'dia todo'].map((period) => <Button key={period} type={draft.period === period ? 'primary' : 'default'} aria-label={period} aria-pressed={draft.period === period} onClick={() => update('period', period)}>{period}</Button>)}</div>
    <div className="agenda-event-modal__grid agenda-event-modal__grid--line2"><Field label="Tipo"><Select aria-label="Tipo" popupClassName="agenda-event-modal__select-dropdown" value={draft.type || undefined} options={typeOptions} onChange={(value) => update('type', value)} /></Field><Field label="Nome"><Input aria-label="Nome" disabled={compromisso} value={compromisso ? '' : draft.name} onChange={(e) => update('name', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onPatientResolve('enter'); } }} /></Field><Button aria-label="Pesquisar paciente" disabled={compromisso} onClick={() => onPatientResolve('ellipsis')}>...</Button></div>
    <div className="agenda-event-modal__grid agenda-event-modal__grid--line3"><Field label="Situação"><Select aria-label="Situação" popupClassName="agenda-event-modal__select-dropdown" virtual={false} disabled={compromisso} value={compromisso ? '' : draft.status} options={statusOptions} onChange={(value) => update('status', value)} /></Field><Field label="Assunto">{isNew && compromisso ? <Select ref={subjectRef} aria-label="Assunto" options={subjectOptions} value={draft.subject || undefined} onChange={(value) => update('subject', value)} /> : <Input aria-label="Assunto" value={draft.subject} onChange={(e) => update('subject', e.target.value)} />}</Field></div>
    <div className="agenda-event-modal__separator" /><div className="agenda-event-modal__lower"><div className="agenda-event-modal__group"><div className="agenda-event-modal__group-title">Telefones</div>{draft.phones.map((phone, index) => <div className="agenda-event-modal__phone-row" key={index}><Select aria-label={`Tipo telefone ${index + 1}`} value={draft.phoneTypes[index]} options={phoneOptions} onChange={(value) => updateArray('phoneTypes', index, value)} /><Input aria-label={`Telefone ${index + 1}`} value={phone} onChange={(e) => updateArray('phones', index, e.target.value)} /><Tooltip title="Abrir no WhatsApp"><Button className="agenda-event-modal__phone-button" type="text" icon={<WhatsAppOutlined />} aria-label={`WhatsApp ${index + 1}`} disabled /></Tooltip></div>)}</div><Field label="Observações" className="agenda-event-modal__observations-field"><Input.TextArea aria-label="Observações" value={draft.observations} onChange={(e) => update('observations', e.target.value)} className="agenda-event-modal__observations" /></Field></div>
    <div className="agenda-event-modal__separator" /><div className="agenda-event-modal__grid agenda-event-modal__grid--audit"><Field label="Inclusão"><Input aria-label="Inclusão" value={draft.inclusion} readOnly className="agenda-event-modal__readonly" /></Field><Field label="Alteração"><Input aria-label="Alteração" value={draft.change} readOnly className="agenda-event-modal__readonly" /></Field></div><span data-testid="agenda-event-end" hidden>{endTime}</span><span data-testid="agenda-event-is-new" hidden>{String(isNew)}</span>
  </div>;
}

function RepeatTab({ value, onChange }) { const state = value || createRepeatState(); const disabled = !state.enabled; const update = (key, next) => onChange((current) => ({ ...current, [key]: next })); return <div className="agenda-event-modal__repeat" role="tabpanel" aria-label="Repete agendamento"><Checkbox checked={state.enabled} onChange={(e) => update('enabled', e.target.checked)}>Repete horário</Checkbox><div className="agenda-event-modal__group agenda-event-modal__repeat-group"><Radio.Group value={state.mode} onChange={(e) => update('mode', e.target.value)} disabled={disabled}><div className="agenda-event-modal__repeat-row"><Radio value="dias">Próximos</Radio><InputNumber aria-label="Quantidade de dias" min={1} max={60} value={state.days} onChange={(next) => update('days', next ?? 1)} disabled={disabled || state.mode !== 'dias'} /> dias</div><div className="agenda-event-modal__repeat-row"><Radio value="semanas">Próximas</Radio><InputNumber aria-label="Quantidade de semanas" min={1} max={60} value={state.weeks} onChange={(next) => update('weeks', next ?? 1)} disabled={disabled || state.mode !== 'semanas'} /><Select aria-label="Dia da semana" value={state.weekday} options={WEEKDAYS.map((day, index) => ({ value: index + 1, label: day }))} disabled={disabled || state.mode !== 'semanas'} onChange={(next) => update('weekday', next)} /></div><div className="agenda-event-modal__repeat-row"><Radio value="meses">Todo o dia</Radio><InputNumber aria-label="Dia do mês" min={1} max={31} value={state.monthDay} onChange={(next) => update('monthDay', next ?? 1)} disabled={disabled || state.mode !== 'meses'} /> dos próximos <InputNumber aria-label="Quantidade de meses" min={1} max={60} value={state.months} onChange={(next) => update('months', next ?? 1)} disabled={disabled || state.mode !== 'meses'} /> meses</div></Radio.Group></div><Checkbox aria-label="Sobrepor horários já preenchidos" checked={state.overwrite} onChange={(e) => update('overwrite', e.target.checked)} disabled={disabled}>Sobrepor horários já preenchidos</Checkbox></div>; }

export function AgendaEventModal({ editor, onCancel, onNew, initialTab = 'dados', initialDuration = 5, statusCatalog = [], providerId = '', unitId = '', onCreated }) {
  const PERSISTENCE_NOT_ENABLED = true;
  const isNew = editor?.mode === 'novo';
  const event = editor?.event;
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState('dados');
  const [patientSearchRequested, setPatientSearchRequested] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);
  const [patientSearchError, setPatientSearchError] = useState('');
  const [patientSearchSelectedId, setPatientSearchSelectedId] = useState(null);
  const [unknownPatient, setUnknownPatient] = useState(null);
  const [unknownDecision, setUnknownDecision] = useState('new');
  const [resolvingPatient, setResolvingPatient] = useState(false);
  const [nonRegisteredConfirmed, setNonRegisteredConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [repeatState, setRepeatState] = useState(() => createRepeatState());
  const subjectRef = useRef(null);

  useEffect(() => {
    setPatientSearchRequested(false);
    setPatientSearchQuery('');
    setPatientSearchResults([]);
    setPatientSearchError('');
    setPatientSearchSelectedId(null);
    setUnknownPatient(null);
    setUnknownDecision('new');
    setNonRegisteredConfirmed(false);
    setSubmitError('');
    setDeleteConfirmOpen(false);
    setSubjectOptions([]);
    if (!editor) { setDraft(null); return; }
    setActiveTab(initialTab === 'repete' ? 'repete' : 'dados');
    const nextDraft = editor.mode === 'novo' ? createNewDraft(editor, initialDuration) : createEditDraft(event);
    setRepeatState(createRepeatState(nextDraft.date));
    setDraft(nextDraft);
  }, [editor, event, initialDuration, initialTab]);

  useEffect(() => {
    if (!isNew) return undefined;
    const controller = new AbortController();
    fetchAgendaCompromissoSubjects({ signal: controller.signal })
      .then((items) => setSubjectOptions((items || []).map((item) => {
        const label = String(item.descricao ?? item.nome ?? item.motivo ?? '').trim();
        return { value: label, label };
      }).filter((item) => item.value)))
      .catch((reason) => { if (reason.name !== 'AbortError') setSubjectOptions([]); });
    return () => controller.abort();
  }, [isNew]);

  useEffect(() => {
    if (!patientSearchRequested) return undefined;
    const controller = new AbortController();
    setPatientSearchLoading(true);
    setPatientSearchError('');
    listarPacientes(patientSearchQuery)
      .then((items) => setPatientSearchResults(Array.isArray(items) ? items : []))
      .catch((reason) => { if (reason.name !== 'AbortError') { setPatientSearchResults([]); setPatientSearchError(reason?.message || 'Falha ao carregar pacientes.'); } })
      .finally(() => { if (!controller.signal.aborted) setPatientSearchLoading(false); });
    return () => controller.abort();
  }, [patientSearchRequested, patientSearchQuery]);

  useEffect(() => {
    if (!isNew || !draft || draft.type !== '2') return;
    setDraft((current) => ({ ...current, patientId: '', name: '', status: '' }));
    subjectRef.current?.focus?.();
  }, [isNew, draft?.type]);

  const endTime = useMemo(() => draft ? addMinutes(draft.startTime, draft.duration) : '', [draft]);
  if (!editor || !draft) return null;

  const closePatientSearch = () => setPatientSearchRequested(false);
  const resolvePatientName = async (trigger = 'enter') => {
    if (draft.type !== '1' || (trigger !== 'ellipsis' && draft.patientId)) return;
    if (trigger === 'ellipsis') {
      setPatientSearchQuery(draft.name || '');
      setPatientSearchSelectedId(null);
      setPatientSearchRequested(true);
      return;
    }
    if (!draft.name.trim() || nonRegisteredConfirmed) return;
    setResolvingPatient(true);
    try {
      const result = await listarPacientes(draft.name);
      const exactMatch = (Array.isArray(result) ? result : []).find((patient) => String(patient.nome_completo || patient.nome || '').trim().toLocaleLowerCase() === draft.name.trim().toLocaleLowerCase());
      if (!exactMatch) { setUnknownDecision('new'); setUnknownPatient(draft.name); }
    } finally {
      setResolvingPatient(false);
    }
  };
  const selectPatient = async (patient) => {
    const patientId = Number(patient?.id || 0) || 0;
    if (!patientId) return;
    setPatientSearchSelectedId(patientId);
    try {
      const detail = await obterPaciente(patientId);
      setDraft((current) => ({ ...current, ...mapPatientToAgendaDraft(detail || patient), patientIdExplicit: true }));
    } catch {
      setDraft((current) => ({ ...current, ...mapPatientToAgendaDraft(patient), patientIdExplicit: true }));
    }
    closePatientSearch();
  };
  const confirmUnknownDecision = () => { if (unknownDecision === 'new') { setNonRegisteredConfirmed(true); setUnknownPatient(null); } else { setUnknownPatient(null); setPatientSearchRequested(true); } };
  const submitNew = async () => {
    if (!isNew || submitting || !draft.date || !draft.startTime) return;
    if (draft.type === '1' && draft.name.trim() && !draft.patientId && !nonRegisteredConfirmed) return;
    setSubmitting(true);
    try {
      const created = await saveBaseThenRepeat({
        saveBase: () => createAgendaEvent(buildAgendaPayload(draft, { mode: 'new', providerId, unitId })),
        repeat: repeatAgendaEvent,
        repeatState,
      });
      onCreated?.(created);
      onCancel();
    } catch (reason) {
      setUnknownPatient(null);
    } finally { setSubmitting(false); }
  };
  const submitEdit = async () => {
    if (isNew || submitting) return;
    const payload = buildAgendaPayload(draft, { mode: 'edit', providerId: draft.providerId, unitId });
    if (!validateAgendaEditPayload(payload, draft.eventId)) {
      setSubmitError('Não foi possível validar os dados do agendamento.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const updated = await saveBaseThenRepeat({
        saveBase: () => updateAgendaEvent(draft.eventId, payload),
        repeat: repeatAgendaEvent,
        repeatState,
        itemId: draft.eventId,
      });
      onCreated?.(updated);
      onCancel();
    } catch (reason) {
      setSubmitError(reason?.message || 'Falha ao alterar o agendamento.');
    } finally { setSubmitting(false); }
  };
  const requestDelete = () => {
    if (isNew || submitting || !draft.eventId) return;
    setDeleteConfirmOpen(true);
  };
  const submitDelete = async () => {
    if (isNew || submitting || !draft.eventId) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await deleteAgendaEvent(draft.eventId);
      setDeleteConfirmOpen(false);
      onCreated?.();
      onCancel();
    } catch (reason) {
      setSubmitError(reason?.message || 'Falha ao eliminar o agendamento.');
    } finally { setSubmitting(false); }
  };
  const items = [{ key: 'dados', label: 'Dados do agendamento', children: <DataTab draft={draft} setDraft={setDraft} endTime={endTime} statusCatalog={statusCatalog} subjectOptions={subjectOptions} isNew={isNew} onPatientResolve={resolvePatientName} subjectRef={subjectRef} /> }, { key: 'repete', label: 'Repete agendamento', children: <RepeatTab value={repeatState} onChange={setRepeatState} /> }];
  return <>
    <Modal open title={isNew ? 'Edita agendamento' : 'Editar agendamento'} className="agenda-event-modal" width={608} centered maskClosable={false} destroyOnClose footer={null} onCancel={onCancel} styles={{ body: { padding: 0 } }}>
        <div data-testid="agenda-event-editor-mode" data-mode={isNew ? 'novo' : 'edição'} data-persistence-enabled="true">
        <Tabs type="card" activeKey={activeTab} onChange={setActiveTab} items={items} className="agenda-event-modal__tabs" />
        {patientSearchRequested ? <Modal open title="Pesquisar paciente" width={690} footer={null} destroyOnClose onCancel={closePatientSearch}><Input aria-label="Pesquisar nome do paciente" value={patientSearchQuery} onChange={(event) => setPatientSearchQuery(event.target.value)} autoFocus />{patientSearchLoading ? <div>Carregando pacientes...</div> : patientSearchError ? <div role="alert">{patientSearchError}</div> : patientSearchResults.length ? <table><thead><tr><th>Código</th><th>Nome</th></tr></thead><tbody>{patientSearchResults.map((patient) => <tr key={String(patient.id)} className={Number(patientSearchSelectedId) === Number(patient.id) ? 'selected' : ''} onClick={() => setPatientSearchSelectedId(Number(patient.id))} onDoubleClick={() => selectPatient(patient)}><td>{patient.codigo ?? '-'}</td><td>{patient.nome_completo || patient.nome || ''}</td></tr>)}</tbody></table> : <div>Nenhum paciente encontrado</div>}<div><Button disabled={!patientSearchSelectedId} onClick={() => selectPatient(patientSearchResults.find((patient) => Number(patient.id) === Number(patientSearchSelectedId)))}>Ok</Button><Button onClick={closePatientSearch}>Cancela</Button></div></Modal> : null}
        {submitError ? <div role="alert">{submitError}</div> : null}
        <footer className="agenda-event-modal__footer"><Button disabled={submitting} onClick={() => onNew?.()}>Novo</Button><Button disabled={isNew || !draft.eventId || submitting} onClick={requestDelete}>Elimina</Button><Button loading={resolvingPatient || submitting} onClick={isNew ? submitNew : submitEdit}>Ok</Button><Button onClick={onCancel}>Cancela</Button></footer>
      </div>
    </Modal>
    <AgendaDeleteConfirmModal open={deleteConfirmOpen} event={event} label={draft?.name || 'Sem nome'} submitting={submitting} onConfirm={submitDelete} onCancel={() => setDeleteConfirmOpen(false)} />
    <Modal open={Boolean(unknownPatient)} title={null} className="agenda-event-modal agenda-event-modal__unknown-patient" width={430} centered closable={false} maskClosable={false} footer={null}>
      <div className="agenda-event-modal__unknown-patient-body" role="alertdialog" aria-label="Paciente não encontrado">
        <p>O paciente {unknownPatient} não foi encontrado no cadastro de pacientes.</p><p>Você deseja:</p>
        <Radio.Group aria-label="Decisão para paciente não encontrado" value={unknownDecision} onChange={(e) => setUnknownDecision(e.target.value)}><div><Radio value="new">Agendá-lo como um novo paciente</Radio></div><div><Radio value="search">Procurá-lo no cadastro de pacientes</Radio></div></Radio.Group>
        <div className="agenda-event-modal__unknown-patient-actions">
          <Button type="primary" autoFocus onClick={confirmUnknownDecision}>Ok</Button><Button onClick={() => setUnknownPatient(null)}>Cancela</Button>
        </div>
      </div>
    </Modal>
  </>;
}
