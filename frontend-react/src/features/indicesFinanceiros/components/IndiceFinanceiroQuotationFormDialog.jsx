import { Button, Form, Input } from 'antd';
import { useEffect, useMemo } from 'react';

import { BranaModal } from '../../../components/BranaModal.jsx';
import '../indicesFinanceiros.css';
import {
  formatIndiceFinanceiroQuotationDate,
  normalizeIndiceFinanceiroQuotationFormValues,
  parseIndiceFinanceiroQuotationValue,
  validateIndiceFinanceiroQuotationFormValues,
} from '../indicesFinanceirosQuotationValidators.js';

const EMPTY_VALUES = {
  data: '',
  valor: '',
};

function buildFormValues(initialValues) {
  return {
    data: String(initialValues?.data ?? ''),
    valor: String(initialValues?.valor ?? ''),
  };
}

export function IndiceFinanceiroQuotationFormDialog({
  open,
  mode = 'create',
  indice = null,
  initialValues = EMPTY_VALUES,
  saving = false,
  submitError = '',
  onSubmit,
  onCancel,
}) {
  const [form] = Form.useForm();
  const data = Form.useWatch('data', form);
  const valor = Form.useWatch('valor', form);
  const initialFormValues = useMemo(() => buildFormValues(initialValues), [initialValues]);
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialFormValues);
      return;
    }
    form.resetFields();
  }, [form, initialFormValues, open]);

  const normalizedCurrent = normalizeIndiceFinanceiroQuotationFormValues({ data, valor });
  const currentValue = parseIndiceFinanceiroQuotationValue(normalizedCurrent.valorRaw);
  const canSubmit = Boolean(
    open &&
      !saving &&
      !validateIndiceFinanceiroQuotationFormValues({ data, valor }) &&
      indice &&
      currentValue != null &&
      Number.isFinite(currentValue) &&
      currentValue > 0,
  );

  return (
    <BranaModal
      open={open}
      title={isEditMode ? 'Altera cotação' : 'Nova cotação'}
      centered
      width={372}
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
          await onSubmit?.(normalizeIndiceFinanceiroQuotationFormValues(values));
        }}
      >
        <div style={{ marginBottom: 10, lineHeight: 1.3 }}>
          <strong>{String(indice?.nome ?? '')}</strong>
          {indice?.sigla ? <span>{` (${indice.sigla})`}</span> : null}
        </div>

        <Form.Item
          name="data"
          label="Data"
          rules={[
            { required: true, message: 'Informe a data.' },
            {
              validator: async (_, value) => {
                if (!value) return Promise.resolve();
                if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value).trim())) {
                  return Promise.reject(new Error('Informe uma data válida.'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="date" disabled={saving} />
        </Form.Item>

        <Form.Item
          name="valor"
          label="Valor"
          rules={[
            { required: true, message: 'Informe o valor.' },
            {
              validator: async (_, value) => {
                const parsed = parseIndiceFinanceiroQuotationValue(value);
                if (parsed == null) {
                  return Promise.reject(new Error('Informe um valor válido.'));
                }
                if (parsed <= 0) {
                  return Promise.reject(new Error('Informe um valor válido.'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input inputMode="decimal" placeholder="Ex.: 1,2500" disabled={saving} />
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
