import { Checkbox, Form, Input } from 'antd';

export function UnidadeMetadataSection() {
  return (
    <section className="unidades-atendimento-block unidades-atendimento-block-metadata">
      <Form.Item name="inativo" valuePropName="checked" className="unidades-atendimento-field unidades-atendimento-field-status">
        <Checkbox>Inativar unidade</Checkbox>
      </Form.Item>
      <div className="unidades-atendimento-divider" aria-hidden="true" />
      <div className="unidades-atendimento-grid unidades-atendimento-grid-metadata">
        <Form.Item name="inclusao" label="Inclusão" className="unidades-atendimento-field unidades-atendimento-field-metadata">
          <Input readOnly />
        </Form.Item>
        <Form.Item name="alteracao" label="Alteração" className="unidades-atendimento-field unidades-atendimento-field-metadata">
          <Input readOnly />
        </Form.Item>
      </div>
    </section>
  );
}
