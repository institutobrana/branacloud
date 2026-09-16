import { Checkbox, Input, Select } from 'antd';

function Field({ label, children }) { return <label className="convenios-planos-convenio-modal-field"><span>{label}</span>{children}</label>; }
function TextField({ label, value, onChange, maxLength }) { return <Field label={label}><Input maxLength={maxLength} value={value} onChange={(event) => onChange(event.target.value)} /></Field>; }

export function ConvenioDetalhesTab({ form, onChange }) {
  return <div className="convenios-planos-convenio-modal-pane convenios-planos-convenio-modal-details-pane" aria-label="Conteúdo da aba Detalhes">
    <div className="convenios-planos-convenio-modal-grid-row convenio-row-two-columns"><TextField label="E-mail de contato" value={form.email} maxLength={180} onChange={(value) => onChange('email', value)} /><TextField label="E-mail depto técnico" value={form.email_tecnico} maxLength={180} onChange={(value) => onChange('email_tecnico', value)} /></div>
    <div className="convenios-planos-convenio-modal-grid-row convenio-row-two-columns"><TextField label="Home-page" value={form.homepage} maxLength={180} onChange={(value) => onChange('homepage', value)} /><TextField label="CNPJ" value={form.cnpj} maxLength={30} onChange={(value) => onChange('cnpj', value)} /></div>
    <div className="convenios-planos-convenio-modal-grid-row convenio-row-two-columns"><TextField label="Inscrição estadual" value={form.inscricao_estadual} maxLength={40} onChange={(value) => onChange('inscricao_estadual', value)} /><TextField label="Inscrição municipal" value={form.inscricao_municipal} maxLength={40} onChange={(value) => onChange('inscricao_municipal', value)} /></div>
    <Field label="Modalidade de faturamento"><Select value={form.tipo_faturamento} options={[{ value: 1, label: 'Parcial' }, { value: 2, label: 'Total' }]} onChange={(value) => onChange('tipo_faturamento', value)} /></Field>
    <Field label="Observações"><Input.TextArea rows={7} value={form.observacoes} onChange={(event) => onChange('observacoes', event.target.value)} /></Field>
    <Checkbox checked={form.inativo} onChange={(event) => onChange('inativo', event.target.checked)}>Inativar convênio</Checkbox>
  </div>;
}
