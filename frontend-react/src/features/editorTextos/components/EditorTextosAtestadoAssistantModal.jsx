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
  const digits = String(value || '').replace(/\D/g, '').slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function EditorTextosAtestadoAssistantModal({ open, patient, onSelectPatient, onCancel }) {
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

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setLoading(true);
    setError('');
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

  return <>
    <Modal open={open} title="Assistente de atestado" width={520} centered destroyOnClose onCancel={onCancel} className="editor-textos-attestado-assistant"
      footer={<><Button onClick={onCancel}>Cancelar</Button><Button type="primary" disabled>Ok</Button></>}>
      {loading ? <div className="editor-textos-attestado-assistant__loading"><Spin /> Carregando dados do assistente...</div> : null}
      {error ? <Alert type="error" showIcon message={error} /> : null}
      {!error && <div className="editor-textos-attestado-assistant__grid" aria-busy={loading}>
        <label>Cirurgião<Select aria-label="Cirurgião" loading={loading} value={surgeonId} options={(context?.cirurgioes || []).map((item) => ({ value: item.id, label: item.nome || item.nome_completo }))} onChange={setSurgeonId} /></label>
        <label>Modelo de atestado<Select aria-label="Modelo de atestado" loading={loading} value={modelId} options={(context?.modelos_atestado || []).map((item) => ({ value: item.id, label: item.nome }))} onChange={setModelId} /></label>
        <label className="editor-textos-attestado-assistant__wide">Paciente<div className="editor-textos-attestado-assistant__inline"><Input aria-label="Paciente" readOnly value={getPatientDisplayName(patient) || context?.paciente?.nome || ''} /><Button onClick={() => void changePatient()}>Selecionar paciente</Button></div></label>
        <section className="editor-textos-attestado-assistant__wide"><label>Período de afastamento</label><div className="editor-textos-attestado-assistant__period">
          <DateField label="Data inicial" aria-label="Data inicial" value={fields.startDate} onChange={(value) => update('startDate', value?.format('DD/MM/YYYY') || '')} />
          <span>[ a</span>
          <DateField label="Data final" aria-label="Data final" value={fields.endDate} onChange={(value) => update('endDate', value?.format('DD/MM/YYYY') || '')} />
          <span>]</span><span>das</span>
          <Input aria-label="Hora inicial" inputMode="numeric" maxLength={5} placeholder="00:00" value={fields.startTime} onChange={(event) => update('startTime', maskTime(event.target.value))} onBlur={() => update('startTime', normalizeAttestadoTime(fields.startTime))} />
          <span>às</span>
          <Input aria-label="Hora final" inputMode="numeric" maxLength={5} placeholder="00:00" value={fields.endTime} onChange={(event) => update('endTime', maskTime(event.target.value))} onBlur={() => update('endTime', normalizeAttestadoTime(fields.endTime))} />
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
