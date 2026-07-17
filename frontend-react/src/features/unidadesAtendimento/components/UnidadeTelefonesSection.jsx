import { Button, Form, Input, Select } from 'antd';

import { UNIDADE_ATENDIMENTO_PHONE_TYPES } from '../constants/unidadeAtendimentoOptions.js';

function PhoneRow({ index }) {
  return (
    <div className="unidades-atendimento-phone-row">
      <Form.Item name={`fone${index}_tipo`} className="unidades-atendimento-phone-col unidades-atendimento-phone-type" aria-label={`Tipo do telefone ${index}`}>
        <Select options={UNIDADE_ATENDIMENTO_PHONE_TYPES} />
      </Form.Item>
      <Form.Item name={`fone${index}`} className="unidades-atendimento-phone-col unidades-atendimento-phone-number" aria-label={`Telefone ${index}`}>
        <Input maxLength={40} />
      </Form.Item>
      <Form.Item name={`contato${index}`} className="unidades-atendimento-phone-col unidades-atendimento-phone-contact" aria-label={`Contato ${index}`}>
        <Input maxLength={120} />
      </Form.Item>
      <Button className="unidades-atendimento-wa-button" disabled title="WA não possui integração nesta etapa">
        WA
      </Button>
    </div>
  );
}

export function UnidadeTelefonesSection() {
  return (
    <section className="unidades-atendimento-block unidades-atendimento-block-telefones">
      <div className="unidades-atendimento-phone-header">
        <span>Telefones</span>
        <span>Número</span>
        <span>Contato</span>
        <span aria-hidden="true">ação</span>
      </div>
      <div className="unidades-atendimento-phone-stack">
        <PhoneRow index={1} />
        <PhoneRow index={2} />
        <PhoneRow index={3} />
        <PhoneRow index={4} />
      </div>
    </section>
  );
}
