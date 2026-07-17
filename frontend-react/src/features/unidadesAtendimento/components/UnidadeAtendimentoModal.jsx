import { Alert, Button, Form } from 'antd';
import { useEffect } from 'react';

import { BranaModal } from '../../../components/BranaModal.jsx';
import { EMPTY_UNIDADE_ATENDIMENTO_FORM } from '../utils/unidadeAtendimentoMappers.js';
import { validateUnidadeAtendimentoValues } from '../utils/unidadeAtendimentoValidation.js';
import { UnidadeIdentificacaoSection } from './UnidadeIdentificacaoSection.jsx';
import { UnidadeEnderecoSection } from './UnidadeEnderecoSection.jsx';
import { UnidadeTelefonesSection } from './UnidadeTelefonesSection.jsx';
import { UnidadeMetadataSection } from './UnidadeMetadataSection.jsx';

export function UnidadeAtendimentoModal({
  open,
  mode = 'create',
  loading = false,
  error = '',
  values = EMPTY_UNIDADE_ATENDIMENTO_FORM,
  nextCodeLoading = false,
  logradouroOptions = [],
  bairroOptions = [],
  cidadeOptions = [],
  ufOptions = [],
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
      ...EMPTY_UNIDADE_ATENDIMENTO_FORM,
      ...(values || {}),
    });
  }, [form, open, values]);

  const handleFinish = async (currentValues) => {
    const validation = validateUnidadeAtendimentoValues(currentValues);
    if (!validation.valid) {
      form.setFields(Object.entries(validation.errors).map(([name, message]) => ({ name, errors: [message] })));
      return;
    }
    await onSubmit?.(currentValues);
  };

  return (
    <BranaModal
      open={open}
      title={isEditMode ? 'Altera unidade de atendimento' : 'Nova unidade de atendimento'}
      centered
      width={584}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
      className="unidades-atendimento-modal"
    >
      {error ? <Alert type="error" showIcon message={error} className="unidades-atendimento-modal-error" /> : null}
      <Form form={form} layout="vertical" requiredMark={false} disabled={loading} onFinish={handleFinish} className="unidades-atendimento-modal-form">
        <UnidadeIdentificacaoSection nextCodeLoading={nextCodeLoading} />
        <UnidadeEnderecoSection
          logradouroOptions={logradouroOptions}
          bairroOptions={bairroOptions}
          cidadeOptions={cidadeOptions}
          ufOptions={ufOptions}
        />
        <UnidadeTelefonesSection />
        <UnidadeMetadataSection />

        <div className="unidades-atendimento-modal-actions">
          <Button onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditMode ? 'Salvar alteração' : 'Salvar'}
          </Button>
        </div>
      </Form>
    </BranaModal>
  );
}
