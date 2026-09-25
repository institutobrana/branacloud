import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Empty, Input, Modal, Select, Spin, Table } from 'antd';
import { useCallback } from 'react';
import { editorTextosApi } from '../api/editorTextosApi.js';
import { getPatientDisplayName } from '../models/recipeAssistantFlow.js';
import { normalizeAttestadoTime } from '../models/atestadoAssistant.js';
import { PacientesAlphabet } from '../../pacientes/components/PacientesAlphabet.jsx';
import { DateField } from '../../pacientes/components/fichaPessoal/DadosPessoaisTab.jsx';
import './EditorTextosAtestadoAssistantModal.css';

function patientIdOf(patient) {
  return Number(patient?.id ?? patient?.patientId ?? patient?.nro_pac ?? 0) || null;
}

function maskTime(value) {
  return String(value || '').replace(/[^\d:]/g, '').slice(0, 5);
}

function AttestadoTimeField({ label, value, onChange }) {
  const commit = () => onChange(normalizeAttestadoTime(value));
  const handleKeyDown = (event) => {
    if (event.key === 'Tab') commit();
  };

  return <Input className="editor-textos-attestado-assistant__time-input" aria-label={label} inputMode="numeric" maxLength={5} placeholder="00:00" value={value}
    onChange={(event) => onChange(maskTime(event.target.value))}
    onKeyDown={handleKeyDown} onBlur={commit} />;
}

