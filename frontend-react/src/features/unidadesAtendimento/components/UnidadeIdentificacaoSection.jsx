import { Form, Input } from 'antd';

export function UnidadeIdentificacaoSection() {
  return (
    <section className="unidades-atendimento-block unidades-atendimento-block-identificacao">
      <div className="unidades-atendimento-grid unidades-atendimento-grid-identificacao">
        <Form.Item name="codigo" label="Código" className="unidades-atendimento-field unidades-atendimento-field-codigo">
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item name="nome" label="Nome da unidade de atendimento" className="unidades-atendimento-field unidades-atendimento-field-nome" rules={[{ required: true, message: 'Informe o nome da unidade.' }]}>
          <Input maxLength={180} />
        </Form.Item>
      </div>
    </section>
  );
}
