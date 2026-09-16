import { Alert, Button, Checkbox, Input } from 'antd';
import { BranaModal } from '../../../components/BranaModal.jsx';
import { alterarPlano, criarPlano } from '../conveniosPlanosApi.js';
import { usePlanoForm } from '../hooks/usePlanoForm.js';

function Field({ label, children }) {
  return <label className="convenios-planos-convenio-modal-field"><span>{label}</span>{children}</label>;
}

export function PlanoModal({ open, mode = 'new', record = null, convenio, onClose, onSaved }) {
  const convenioRowId = convenio?.row_id ?? convenio?.rowId ?? convenio?.id ?? null;
  const formState = usePlanoForm(open, convenioRowId, mode, record);
  const handleClose = () => { if (!formState.submitting) { formState.reset(); onClose(); } };
  const handleSubmit = async () => {
    if (formState.submitting) return;
    if (!String(formState.form.nome || '').trim()) { formState.setSubmitError('Informe o nome do plano.'); return; }
    if (!convenioRowId) { formState.setSubmitError('Selecione um convênio antes de criar o plano.'); return; }
    formState.setSubmitError('');
    formState.setSubmitting(true);
    try {
      const payload = { convenio_row_id: Number(convenioRowId), codigo: formState.form.codigo, nome: formState.form.nome, cobertura: formState.form.cobertura, inativo: Boolean(formState.form.inativo) };
      const saved = mode === 'edit' ? await alterarPlano(record.row_id || record.id, payload) : await criarPlano(payload);
      await onSaved?.(saved, Number(convenioRowId));
      formState.reset();
      onClose();
    } catch (error) {
      formState.setSubmitError(error?.message || 'Falha ao criar plano.');
    } finally { formState.setSubmitting(false); }
  };
  return <BranaModal open={open} title={mode === 'edit' ? 'Altera plano' : 'Novo plano'} centered width={430} keyboard={false} maskClosable onCancel={handleClose} rootClassName="convenios-planos-plano-modal-root" footer={<div className="convenios-planos-convenio-modal-footer">{formState.submitError ? <Alert className="convenios-planos-convenio-modal-submit-error" type="error" showIcon message={formState.submitError} /> : null}<Button type="primary" loading={formState.submitting} onClick={handleSubmit}>Ok</Button><Button onClick={handleClose} disabled={formState.submitting}>Cancela</Button></div>}>
    <div className="convenios-planos-convenio-modal-pane convenios-planos-plano-modal-pane">
      <Field label="Código"><Input value={formState.form.codigo} maxLength={20} onChange={(event) => formState.updateField('codigo', event.target.value)} /></Field>
      <Field label="Nome do plano"><Input value={formState.form.nome} maxLength={120} onChange={(event) => formState.updateField('nome', event.target.value)} /></Field>
      <Field label="Cobertura"><Input value={formState.form.cobertura} onChange={(event) => formState.updateField('cobertura', event.target.value)} /></Field>
      <Checkbox checked={formState.form.inativo} onChange={(event) => formState.updateField('inativo', event.target.checked)}>Inativar plano</Checkbox>
    </div>
  </BranaModal>;
}
