import { Alert, Input, Select } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';

function Field({ label, children, className = '' }) { return <label className={`convenios-planos-convenio-modal-field ${className}`}>{label ? <span>{label}</span> : null}{children}</label>; }
function TextField({ label, value, onChange, maxLength, className = '', autoFocus = false, readOnly = false, onBlur, onKeyDown }) { return <Field label={label} className={className}><Input autoFocus={autoFocus} readOnly={readOnly} maxLength={maxLength} value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} onKeyDown={onKeyDown} /></Field>; }
function LookupField({ label, value, options, onChange, loading }) { return <Field label={label}><Select value={value || undefined} options={options} loading={loading} allowClear onChange={(next) => onChange(next || '')} /></Field>; }
const PHONE_ROWS = [['tipo_fone1', 'telefone', 'contato1'], ['tipo_fone2', 'telefone2', 'contato2'], ['tipo_fone3', 'telefone3', 'contato3'], ['tipo_fone4', 'telefone4', 'contato4']];

export function ConvenioPrincipalTab({ form, options, loading, error, cepLookupLoading, cepLookupError, lookupCep, onChange }) {
  const text = (label, field, maxLength, className, autoFocus = false) => <TextField label={label} value={form[field]} maxLength={maxLength} className={className} autoFocus={autoFocus} onChange={(value) => onChange(field, value)} />;
  const cepField = <TextField label="CEP" value={form.cep} maxLength={20} onChange={(value) => { onChange('cep', value); if (value.replace(/\D/g, '').length === 8) void lookupCep(value); }} onBlur={(event) => void lookupCep(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === 'Tab') void lookupCep(event.currentTarget.value); }} />;
  return (
    <div className="convenios-planos-convenio-modal-pane" aria-label="Conteúdo da aba Principal">
      {error ? <Alert className="convenios-planos-convenio-modal-lookup-error" type="warning" showIcon message={error} /> : null}
      <div className="convenios-planos-convenio-modal-grid-row convenio-row-code-name">
        {text('Código', 'codigo', 20, '', true)}{text('Nome do convênio', 'nome', 120)}
      </div>
      <div className="convenios-planos-convenio-modal-grid-row convenio-row-company">
        {text('Razão social da operadora', 'razao_social', 160)}{text('Código ANS', 'codigo_ans', 20)}
      </div>
      <div className="convenios-planos-convenio-modal-grid-row convenio-row-address">
        <LookupField label="Logradouro" value={form.tipo_logradouro} options={options.logradouro} loading={loading} onChange={(value) => onChange('tipo_logradouro', value)} />
        {text('Endereço', 'endereco', 180)}{text('Nº', 'numero', 20)}{text('Complemento', 'complemento', 120)}
      </div>
      <div className="convenios-planos-convenio-modal-grid-row convenio-row-location">
        <LookupField label="Bairro" value={form.bairro} options={options.bairro} loading={loading} onChange={(value) => onChange('bairro', value)} />
        <LookupField label="Cidade" value={form.cidade} options={options.cidade} loading={loading} onChange={(value) => onChange('cidade', value)} />
        {cepField}{text('UF', 'uf', 10)}
      </div>
      {cepLookupLoading ? <div className="convenios-planos-convenio-modal-cep-feedback">Consultando CEP...</div> : null}
      {cepLookupError ? <div className="convenios-planos-convenio-modal-cep-feedback convenios-planos-convenio-modal-cep-error">{cepLookupError}</div> : null}
      <div className="convenios-planos-convenio-modal-divider" />
      <div className="convenios-planos-convenio-modal-phone-header"><span>Telefones:</span><span>Número</span><span>Contato</span><span aria-hidden="true" /></div>
      {PHONE_ROWS.map(([typeField, phoneField, contactField]) => <div className="convenios-planos-convenio-modal-phone-row" key={typeField}><LookupField label="" value={form[typeField]} options={options.contato} loading={loading} onChange={(value) => onChange(typeField, value)} />{text('', phoneField, 40)}{text('', contactField, 120)}<span className="convenios-planos-convenio-modal-phone-icon" aria-hidden="true"><WhatsAppOutlined /></span></div>)}
      <div className="convenios-planos-convenio-modal-grid-row convenio-row-timestamps">
        <TextField label="Inclusão" value={form.data_inclusao} maxLength={40} readOnly className="convenios-planos-convenio-modal-readonly" onChange={() => {}} />
        <TextField label="Alteração" value={form.data_alteracao} maxLength={40} readOnly className="convenios-planos-convenio-modal-readonly" onChange={() => {}} />
      </div>
    </div>
  );
}
