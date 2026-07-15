import { useEffect } from 'react';
import { Button, Form, Input } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';

function buildInitialValues(group) {
  return {
    nome: String(group?.nome ?? ''),
    tipo: String(group?.tipo ?? ''),
  };
}

export function PlanoContasGroupModal({ open, mode, group, saving = false, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (open) {
      form.setFieldsValue(buildInitialValues(group));
    } else {
      form.resetFields();
    }
  }, [form, group, open]);

  const handleFinish = async (values) => {
    await onSubmit?.(values);
  };

  return (
    <BranaModal
      open={open}
      title={isEdit ? 'Alterar grupo' : 'Novo grupo'}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={520}
      maskClosable={!saving}
      keyboard={!saving}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item
          label="Nome do grupo"
          name="nome"
          rules={[{ required: true, whitespace: true, message: 'Informe o nome do grupo.' }]}
        >
          <Input autoFocus maxLength={120} placeholder="Ex.: Ativo" disabled={saving} />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="tipo"
          rules={[{ required: true, whitespace: true, message: 'Informe o tipo do grupo.' }]}
        >
          <Input maxLength={40} placeholder="Ex.: Pessoal" disabled={saving} />
        </Form.Item>

        <div className="plano-contas-modal-actions">
          <Button onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            Salvar
          </Button>
        </div>
      </Form>
    </BranaModal>
  );
}
