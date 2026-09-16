import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Tabs, message } from 'antd';
import { loadGeneralPreferences, loadNovoTratamentoCombos, loadSystemOptions, createNovoTratamento } from './novoTratamentoApi.js';
import { useAuth } from '../auth/AuthProvider.jsx';
import { applyNovoTratamentoDefaults, applyNovoTratamentoResponseMetadata, buildNovoTratamentoPayload, createNovoTratamentoForm } from './novoTratamentoMappers.js';
import { validateNovoTratamento } from './novoTratamentoValidation.js';
import { NovoTratamentoPrincipalTab } from './NovoTratamentoPrincipalTab.jsx';
import { NovoTratamentoConvenioTab } from './NovoTratamentoConvenioTab.jsx';

export function NovoTratamentoModal({ open, patient, onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState(createNovoTratamentoForm);
  const [data, setData] = useState({}); const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false); const [activeTab, setActiveTab] = useState('principal');
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  useEffect(() => { if (!open || !patient?.id) return; let alive = true; setLoading(true); setActiveTab('principal'); Promise.all([loadNovoTratamentoCombos(patient.id), loadGeneralPreferences().catch(() => ({})), loadSystemOptions().catch(() => ({}))]).then(([combos, preferences, systemOptions]) => { if (alive) { setData(combos || {}); setForm(applyNovoTratamentoDefaults(createNovoTratamentoForm(), combos, preferences, systemOptions, user)); } }).catch((error) => message.error(error.message)).finally(() => alive && setLoading(false)); return () => { alive = false; }; }, [open, patient?.id, user]);
  const submit = async () => { const result = validateNovoTratamento(form, patient?.id); if (!result.valid) return message.error(result.errors.paciente_id); setSaving(true); try { const response = await createNovoTratamento(buildNovoTratamentoPayload(form, patient.id, data.convenios)); setForm((current) => applyNovoTratamentoResponseMetadata(current, response)); message.success('Tratamento criado com sucesso.'); onClose?.(); } catch (error) { message.error(error.message); } finally { setSaving(false); } };
  const items = useMemo(() => [{ key: 'principal', label: 'Principal', children: <NovoTratamentoPrincipalTab form={form} setField={setField} data={data} /> }, { key: 'convenio', label: 'Convênio', children: <NovoTratamentoConvenioTab form={form} setField={setField} data={data} /> }], [form, data]);
  return <Modal className="novo-tratamento-modal" open={open} title="Novo tratamento" width={468} maskClosable keyboard onCancel={saving ? undefined : onClose} footer={<div className="novo-tratamento-footer"><Button type="primary" loading={saving} disabled={loading} onClick={submit}>Ok</Button><Button disabled={saving} onClick={onClose}>Cancela</Button></div>}><Tabs type="card" animated={false} activeKey={activeTab} onChange={setActiveTab} items={items} /></Modal>;
}
