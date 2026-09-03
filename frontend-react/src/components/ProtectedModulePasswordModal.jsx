import { Alert, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';

export function ProtectedModulePasswordModal({ open, loading, error, onSubmit, onCancel }) {
  const [value, setValue] = useState('');
  useEffect(() => { if (!open) setValue(''); }, [open]);
  const close = () => { setValue(''); onCancel(); };
  return <Modal open={open} title="Senha" okText="Ok" cancelText="Cancelar" confirmLoading={loading} onOk={() => onSubmit(value)} onCancel={close} destroyOnClose>
    {error ? <Alert type="error" showIcon message="Senha inválida." /> : null}
    <Form layout="vertical" onFinish={() => onSubmit(value)}>
      <Form.Item label="Senha" required><Input.Password autoFocus autoComplete="current-password" value={value} onChange={(event) => setValue(event.target.value)} onPressEnter={() => onSubmit(value)} /></Form.Item>
    </Form>
  </Modal>;
}
