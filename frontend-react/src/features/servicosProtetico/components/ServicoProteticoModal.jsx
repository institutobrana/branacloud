import { Alert, Button, Form } from 'antd';
import { useEffect } from 'react';

import { BranaModal } from '../../../components/BranaModal.jsx';
import { ServicoProteticoForm } from './ServicoProteticoForm.jsx';
import { buildServicoProteticoCreatePayload } from '../utils/servicosProteticoCreatePayload.js';
import { validateServicoProteticoValues } from '../utils/servicosProteticoValidators.js';

const EMPTY_VALUES = {
  codigo: '',
  nome: '',
  indice: 'R$',
  preco: '',
  prazo: '',
  descricao: '',
};

export function ServicoProteticoModal({
  open,
  saving = false,
  protetico,
  mode = 'create',
  initialValues = null,
  error = '',
  onCancel,
  onSubmit,
}) {
  const [form] = Form.useForm();
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      ...EMPTY_VALUES,
      ...(initialValues || {}),
    });
  }, [form, initialValues, open]);

  const handleFinish = async (values) => {
    const validation = validateServicoProteticoValues(values);
    if (!validation.valid) {
      form.setFields(
        Object.entries(validation.errors).map(([name, message]) => ({
          name,
          errors: [message],
        })),
      );
      return;
    }

    const payload = buildServicoProteticoCreatePayload(values);
    await onSubmit?.(payload);
  };

  return (
    <BranaModal
      open={open}
      title={isEditMode ? 'Altera serviço de protético' : 'Novo serviço de protético'}
      centered
      width={420}
      destroyOnClose
      maskClosable={!saving}
      keyboard={!saving}
      onCancel={saving ? undefined : onCancel}
      footer={null}
      className="servicos-protetico-modal"
    >
      <div className="servicos-protetico-modal-protetico">
        <strong>Protético:</strong> <span>{protetico?.nome || '-'}</span>
      </div>

      {error ? <Alert className="servicos-protetico-modal-error" type="error" showIcon message={error} /> : null}

      <Form form={form} layout="vertical" requiredMark={false} disabled={saving} onFinish={handleFinish}>
        <ServicoProteticoForm loading={saving} mode={mode} />

        <div className="servicos-protetico-modal-actions">
          <Button onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            {isEditMode ? 'Salvar alteração' : 'Salvar'}
          </Button>
        </div>
      </Form>
    </BranaModal>
  );
}
