import { useEffect } from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';

function buildInitialValues(category, groupId) {
  return {
    nome: String(category?.nome ?? ''),
    tipo: String(category?.tipo ?? ''),
    grupo_id: Number(category?.grupoId ?? category?.grupo_id ?? groupId ?? 0) || undefined,
    tributavel: Boolean(category?.tributavel),
  };
}

export function PlanoContasCategoryModal({ open, mode, category, groupOptions = [], defaultGroupId = null, saving = false, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (open) {
      form.setFieldsValue(buildInitialValues(category, defaultGroupId));
    } else {
      form.resetFields();
    }
  }, [category, defaultGroupId, form, open]);

  const handleFinish = async (values) => {
    await onSubmit?.(values);
  };

  return (
    <BranaModal
      open={open}
      title={isEdit ? 'Alterar categoria' : 'Nova categoria'}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={560}
      maskClosable={!saving}
      keyboard={!saving}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item
          label="Nome da categoria"
          name="nome"
          rules={[{ required: true, whitespace: true, message: 'Informe o nome da categoria.' }]}
        >
          <Input autoFocus maxLength={120} placeholder="Ex.: Caixa" disabled={saving} />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="tipo"
          rules={[{ required: true, whitespace: true, message: 'Informe o tipo da categoria.' }]}
        >
          <Input maxLength={40} placeholder="Ex.: Analitica" disabled={saving} />
        </Form.Item>

        <Form.Item
          label="Grupo"
          name="grupo_id"
          rules={[{ required: true, message: 'Selecione um grupo.' }]}
        >
          <Select
            placeholder="Selecione um grupo"
            options={groupOptions}
            disabled={saving}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item name="tributavel" valuePropName="checked">
          <Checkbox disabled={saving}>Tributável</Checkbox>
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
