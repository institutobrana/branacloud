import { Button, Form, Input, InputNumber, Select } from 'antd';
import { useEffect, useMemo } from 'react';

import { BranaModal } from '../../../components/BranaModal.jsx';

const EMPTY_VALUES = {
  numero: undefined,
  tipo_pergunta: 1,
  tipo_resposta: 1,
  texto: '',
  mensagem_alerta: '',
};

const TIPO_PERGUNTA_OPTIONS = [
  { value: 1, label: 'Não crítica' },
  { value: 2, label: "Crítica para respostas 'sim'" },
  { value: 3, label: "Crítica para respostas 'não'" },
];

const TIPO_RESPOSTA_OPTIONS = [
  { value: 1, label: 'Sim/não' },
  { value: 2, label: 'Sim/não/texto' },
  { value: 3, label: 'Somente texto' },
];

export function PerguntaFormModal({
  open,
  mode = 'create',
  item = null,
  loading = false,
  error = '',
  onCancel,
  onSave,
}) {
  const [form] = Form.useForm();
  const numero = Form.useWatch('numero', form);
  const tipoPergunta = Form.useWatch('tipo_pergunta', form);
  const tipoResposta = Form.useWatch('tipo_resposta', form);
  const texto = Form.useWatch('texto', form);
  const mensagemAlerta = Form.useWatch('mensagem_alerta', form);
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }
    if (isEditMode) {
      form.setFieldsValue({
        numero: item?.numero ?? undefined,
        tipo_pergunta: Number(item?.tipo_pergunta ?? 1) || 1,
        tipo_resposta: Number(item?.tipo_resposta ?? 1) || 1,
        texto: String(item?.texto || ''),
        mensagem_alerta: String(item?.mensagem_alerta || ''),
      });
      return;
    }
    form.setFieldsValue(EMPTY_VALUES);
  }, [form, isEditMode, item, open]);

  const numeroValido = numero == null || (Number.isInteger(Number(numero)) && Number(numero) > 0);
  const textoLimpo = String(texto || '').trim();
  const alertaLimpo = String(mensagemAlerta || '').trim();
  const numeroAlterado = String(numero ?? '') !== String(item?.numero ?? '');
  const tipoPerguntaAlterado = String(tipoPergunta ?? '') !== String(item?.tipo_pergunta ?? 1);
  const tipoRespostaAlterado = String(tipoResposta ?? '') !== String(item?.tipo_resposta ?? 1);
  const textoAlterado = String(texto || '').trim() !== String(item?.texto || '').trim();
  const alertaAlterado = String(mensagemAlerta || '').trim() !== String(item?.mensagem_alerta || '').trim();
  const changed = !isEditMode || numeroAlterado || tipoPerguntaAlterado || tipoRespostaAlterado || textoAlterado || alertaAlterado;
  const canSubmit = Boolean(textoLimpo && textoLimpo.length <= 400 && alertaLimpo.length <= 255 && numeroValido && !loading && changed);

  return (
    <BranaModal
      open={open}
      title={isEditMode ? 'Edita pergunta de anamnese' : 'Insere pergunta de anamnese'}
      centered
      width={560}
      destroyOnClose
      maskClosable={!loading}
      keyboard={!loading}
      onCancel={loading ? undefined : onCancel}
      footer={null}
      className="questionarios-anamnese-question-modal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={EMPTY_VALUES}
        onFinish={async (values) => {
          try {
            await onSave?.({
              numero: values.numero === undefined || values.numero === null || values.numero === '' ? undefined : Number(values.numero),
              tipo_pergunta: Number(values.tipo_pergunta || 1),
              tipo_resposta: Number(values.tipo_resposta || 1),
              texto: String(values.texto || ''),
              mensagem_alerta: String(values.mensagem_alerta || ''),
            });
          } catch {
            // O hook mantem o modal aberto e exibe a mensagem apropriada.
          }
        }}
      >
        <div className="questionarios-anamnese-question-row">
          <Form.Item name="numero" label="Número:" className="questionarios-anamnese-question-numero">
            <InputNumber
              min={1}
              step={1}
              precision={0}
              controls
              style={{ width: '100%' }}
              placeholder="Automático"
              keyboard={false}
              inputMode="numeric"
              autoFocus
            />
          </Form.Item>

          <Form.Item name="tipo_pergunta" label="Tipo da pergunta" className="questionarios-anamnese-question-tipo">
            <Select options={TIPO_PERGUNTA_OPTIONS} />
          </Form.Item>
        </div>

        <Form.Item
          name="tipo_resposta"
          label="Tipo da resposta"
          rules={[{ required: true, message: 'Selecione o tipo da resposta.' }]}
        >
          <Select options={TIPO_RESPOSTA_OPTIONS} />
        </Form.Item>

        <Form.Item
          name="texto"
          label="Texto da pergunta:"
          rules={[
            { required: true, whitespace: true, message: 'Informe o texto da pergunta.' },
            { max: 400, message: 'O texto deve ter no maximo 400 caracteres.' },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 6 }}
            maxLength={400}
            placeholder="Texto da pergunta"
            onKeyDown={(event) => {
              if (event.key === 'Escape' && !loading) {
                onCancel?.();
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="mensagem_alerta"
          label="Mensagem de alerta:"
          rules={[{ max: 255, message: 'A mensagem de alerta deve ter no maximo 255 caracteres.' }]}
        >
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 4 }} maxLength={255} placeholder="Mensagem de alerta" />
        </Form.Item>

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
