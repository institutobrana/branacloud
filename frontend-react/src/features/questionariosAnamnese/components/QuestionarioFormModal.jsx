import { Button, Checkbox, Form, Input, Select } from 'antd';
import { useEffect, useMemo } from 'react';

import { BranaModal } from '../../../components/BranaModal.jsx';

const EMPTY_VALUES = {
  nome: '',
  copiar: false,
  copiar_do_questionario_id: undefined,
};

export function QuestionarioFormModal({
  open,
  mode = 'create',
  loading = false,
  error = '',
  item = null,
  questionarios = [],
  loadingQuestionarios = false,
  onCancel,
  onSave,
}) {
  const [form] = Form.useForm();
  const nome = Form.useWatch('nome', form);
  const copiar = Form.useWatch('copiar', form);
  const origemId = Form.useWatch('copiar_do_questionario_id', form);
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (isEditMode) {
      form.setFieldsValue({
        nome: String(item?.nome || ''),
        copiar: false,
        copiar_do_questionario_id: undefined,
      });
      return;
    }

    form.setFieldsValue(EMPTY_VALUES);
  }, [form, isEditMode, item, open]);

  const origemOptions = useMemo(
    () =>
      questionarios.map((questionario) => ({
        value: questionario.id,
        label: questionario.nome || `Questionario ${questionario.id}`,
      })),
    [questionarios],
  );

  const nomeLimpo = String(nome || '').trim();
  const nomeValido = nomeLimpo.length > 0 && nomeLimpo.length <= 120;
  const origemValida = isEditMode || !copiar || Boolean(origemId);
  const canSubmit = Boolean(nomeValido && origemValida && !loading && !(copiar && loadingQuestionarios));

  return (
    <BranaModal
      open={open}
      title={isEditMode ? 'Edita questionario de anamnese' : 'Cria novo questionario de anamnese'}
      centered
      width={500}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
      className="questionarios-anamnese-create-modal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={EMPTY_VALUES}
        onFinish={async (values) => {
          try {
            const nextPayload = {
              nome: String(values.nome || ''),
            };
            if (!isEditMode && values.copiar && values.copiar_do_questionario_id) {
              nextPayload.copiar_do_questionario_id = Number(values.copiar_do_questionario_id);
            }
            await onSave?.(nextPayload);
          } catch {
            // O hook mantem o modal aberto e exibe a mensagem apropriada.
          }
        }}
      >
        <Form.Item
          name="nome"
          label="Nome do questionario:"
          rules={[
            { required: true, whitespace: true, message: 'Informe o nome do questionario.' },
            { max: 120, message: 'O nome deve ter no maximo 120 caracteres.' },
          ]}
        >
          <Input
            autoFocus
            maxLength={120}
            placeholder="Nome do questionario"
            onPressEnter={() => {
              if (canSubmit) {
                form.submit();
              }
            }}
          />
        </Form.Item>

        {!isEditMode ? (
          <div className="questionarios-anamnese-create-copy-row">
            <Form.Item name="copiar" valuePropName="checked" className="questionarios-anamnese-create-copy-check">
              <Checkbox
                onChange={(event) => {
                  if (!event.target.checked) {
                    form.setFieldValue('copiar_do_questionario_id', undefined);
                  }
                }}
              >
                Copiar do questionario:
              </Checkbox>
            </Form.Item>

            <Form.Item shouldUpdate noStyle>
              {() => (
                <Form.Item name="copiar_do_questionario_id" className="questionarios-anamnese-create-copy-select">
                  <Select
                    disabled={!copiar}
                    loading={loadingQuestionarios}
                    options={origemOptions}
                    placeholder="Selecione"
                    showSearch
                    optionFilterProp="label"
                    allowClear
                    virtual={false}
                    popupMatchSelectWidth={false}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </div>
        ) : null}

        {error ? <div className="questionarios-anamnese-modal-error">{error}</div> : null}

        <div className="questionarios-anamnese-modal-actions">
          <Button type="primary" htmlType="submit" loading={loading} disabled={!canSubmit}>
            Ok
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            Cancela
          </Button>
        </div>
      </Form>
    </BranaModal>
  );
}
