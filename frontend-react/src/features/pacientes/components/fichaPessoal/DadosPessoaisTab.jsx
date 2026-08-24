import { Button, DatePicker, Input, Select, Tooltip } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatCpfIfValid, normalizeFichaDateInput } from './fichaPessoalFieldUtils.js';

function normalizeCatalogValue(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return undefined;
  return /^\d+$/.test(raw) ? String(Number(raw)) : raw;
}

const selectOptions = (items = [], labelKey = 'label', valueKey = 'id') => items.map((item) => ({ value: item[valueKey], label: item[labelKey] }));
const indicationOptions = (items = []) => items.map((item) => ({ value: normalizeCatalogValue(item.codigo), label: item.descricao }));
const phoneTypes = ['Residencial', 'Comercial', 'Celular', 'Recado'].map((value) => ({ value, label: value }));
const sexOptions = ['Masculino', 'Feminino', 'Outro'].map((value) => ({ value, label: value }));
const correspondenceOptions = ['Residencial', 'Comercial', 'Outro'].map((value) => ({ value, label: value }));
const ufOptions = ['SP', 'AC', 'AL', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RS', 'SC', 'SE'].map((value) => ({ value, label: value }));
const statusCodeLabels = { 1: 'Inativo', 2: 'Ativo', 3: 'Em tratamento', 4: 'Faleceu' };

function Field({ label, children, className = '' }) { return <label className={`ficha-dados-field ${className}`}><span>{label}</span>{children}</label>; }
function TextField({ label, value, onChange, className, readOnly, onBlur, onKeyDown, maxLength }) { return <Field label={label} className={className}><Input value={value} maxLength={maxLength} readOnly={readOnly} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} onKeyDown={onKeyDown} /></Field>; }
function SelectField({ label, value, options, onChange, className, loading, disabled, popupClassName }) { return <Field label={label} className={className}><Select value={value || undefined} options={options} loading={loading} disabled={disabled} placeholder="Selecione..." popupClassName={popupClassName} onChange={onChange} /></Field>; }
function DateField({ label, value, onChange, className }) {
  const commit = (event) => onChange(normalizeFichaDateInput(event.target.value));
  const selectText = (event) => requestAnimationFrame(() => event.target.select());
  const parsedValue = value ? (dayjs.isDayjs(value) ? value : normalizeFichaDateInput(value)) : null;
  return <Field label={label} className={className}><DatePicker value={parsedValue} format="DD/MM/YYYY" onChange={onChange} onFocus={selectText} onClick={selectText} onBlur={commit} /></Field>;
}

