import { Alert, Button, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { alterarCalendarioFaturamento, criarCalendarioFaturamento } from '../conveniosPlanosApi.js';

function todayBR() { const now = new Date(); return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`; }
function validDate(value) { const parts = String(value || '').split('/'); if (String(value || '') === '') return true; if (parts.length !== 3 || parts.some((part) => !/^\d+$/.test(part))) return false; const [day, month, year] = parts.map(Number); return day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100; }

export function CalendarioFaturamentoModal({ open, mode = 'new', record = null, convenioRowId, onClose, onSaved }) {
  const [form, setForm] = useState({ data_fechamento: '', data_pagamento: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (open) { const today = todayBR(); setForm(mode === 'edit' ? { data_fechamento: record?.data_fechamento || '', data_pagamento: record?.data_pagamento || '' } : { data_fechamento: today, data_pagamento: today }); setError(''); } }, [open, mode, record]);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const close = () => { if (!submitting) onClose(); };
  const submit = async () => {
    if (submitting) return;
    if (!validDate(form.data_fechamento) || !validDate(form.data_pagamento)) { setError('Informe datas válidas no formato dd/mm/aaaa.'); return; }
    setError(''); setSubmitting(true);
    try { const payload = { convenio_row_id: Number(convenioRowId), data_fechamento: form.data_fechamento || null, data_pagamento: form.data_pagamento || null }; const saved = mode === 'edit' ? await alterarCalendarioFaturamento(record.row_id, payload) : await criarCalendarioFaturamento(payload); await onSaved?.(saved); onClose(); }
    catch (err) { setError(err?.message || 'Falha ao criar data de faturamento.'); }
    finally { setSubmitting(false); }
  };
  return <Modal open={open} title={mode === 'edit' ? 'Altera data de faturamento' : 'Nova data de faturamento'} width={370} centered keyboard={false} maskClosable onCancel={close} footer={<div className="convenios-planos-convenio-modal-footer">{error ? <Alert type="error" showIcon message={error} /> : null}<Button type="primary" loading={submitting} onClick={submit}>Ok</Button><Button onClick={close} disabled={submitting}>Cancela</Button></div>} rootClassName="convenios-planos-calendar-new-modal-root"><div className="convenios-planos-calendar-new-form"><label className="convenios-planos-convenio-modal-field"><span>Data de fechamento</span><Input value={form.data_fechamento} maxLength={10} onChange={(event) => update('data_fechamento', event.target.value)} /></label><label className="convenios-planos-convenio-modal-field"><span>Data de pagamento</span><Input value={form.data_pagamento} maxLength={10} onChange={(event) => update('data_pagamento', event.target.value)} /></label></div></Modal>;
}