export function EditorTextosAtestadoAssistantModal({ open, patient, onSelectPatient, onConfirm, onCancel }) {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cidOpen, setCidOpen] = useState(false);
  const [cidItems, setCidItems] = useState([]);
  const [cidLoading, setCidLoading] = useState(false);
  const [cidError, setCidError] = useState('');
  const [cidQuery, setCidQuery] = useState('');
  const [cidLetter, setCidLetter] = useState('*');
  const [preferredOnly, setPreferredOnly] = useState(false);
  const [selectedCid, setSelectedCid] = useState(null);
  const [surgeonId, setSurgeonId] = useState(undefined);
  const [modelId, setModelId] = useState(undefined);
  const [fields, setFields] = useState({ startDate: '', endDate: '', startTime: '', endTime: '', reasonId: undefined, cid: null, observations: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setLoading(true);
    setError('');
    setSubmitError('');
    editorTextosApi.getAtestadoAssistantContext({ patientId: patientIdOf(patient) })
      .then((data) => {
        if (!active) return;
        setContext(data || {});
        setSurgeonId(data?.cirurgiao_padrao_id || undefined);
        setModelId(data?.modelo_padrao_id || undefined);
        setFields({ startDate: data?.data_inicial_padrao || '', endDate: '', startTime: '', endTime: '', reasonId: undefined, cid: null, observations: '' });
      })
      .catch((cause) => { if (active) { setContext(null); setError(cause?.message || 'Falha ao carregar dados do assistente de atestado.'); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, patientIdOf(patient)]);

  const loadCid = useCallback(async () => {
    setCidLoading(true);
    setCidError('');
    try {
      const data = await editorTextosApi.getAtestadoAssistantCid({ query: cidQuery.trim(), letter: cidLetter, preferredOnly, limit: 1000 });
      setCidItems(Array.isArray(data?.itens) ? data.itens : []);
      setSelectedCid((current) => data?.itens?.some((item) => Number(item.id) === Number(current?.id)) ? current : null);
    } catch (cause) {
      setCidItems([]);
      setSelectedCid(null);
      setCidError(cause?.message || 'Falha ao carregar doenças.');
    } finally { setCidLoading(false); }
  }, [cidLetter, cidQuery, preferredOnly]);

  useEffect(() => {
    if (!cidOpen) return undefined;
    const timer = window.setTimeout(() => void loadCid(), cidQuery.trim() ? 180 : 0);
    return () => window.clearTimeout(timer);
  }, [cidOpen, cidLetter, cidQuery, preferredOnly, loadCid]);

  const cidColumns = useMemo(() => [
    { title: 'Código', dataIndex: 'codigo', width: 120 },
    { title: 'Descrição', dataIndex: 'descricao', ellipsis: true },
  ], []);
  const update = (key, value) => setFields((current) => ({ ...current, [key]: value }));
  const chooseCid = () => {
    if (!selectedCid) return;
    update('cid', selectedCid);
    setCidOpen(false);
  };

  const changePatient = async () => {
    const selected = await onSelectPatient?.();
    if (selected) setError('');
  };

  const selectedReason = (context?.motivos_atestado || []).find((item) => Number(item.id) === Number(fields.reasonId));
  const patientId = patientIdOf(patient || context?.paciente);
  const canConfirm = Boolean(patientId && surgeonId && modelId && !loading && !submitting);
  const confirm = async () => {
    if (!canConfirm || typeof onConfirm !== 'function') return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await onConfirm({ patientId, patient: patient || context?.paciente, surgeonId, modelId, fields, reason: selectedReason?.descricao || selectedReason?.codigo || '', cid: fields.cid, observations: fields.observations });
    } catch (cause) {
      setSubmitError(cause?.message || 'Não foi possível gerar o atestado.');
    } finally {
      setSubmitting(false);
    }
  };

  return <>
    <Modal open={open} title="Assistente de atestado" width={480} centered destroyOnClose onCancel={submitting ? undefined : onCancel} className="editor-textos-attestado-assistant"
      footer={<><Button onClick={onCancel} disabled={submitting}>Cancelar</Button><Button type="primary" loading={submitting} disabled={!canConfirm} onClick={() => void confirm()}>Ok</Button></>}>
      {loading ? <div className="editor-textos-attestado-assistant__loading"><Spin /> Carregando dados do assistente...</div> : null}
      {error ? <Alert type="error" showIcon message={error} /> : null}
      {submitError ? <Alert type="error" showIcon message={submitError} /> : null}
      {!error && <div className="editor-textos-attestado-assistant__grid" aria-busy={loading}>
        <label>Cirurgião<Select aria-label="Cirurgião" loading={loading} value={surgeonId} options={(context?.cirurgioes || []).map((item) => ({ value: item.id, label: item.nome || item.nome_completo }))} onChange={setSurgeonId} /></label>
        <label>Modelo de atestado<Select aria-label="Modelo de atestado" loading={loading} value={modelId} options={(context?.modelos_atestado || []).map((item) => ({ value: item.id, label: item.nome }))} onChange={setModelId} /></label>
        <label className="editor-textos-attestado-assistant__wide">Paciente<div className="editor-textos-attestado-assistant__inline"><Input aria-label="Paciente" readOnly value={getPatientDisplayName(patient) || context?.paciente?.nome || ''} /><Button onClick={() => void changePatient()}>Selecionar paciente</Button></div></label>
        <section className="editor-textos-attestado-assistant__wide"><label>Período de afastamento</label><div className="editor-textos-attestado-assistant__period">
          <DateField label="Data inicial" aria-label="Data inicial" value={fields.startDate} onChange={(value) => update('startDate', value?.format('DD/MM/YYYY') || '')} />
          <span>[</span><span>a</span>
          <DateField label="Data final" aria-label="Data final" value={fields.endDate} onChange={(value) => update('endDate', value?.format('DD/MM/YYYY') || '')} />
          <span>]</span><span>das</span>
          <AttestadoTimeField label="Hora inicial" value={fields.startTime} onChange={(value) => update('startTime', value)} />
          <span>às</span>
          <AttestadoTimeField label="Hora final" value={fields.endTime} onChange={(value) => update('endTime', value)} />
          <span>horas</span>
        </div></section>
        <label className="editor-textos-attestado-assistant__wide">Motivo<Select aria-label="Motivo" allowClear value={fields.reasonId} options={(context?.motivos_atestado || []).map((item) => ({ value: item.id, label: item.descricao || item.codigo }))} onChange={(value) => update('reasonId', value)} /></label>
        <label className="editor-textos-attestado-assistant__wide">CID (Código Internacional de Doenças)<div className="editor-textos-attestado-assistant__inline"><Input aria-label="CID" readOnly value={fields.cid ? `${fields.cid.codigo ? `${fields.cid.codigo} - ` : ''}${fields.cid.descricao || ''}` : ''} /><Button onClick={() => setCidOpen(true)}>Selecionar CID</Button></div></label>
        <label className="editor-textos-attestado-assistant__wide">Observações<Input.TextArea aria-label="Observações" rows={3} value={fields.observations} onChange={(event) => update('observations', event.target.value)} /></label>
      </div>}
    </Modal>
    <Modal open={cidOpen} title="Menu de doenças" width={700} centered onCancel={() => setCidOpen(false)} className="editor-textos-attestado-cid-menu"
      footer={<><Button onClick={() => setCidOpen(false)}>Cancelar</Button><Button type="primary" disabled={!selectedCid || cidLoading || Boolean(cidError)} onClick={chooseCid}>Ok</Button></>}>
      <div className="editor-textos-attestado-cid-menu__search"><Input aria-label="Pesquisar doença" placeholder="Pesquisar nome ou código" value={cidQuery} onChange={(event) => setCidQuery(event.target.value)} onPressEnter={() => void loadCid()} /><Button onClick={() => void loadCid()}>Pesquisar</Button></div>
      <PacientesAlphabet options={[{ value: 0, label: 'Todos' }, ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => ({ value: letter.charCodeAt(0), label: letter }))]} activeValue={cidLetter === '*' ? 0 : cidLetter.charCodeAt(0)} ariaLabel="Filtro alfabético de CID" entityLabel="doenças" onChange={(value) => setCidLetter(Number(value) === 0 ? '*' : String.fromCharCode(Number(value)))} />
      <label className="editor-textos-attestado-cid-menu__preferred"><input type="checkbox" checked={preferredOnly} onChange={(event) => setPreferredOnly(event.target.checked)} /> Apenas preferidos</label>
      {cidError ? <Alert type="error" showIcon message={cidError} action={<Button size="small" onClick={() => void loadCid()}>Tentar novamente</Button>} /> : null}
      <Table rowKey="id" size="small" loading={cidLoading} columns={cidColumns} dataSource={cidError ? [] : cidItems} pagination={false} scroll={{ y: 360 }} locale={{ emptyText: cidLoading ? <Spin size="small" /> : <Empty description="Nenhuma doença encontrada." /> }} rowSelection={{ type: 'radio', selectedRowKeys: selectedCid ? [selectedCid.id] : [], onChange: (_keys, rows) => setSelectedCid(rows[0] || null) }} />
    </Modal>
  </>;
}
