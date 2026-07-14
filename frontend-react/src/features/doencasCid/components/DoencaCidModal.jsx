import { useEffect } from 'react';
import { Button, Checkbox, Form, Input, Modal } from 'antd';

const EMPTY_VALUES = {
  codigo: '',
  descricao: '',
  observacoes: '',
  preferido: false,
};

export function DoencaCidModal({ open, mode, loading, item, onClose, onSave }) {
  const [form] = Form.useForm();
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }
    form.setFieldsValue(
      item
        ? {
            codigo: item.codigo || '',
            descricao: item.descricao || '',
            observacoes: item.observacoes || '',
            preferido: Boolean(item.preferido),
          }
        : EMPTY_VALUES,
    );
  }, [form, item, open]);

  return (
    <Modal
      open={open}
      centered
      width={450}
      style={{ maxWidth: 'calc(100vw - 24px)' }}
      destroyOnClose
      onCancel={onClose}
      footer={null}
      title={isEdit ? 'Alterar doença' : 'Nova doença'}
      className="doencas-cid-modal terra-password-modal client-modal auxiliary-modal auxiliary-simple-modal"
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        className="doencas-cid-modal-form client-modal-form auxiliary-modal-form doencas-cid-modal-form--compact"
        initialValues={EMPTY_VALUES}
        onFinish={async (values) => {
          try {
            await onSave?.({
              codigo: String(values.codigo || '').trim(),
              descricao: String(values.descricao || '').trim(),
              observacoes: String(values.observacoes || '').trim(),
              preferido: Boolean(values.preferido),
            });
          } catch {
            // O hook já exibe a mensagem apropriada; mantemos o modal aberto.
          }
        }}
      >
        <div className="doencas-cid-modal-grid">
          <Form.Item
            name="codigo"
            label="Código"
            className="doencas-cid-modal-field doencas-cid-modal-field-code"
            rules={[{ required: true, message: 'Informe o código.' }]}
          >
            <Input autoFocus maxLength={20} placeholder="Código da doença" />
          </Form.Item>

          <Form.Item
            name="descricao"
            label="Doença"
            className="doencas-cid-modal-field doencas-cid-modal-field-description"
            rules={[{ required: true, message: 'Informe a doença.' }]}
          >
            <Input maxLength={500} placeholder="Descrição da doença" />
          </Form.Item>

          <Form.Item
            name="observacoes"
            label="Observações"
            className="doencas-cid-modal-field doencas-cid-modal-field-observacoes"
          >
            <Input.TextArea rows={2} maxLength={2000} placeholder="Observações" />
          </Form.Item>

          <Form.Item
            name="preferido"
            valuePropName="checked"
            className="doencas-cid-modal-field doencas-cid-modal-field-preferido"
          >
            <Checkbox>Incluir na lista de preferidos</Checkbox>
          </Form.Item>
        </div>

        <div className="doencas-cid-modal-actions">
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
