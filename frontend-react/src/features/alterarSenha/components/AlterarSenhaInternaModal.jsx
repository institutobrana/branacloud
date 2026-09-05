import { Alert, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import { MIN_PASSWORD_LENGTH, validateAlterarSenhaValues } from '../validators/alterarSenhaValidation.js';

export function AlterarSenhaInternaModal({ open, loading, error, onSubmit, onCancel }) {
  const [form] = Form.useForm();
  useEffect(() => { if (!open) form.resetFields(); }, [form, open]);
  const close = () => { form.resetFields(); onCancel(); };
  const submit = async () => {
    const values = await form.validateFields();
    if (!validateAlterarSenhaValues(values).valid) return;
    await onSubmit(values);
  };

  return <Modal open={open} title="Alterar senha interna" okText="Ok" cancelText="Cancelar" confirmLoading={loading} onOk={() => void submit()} onCancel={close} destroyOnClose centered footer={(defaultDom) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <span style={{ flex: '1 1 180px', minWidth: 0, color: 'var(--brana-text-secondary)', fontSize: 12, fontWeight: 400 }}>Esta confirmação irá alterar a senha interna do sistema.</span>
      <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>{defaultDom}</div>
    </div>
  )}>
    {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} /> : null}
    <Form form={form} layout="vertical" onFinish={() => void submit()}>
      <Form.Item label="Senha interna atual" name="currentInternalPassword" rules={[{ required: true, message: 'Informe a senha interna atual.' }]}><Input.Password autoFocus autoComplete="current-password" /></Form.Item>
      <Form.Item label="Nova senha interna" name="newInternalPassword" rules={[{ required: true, message: 'Informe a nova senha interna.' }, { min: MIN_PASSWORD_LENGTH, message: 'A senha deve ter no minimo 6 caracteres.' }]}><Input.Password autoComplete="new-password" /></Form.Item>
      <Form.Item label="Confirmação" name="confirmInternalPassword" dependencies={['newInternalPassword']} rules={[{ required: true, message: 'Confirme a nova senha interna.' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || value === getFieldValue('newInternalPassword')) return Promise.resolve(); return Promise.reject(new Error('A confirmacao de senha interna nao confere.')); } })]}><Input.Password autoComplete="new-password" /></Form.Item>
    </Form>
  </Modal>;
}
