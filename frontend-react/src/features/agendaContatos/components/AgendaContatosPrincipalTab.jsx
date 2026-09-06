import * as React from 'react';
import { Checkbox, Input, Select } from 'antd';
import { MailOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useAgendaContatosCep } from '../hooks/useAgendaContatosCep.js';

const UF_OPTIONS = ['SP', 'RJ', 'MG', 'PR', 'SC', 'RS'].map((value) => ({ value, label: value }));
const DAY_OPTIONS = [{ value: '', label: '' }, ...Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }))];
const MONTH_OPTIONS = [{ value: '', label: '' }, ...Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }))];
const PHONE_TYPE_LABELS = { '1': 'Residencial', '2': 'Comercial', '3': 'Fax', '4': 'Celular', '5': 'Recado' };
const PHONE_TYPE_OPTIONS = Object.entries(PHONE_TYPE_LABELS).map(([value, label]) => ({ value, label }));
export const EMPTY_FORM = { nome: '', tipo: '', contato: '', aniversario_dia: '', aniversario_mes: '', endereco: '', complemento: '', bairro: '', cidade: '', cep: '', uf: '', pais: '', tel1_tipo: '', tel1: '', tel2_tipo: '', tel2: '', tel3_tipo: '', tel3: '', tel4_tipo: '', tel4: '', email: '', homepage: '', incluir_malas_diretas: false, incluir_preferidos: false, palavra_chave_1: '', palavra_chave_2: '', registro: '', especialidade: '', observacoes: '' };
const toOptions = (items) => items.map((item) => ({ value: item.descricao || '', label: item.descricao || '' }));

function Field({ label, children, className = '' }) { return <label className={`agenda-contatos-modal-field ${className}`}><span>{label}</span>{children}</label>; }

function PhoneRow({ slot, value, type, onChange }) {
  const options = type && !PHONE_TYPE_OPTIONS.some((option) => option.value === type)
    ? [...PHONE_TYPE_OPTIONS, { value: type, label: type }]
    : PHONE_TYPE_OPTIONS;
  return <div className="agenda-contatos-phone-row"><Select aria-label={`Tipo telefone ${slot}`} value={type} options={options} onChange={(next) => onChange(`tel${slot}_tipo`, next)} /><Input aria-label={`Telefone ${slot}`} maxLength={40} value={value} onChange={(event) => onChange(`tel${slot}`, event.target.value)} /><span className="agenda-contatos-phone-icon" aria-hidden="true"><WhatsAppOutlined /></span></div>;
}

export function AgendaContatosPrincipalTab({ form, lookups, onChange }) {
  React.useEffect(() => {
    if (lookups.types.length && !form.tipo) {
      const first = lookups.types[0].descricao || '';
      onChange({ tipo: first });
    }
  }, [lookups.types, form.tipo]);
  React.useEffect(() => {
    if (!form.cidade && lookups.cidades.length) {
      const city = lookups.cidades.find((item) => item.descricao === 'São José do Rio Preto');
      if (city) onChange({ cidade: city.descricao });
    }
  }, [lookups.cidades, form.cidade]);
  const change = (key, value) => onChange({ [key]: value });
  const types = toOptions(lookups.types);
  const withCurrentOption = (items, current) => {
    const options = toOptions(items);
    return current && !options.some((option) => option.value === current) ? [...options, { value: current, label: current }] : options;
  };
  const bairros = [{ value: '', label: '' }, ...withCurrentOption(lookups.bairros, form.bairro)];
  const cidades = [{ value: '', label: '' }, ...withCurrentOption(lookups.cidades, form.cidade)];
  const cep = useAgendaContatosCep({ form, onChange, bairros: lookups.bairros, cidades: lookups.cidades });
  const text = (key, maxLength) => <Input maxLength={maxLength} value={form[key]} onChange={(event) => change(key, event.target.value)} />;
  const cepInput = <Input maxLength={20} value={form.cep} onChange={(event) => { const value = event.target.value; change('cep', value); if (value.replace(/\D/g, '').length === 8) cep.lookupCep(value); }} onBlur={(event) => cep.lookupCep(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === 'Tab') cep.lookupCep(event.currentTarget.value); }} />;
  return <div className="agenda-contatos-modal-pane agenda-contatos-modal-principal" aria-label="Principal">
    {lookups.error ? <div className="agenda-contatos-lookup-error" role="status">{lookups.error}</div> : null}
    <div className="agenda-contatos-principal-grid">
      <Field label="Nome">{text('nome', 180)}</Field><Field label="Tipo"><Select value={form.tipo} options={types} loading={lookups.loading} onChange={(value) => change('tipo', value)} /></Field>
      <Field label="Contato">{text('contato', 120)}</Field><Field label="Data de aniversário" className="agenda-contatos-birthday"><Select aria-label="Dia de aniversário" value={form.aniversario_dia} options={DAY_OPTIONS} onChange={(value) => change('aniversario_dia', value)} /><Select aria-label="Mês de aniversário" value={form.aniversario_mes} options={MONTH_OPTIONS} onChange={(value) => change('aniversario_mes', value)} /></Field>
      <div className="agenda-contatos-address-grid"><Field label="Endereço">{text('endereco', 180)}</Field><Field label="Complemento">{text('complemento', 120)}</Field><Field label="Bairro"><Select value={form.bairro} options={bairros} loading={lookups.loading} onChange={(value) => change('bairro', value)} /></Field></div>
      <div className="agenda-contatos-city-grid"><Field label="Cidade"><Select value={form.cidade} options={cidades} loading={lookups.loading} onChange={(value) => change('cidade', value)} /></Field><Field label="CEP">{cepInput}</Field><Field label="UF"><Select value={form.uf} options={UF_OPTIONS} onChange={(value) => change('uf', value)} /></Field><Field label="País">{text('pais', 80)}</Field></div>
      {cep.loading ? <div className="agenda-contatos-cep-feedback" role="status">Consultando CEP...</div> : null}
      {cep.error ? <div className="agenda-contatos-cep-feedback agenda-contatos-cep-error" role="status">{cep.error}</div> : null}
      <div className="agenda-contatos-phones-area"><div className="agenda-contatos-phone-list">{[1, 2, 3, 4].map((slot) => <PhoneRow key={slot} slot={slot} value={form[`tel${slot}`]} type={form[`tel${slot}_tipo`]} onChange={change} />)}</div><div className="agenda-contatos-contact-side"><Field label="E-mail"><Input type="email" maxLength={180} value={form.email} onChange={(event) => change('email', event.target.value)} /></Field><span className="agenda-contatos-email-icon" aria-hidden="true"><MailOutlined /></span><Field label="Home-page">{text('homepage', 180)}</Field><Checkbox checked={form.incluir_malas_diretas} onChange={(event) => change('incluir_malas_diretas', event.target.checked)}>Incluir nas malas diretas</Checkbox><Checkbox checked={form.incluir_preferidos} onChange={(event) => change('incluir_preferidos', event.target.checked)}>Incluir na lista de preferidos</Checkbox></div></div>
    </div>
  </div>;
}
