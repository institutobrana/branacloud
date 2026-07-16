import { Form, Input, InputNumber } from 'antd';

import { formatMoneyInput, parsePtBrDecimal, parsePtBrInteger } from '../utils/servicosProteticoCreatePayload.js';

export function ServicoProteticoForm({ loading = false }) {
  const form = Form.useFormInstance();

  return (
    <div className="servicos-protetico-form-compact">
      <Form.Item
        name="codigo"
        label="Código"
        className="servicos-protetico-form-item"
        rules={[
          { required: true, whitespace: true, message: 'Informe o código.' },
          { max: 30, message: 'O código deve ter no máximo 30 caracteres.' },
        ]}
      >
        <Input autoFocus maxLength={30} placeholder="Código do serviço" />
      </Form.Item>

      <Form.Item
        name="nome"
        label="Nome do serviço"
        className="servicos-protetico-form-item"
        rules={[
          { required: true, whitespace: true, message: 'Informe o nome do serviço.' },
          { max: 180, message: 'O nome do serviço deve ter no máximo 180 caracteres.' },
        ]}
      >
        <Input maxLength={180} placeholder="Nome do serviço" />
      </Form.Item>

      <Form.Item
        name="indice"
        label="Índice"
        className="servicos-protetico-form-item servicos-protetico-form-item-half"
        rules={[
          { required: true, whitespace: true, message: 'Informe o índice.' },
        ]}
      >
        <Input maxLength={10} placeholder="Ex.: R$" />
      </Form.Item>

      <div className="servicos-protetico-form-row">
        <Form.Item
          name="preco"
          label="Preço"
          className="servicos-protetico-form-item servicos-protetico-form-item-half"
          rules={[
            {
              validator: (_, value) => {
                const raw = String(value ?? '').trim();
                if (!raw) return Promise.resolve();
                return parsePtBrDecimal(raw) === null ? Promise.reject(new Error('Informe um preço válido.')) : Promise.resolve();
              },
            },
          ]}
        >
          <Input
            inputMode="decimal"
            placeholder="0,00"
            maxLength={20}
            onBlur={(event) => {
              const parsed = parsePtBrDecimal(event.target.value);
              if (parsed === null) return;
              form.setFieldsValue({ preco: formatMoneyInput(parsed) });
            }}
          />
        </Form.Item>

        <Form.Item
          name="prazo"
          label="Prazo (Tempo médio em dias)"
          className="servicos-protetico-form-item servicos-protetico-form-item-half"
          rules={[
            {
              validator: (_, value) => {
                const raw = String(value ?? '').trim();
                if (!raw) return Promise.reject(new Error('Informe o prazo.'));
                const parsed = parsePtBrInteger(raw);
                if (parsed === null) return Promise.reject(new Error('Informe um prazo válido.'));
                if (parsed < 0) return Promise.reject(new Error('O prazo não pode ser negativo.'));
                if (String(parsed) !== raw.replace(/\./g, '').replace(',', '.')) return Promise.reject(new Error('O prazo deve ser inteiro.'));
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={1}
            precision={0}
            placeholder="0"
            controls
          />
        </Form.Item>
      </div>

      <Form.Item
        name="descricao"
        label="Descrição"
        className="servicos-protetico-form-item"
      >
        <Input.TextArea
          placeholder="Descrição do serviço/observações"
          autoSize={{ minRows: 2, maxRows: 4 }}
          maxLength={2000}
        />
      </Form.Item>
    </div>
  );
}
