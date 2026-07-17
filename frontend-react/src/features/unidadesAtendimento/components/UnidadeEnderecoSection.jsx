import { Form, Input, Select } from 'antd';

export function UnidadeEnderecoSection({
  logradouroOptions = [],
  bairroOptions = [],
  cidadeOptions = [],
  ufOptions = [],
}) {
  return (
    <section className="unidades-atendimento-block unidades-atendimento-block-endereco">
      <div className="unidades-atendimento-grid unidades-atendimento-grid-endereco-primary">
        <Form.Item name="logradouro_tipo" label="Endereço" className="unidades-atendimento-field unidades-atendimento-field-logradouro">
          <Select options={logradouroOptions} allowClear showSearch optionFilterProp="label" placeholder="" />
        </Form.Item>
        <Form.Item name="endereco" label=" " className="unidades-atendimento-field unidades-atendimento-field-endereco">
          <Input maxLength={180} />
        </Form.Item>
        <Form.Item name="numero" label="Nº" className="unidades-atendimento-field unidades-atendimento-field-numero">
          <Input maxLength={30} />
        </Form.Item>
        <Form.Item name="complemento" label="Complemento" className="unidades-atendimento-field unidades-atendimento-field-complemento">
          <Input maxLength={120} />
        </Form.Item>
      </div>
      <div className="unidades-atendimento-grid unidades-atendimento-grid-endereco-secondary">
        <Form.Item name="bairro" label="Bairro" className="unidades-atendimento-field unidades-atendimento-field-bairro">
          <Select options={bairroOptions} allowClear showSearch optionFilterProp="label" placeholder="" />
        </Form.Item>
        <Form.Item name="cidade" label="Cidade" className="unidades-atendimento-field unidades-atendimento-field-cidade">
          <Select options={cidadeOptions} allowClear showSearch optionFilterProp="label" placeholder="" />
        </Form.Item>
        <Form.Item name="cep" label="CEP" className="unidades-atendimento-field unidades-atendimento-field-cep">
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item name="uf" label="UF" className="unidades-atendimento-field unidades-atendimento-field-uf">
          <Select options={ufOptions} allowClear placeholder="" />
        </Form.Item>
      </div>
    </section>
  );
}