export function DadosPessoaisTab({ form, setField, idade, catalogs, loading, error }) {
  const statusOptions = selectOptions(catalogs.menu?.filtro_status || [])
    .filter((item) => item.value !== 0 && !/todos/i.test(item.label))
    .map((item) => ({ value: item.label, label: item.label }));
  const statusValue = statusCodeLabels[String(form.status ?? '').trim()] || form.status;
  const convenioOptions = selectOptions(catalogs.convenios, 'nome');
  const planoOptions = selectOptions(catalogs.planos.filter((item) => !form.id_convenio || item.convenio_id === form.id_convenio), 'nome');
  const tabelaOptions = selectOptions(catalogs.tabelas, 'nome');
  return <div className="ficha-dados-tab">
    {error ? <div className="ficha-dados-error">{error}</div> : null}
    <div className="ficha-dados-top-grid">
      <div className="ficha-dados-top-fields">
        <div className="ficha-dados-grid ficha-dados-identificacao">
          <TextField label="N" value={form.codigo} onChange={() => {}} readOnly className="field-code" />
          <TextField label="Nome" value={form.nome} onChange={(v) => setField('nome', v)} className="field-name" />
          <TextField label="Sobrenome" value={form.sobrenome} onChange={(v) => setField('sobrenome', v)} className="field-surname" />
        </div>
        <div className="ficha-dados-grid ficha-dados-general">
          <SelectField label="Sexo" value={form.sexo} options={sexOptions} onChange={(v) => setField('sexo', v)} />
          <DateField label="Nascimento" value={form.nascimento} onChange={(v) => setField('nascimento', v)} />
          <Field label="Idade"><Input value={idade} readOnly /></Field>
          <DateField label="Data de cadastro" value={form.dataCadastro} onChange={(v) => setField('dataCadastro', v)} />
          <SelectField label="Situação" value={statusValue} options={statusOptions} onChange={(v) => setField('status', v)} loading={loading} />
        </div>
        <div className="ficha-dados-grid ficha-dados-identification-extra">
          <TextField label="CPF" value={form.cpf} onChange={(v) => setField('cpf', v)} onBlur={(event) => setField('cpf', formatCpfIfValid(event.target.value))} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === 'Tab') setField('cpf', formatCpfIfValid(event.currentTarget.value)); }} maxLength={14} />
          <TextField label="RG" value={form.rg} onChange={(v) => setField('rg', v)} />
          <SelectField label="Tipo de indicação" value={form.tipoIndicacao} options={indicationOptions(catalogs.tiposIndicacao || [])} onChange={(v) => setField('tipoIndicacao', normalizeCatalogValue(v))} loading={loading} popupClassName="ficha-dados-indication-dropdown" />
          <div className="ficha-dados-indicated"><TextField label="Indicado por" value={form.indicadoPor} onChange={(v) => setField('indicadoPor', v)} /><Button size="small" disabled>...</Button></div>
        </div>
      </div>
      <div className="ficha-dados-photo">Clique aqui<br />para inserir<br />a fotografia</div>
    </div>
    <div className="ficha-dados-grid ficha-dados-address-one">
      <SelectField label="Correspondência" value={form.correspondencia} options={correspondenceOptions} onChange={(v) => setField('correspondencia', v)} />
      <TextField label="Endereço" value={form.endereco} onChange={(v) => setField('endereco', v)} />
      <TextField label="Complemento" value={form.complemento} onChange={(v) => setField('complemento', v)} />
      <TextField label="Bairro" value={form.bairro} onChange={(v) => setField('bairro', v)} />
    </div>
    <div className="ficha-dados-grid ficha-dados-address-two">
      <TextField label="Cidade" value={form.cidade} onChange={(v) => setField('cidade', v)} />
      <TextField label="CEP" value={form.cep} onChange={(v) => setField('cep', v)} />
      <SelectField label="UF" value={form.uf} options={ufOptions} onChange={(v) => setField('uf', v)} />
      <TextField label="E-Mail" value={form.email} onChange={(v) => setField('email', v)} />
      <span className="ficha-dados-email-indicator" aria-hidden="true" />
    </div>
    <div className="ficha-dados-lower-grid">
      <section className="ficha-dados-group"><strong>Telefones:</strong>{[1, 2, 3, 4].map((n) => <div className="ficha-phone-row" key={n}><Select value={form[`tipo_fone${n}`]} options={phoneTypes} onChange={(v) => setField(`tipo_fone${n}`, v)} /><Input value={form[`fone${n}`]} onChange={(e) => setField(`fone${n}`, e.target.value)} /><Tooltip title="WhatsApp disponível em etapa posterior"><Button icon={<WhatsAppOutlined />} disabled /></Tooltip></div>)}</section>
      <section className="ficha-dados-group ficha-dados-convenio"><strong>Convênio / Plano:</strong><div className="ficha-dados-grid two"><SelectField label="Convênio" value={form.id_convenio} options={convenioOptions} onChange={(v) => setField('id_convenio', v)} loading={loading} /><SelectField label="Plano" value={form.id_plano} options={planoOptions} onChange={(v) => setField('id_plano', v)} loading={loading} /></div><div className="ficha-dados-grid two"><TextField label="Nº carteira Particular" value={form.carteira} onChange={(v) => setField('carteira', v)} /><DateField label="Data de validade" value={form.validade} onChange={(v) => setField('validade', v)} /></div><div className="ficha-dados-grid two"><SelectField label="Tabela" value={form.tabela} options={tabelaOptions} onChange={(v) => setField('tabela', v)} loading={loading} /><TextField label="Nº do cartão nacional de saúde" value={form.cns} onChange={(v) => setField('cns', v)} /></div></section>
    </div>
    <div className="ficha-dados-grid ficha-dados-footer-fields"><div className="ficha-dados-return"><TextField label="Próximo retorno" value={form.proximoRetorno} onChange={() => {}} readOnly /><Button size="small" disabled>...</Button></div><TextField label="Inclusão" value={form.inclusao} onChange={() => {}} readOnly /><TextField label="Alteração" value={form.alteracao} onChange={() => {}} readOnly /></div>
  </div>;
}
