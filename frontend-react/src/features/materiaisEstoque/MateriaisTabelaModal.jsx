import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space } from 'antd';

import { listarIndicesMateriais } from './materiaisEstoqueApi.js';

export function MateriaisTabelaModal({ open, mode, lista, onClose, onSaved, onLoadError }) {
  const [form] = Form.useForm();
  const [indices, setIndices] = useState([]);
  const isEdit = mode === 'edit';

  const title = useMemo(() => (isEdit ? 'Alterar tabela de materiais' : 'Nova tabela de materiais'), [isEdit]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    const load = async () => {
      try {
        const nextIndices = await listarIndicesMateriais();
        setIndices(nextIndices);
        form.setFieldsValue({
          nome: lista?.nome || '',
          nro_indice: String(lista?.nro_indice ?? lista?.indice_id ?? nextIndices[0]?.id ?? 255),
        });
      } catch (error) {
        onLoadError?.(error);
      }
    };

    void load();
  }, [form, lista, onLoadError, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields(['nome', 'nro_indice']);
      onSaved?.({
        nome: String(values.nome || '').trim(),
        nro_indice: String(values.nro_indice || '').trim(),
      });
    } catch {
      // validation handled by antd
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={360}
      centered
      className="materiais-modal materiais-tabela-modal"
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Informe o nome da tabela.' }]}>
          <Input maxLength={120} />
        </Form.Item>
        <Form.Item name="nro_indice" label="Índice" rules={[{ required: true, message: 'Informe o índice.' }]}>
          <Select
            options={indices.map((item) => ({
              value: String(item.id),
              label: `${item.sigla || item.id} - ${item.nome || ''}`.trim(),
            }))}
          />
        </Form.Item>
        <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" onClick={handleOk}>
            OK
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
