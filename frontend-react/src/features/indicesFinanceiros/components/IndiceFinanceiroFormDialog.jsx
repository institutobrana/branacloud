import { useEffect, useMemo } from 'react';
import { Button, Form, Input } from 'antd';

import { BranaModal } from '../../../components/BranaModal.jsx';
import '../indicesFinanceiros.css';
import { normalizeIndiceFinanceiroFormValues, validateIndiceFinanceiroFormValues } from '../indicesFinanceirosValidators.js';

const EMPTY_VALUES = {
  nome: '',
  sigla: '',
};

function buildFormValues(initialValues) {
  return {
    nome: String(initialValues?.nome ?? ''),
    sigla: String(initialValues?.sigla ?? ''),
  };
}

export function IndiceFinanceiroFormDialog({
  open,
  mode = 'create',
  initialValues = EMPTY_VALUES,
  saving = false,
  submitError = '',
  onSubmit,
  onCancel,
}) {
  const [form] = Form.useForm();
  const nome = Form.useWatch('nome', form);
  const sigla = Form.useWatch('sigla', form);
  const isEditMode = mode === 'edit';
  const initialFormValues = useMemo(() => buildFormValues(initialValues), [initialValues]);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialFormValues);
      return;
    }
    form.resetFields();
  }, [form, initialFormValues, open]);

  const normalizedCurrent = normalizeIndiceFinanceiroFormValues({ nome, sigla });
  const normalizedInitial = normalizeIndiceFinanceiroFormValues(initialFormValues);
  const changed = !isEditMode || normalizedCurrent.nome !== normalizedInitial.nome || normalizedCurrent.sigla !== normalizedInitial.sigla;
  const canSubmit = Boolean(!saving && !validateIndiceFinanceiroFormValues({ nome, sigla }) && changed);

  return (
    <BranaModal
      open={open}
      title={isEditMode ? 'Altera índice financeiro' : 'Novo índice financeiro'}
      centered
      width={400}
      style={{ maxWidth: 'calc(100vw - 24px)' }}
      destroyOnClose
      maskClosable={!saving}
      keyboard={!saving}
      onCancel={saving ? undefined : onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={EMPTY_VALUES}
        onFinish={async (values) => {
          await onSubmit?.(normalizeIndiceFinanceiroFormValues(values));
        }}
      >
        <Form.Item
          name="nome"
          label="Índice"
          rules={[
            { required: true, whitespace: true, message: 'Informe o nome do índice.' },
            { max: 120, message: 'O nome deve ter no máximo 120 caracteres.' },
          ]}
        >
          <Input autoFocus maxLength={120} placeholder="Nome do índice" disabled={saving} />
        </Form.Item>

        <Form.Item
          name="sigla"
          label="Sigla"
          rules={[
            { required: true, whitespace: true, message: 'Informe a sigla do índice.' },
            { max: 20, message: 'A sigla deve ter no máximo 20 caracteres.' },
          ]}
        >
          <Input maxLength={20} placeholder="Ex.: R$" disabled={saving} />
        </Form.Item>

        {submitError ? <div className="indices-financeiros-modal-error">{submitError}</div> : null}

        <div className="indices-financeiros-modal-actions">
          <Button type="primary" htmlType="submit" loading={saving} disabled={!canSubmit} className="indices-financeiros-modal-primary">
            Salvar
          </Button>
          <Button onClick={onCancel} disabled={saving} className="indices-financeiros-modal-secondary">
            Cancelar
          </Button>
        </div>
      </Form>
    </BranaModal>
  );
}
