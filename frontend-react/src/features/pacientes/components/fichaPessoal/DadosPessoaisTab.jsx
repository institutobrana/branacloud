import { AutoComplete, Button, DatePicker, Input, Select, Tooltip } from 'antd';
import { useRef } from 'react';
import { MailOutlined, WhatsAppOutlined } from '@ant-design/icons';
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
const isClearlyValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim());
const normalizeWhatsAppNumber = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return digits;
  return '';
};

function Field({ label, children, className = '' }) { return <label className={`ficha-dados-field ${className}`}><span>{label}</span>{children}</label>; }
function TextField({ label, value, onChange, className, readOnly, onBlur, onKeyDown, maxLength }) { return <Field label={label} className={className}><Input value={value} maxLength={maxLength} readOnly={readOnly} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} onKeyDown={onKeyDown} /></Field>; }
function SelectField({ label, value, options, onChange, className, loading, disabled, popupClassName }) { return <Field label={label} className={className}><Select value={value || undefined} options={options} loading={loading} disabled={disabled} placeholder="Selecione..." popupClassName={popupClassName} onChange={onChange} /></Field>; }
export function DateField({ label, value, onChange, className }) {
  const commit = (event) => onChange(normalizeFichaDateInput(event.target.value));
  const selectText = (event) => requestAnimationFrame(() => event.target.select());
  const parsedValue = value ? (dayjs.isDayjs(value) ? value : normalizeFichaDateInput(value)) : null;
  return <Field label={label} className={className}><DatePicker value={parsedValue} format="DD/MM/YYYY" onChange={onChange} onFocus={selectText} onClick={selectText} onBlur={commit} /></Field>;
}

function EmailField({ value, onChange }) {
  const email = String(value ?? '').trim();
  const openEmailClient = () => {
    if (!isClearlyValidEmail(email)) return;
    window.location.href = `mailto:${encodeURIComponent(email)}`;
  };

  return <div className="ficha-dados-email-field">
    <TextField label="E-Mail" value={value} onChange={onChange} />
    <Tooltip title="Enviar e-mail">
      <Button
        type="text"
        size="small"
        icon={<MailOutlined />}
        aria-label="Enviar e-mail"
        disabled={!isClearlyValidEmail(email)}
        onClick={openEmailClient}
      />
    </Tooltip>
  </div>;
}

function WhatsAppButton({ value }) {
  const number = normalizeWhatsAppNumber(value);
  const openWhatsApp = () => {
    if (!number) return;
    window.open(`https://wa.me/${number}`, '_blank', 'noopener,noreferrer');
  };

  return <Tooltip title="Abrir no WhatsApp">
    <Button
      type="text"
      icon={<WhatsAppOutlined />}
      aria-label="Abrir no WhatsApp"
      disabled={!number}
      onClick={openWhatsApp}
    />
  </Tooltip>;
}

export function DadosPessoaisTab({ form, setField, idade, catalogs, loading, error, lookupCep, cepLookupLoading, cepLookupError, buscarIndicacao, limparIndicacao, indicacaoResultados, indicacaoLoading }) {
  const indicacaoTimer = useRef(null);
  const fotoInputRef = useRef(null);
  const statusOptions = selectOptions(catalogs.menu?.filtro_status || [])
    .filter((item) => item.value !== 0 && !/todos/i.test(item.label))
    .map((item) => ({ value: item.label, label: item.label }));
  const statusValue = statusCodeLabels[String(form.status ?? '').trim()] || form.status;
  const convenioOptions = selectOptions(catalogs.convenios, 'nome');
  const convenioSelecionado = Number(form.id_convenio || 0);
  const planoOptions = convenioSelecionado > 0
    ? selectOptions(catalogs.planos.filter((item) => Number(item.convenio_id || 0) === convenioSelecionado), 'nome')
    : [];
  const tabelaOptions = selectOptions(catalogs.tabelas, 'nome');
  const handleCepChange = (value) => {
    setField('cep', value);
    if (value.replace(/\D/g, '').length === 8) lookupCep?.(value);
  };
  const tipoIndicacaoLabel = (catalogs.tiposIndicacao || []).find((item) => normalizeCatalogValue(item.codigo) === form.tipoIndicacao)?.descricao || '';
  const tipoIndicacaoNormalizado = tipoIndicacaoLabel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const indicacaoEntidade = tipoIndicacaoNormalizado === 'paciente' ? 'paciente' : tipoIndicacaoNormalizado === 'contato' ? 'contato' : '';
  const indicacaoOptions = (indicacaoResultados || []).map((item) => ({ value: item.nome, label: item.nome }));
  const pesquisarIndicacao = (value) => {
    if (indicacaoTimer.current) clearTimeout(indicacaoTimer.current);
    if (!indicacaoEntidade || String(value || '').trim().length < 2) {
      limparIndicacao?.();
      return;
    }
    indicacaoTimer.current = setTimeout(() => buscarIndicacao?.(indicacaoEntidade, value), 250);
  };
  const selecionarFoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!String(file.type || '').toLowerCase().startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setField('fotoDataUrl', String(reader.result || ''));
      setField('fotoNome', String(file.name || ''));
    };
    reader.readAsDataURL(file);
  };
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
          <SelectField label="Tipo de indicação" value={form.tipoIndicacao} options={indicationOptions(catalogs.tiposIndicacao || [])} onChange={(v) => { limparIndicacao?.(); setField('tipoIndicacao', normalizeCatalogValue(v)); }} loading={loading} popupClassName="ficha-dados-indication-dropdown" />
          <div className="ficha-dados-indicated"><Field label="Indicado por"><AutoComplete value={form.indicadoPor} options={indicacaoOptions} onChange={(v) => setField('indicadoPor', v)} onSelect={(v) => setField('indicadoPor', v)} onSearch={pesquisarIndicacao} notFoundContent={indicacaoLoading ? 'Pesquisando...' : 'Nenhum resultado'} placeholder={indicacaoEntidade === 'paciente' ? 'Digite o nome do paciente' : indicacaoEntidade === 'contato' ? 'Digite o nome do contato' : ''} /></Field></div>
        </div>
      </div>
      <button type="button" className={`ficha-dados-photo${form.fotoDataUrl ? ' has-photo' : ''}`} onClick={() => fotoInputRef.current?.click()} aria-label="Selecionar fotografia do paciente">
        {form.fotoDataUrl ? <img src={form.fotoDataUrl} alt={form.fotoNome || 'Fotografia do paciente'} /> : <>Clique aqui<br />para inserir<br />a fotografia</>}
      </button>
      <input ref={fotoInputRef} className="ficha-dados-hidden-file" type="file" accept="image/*" onChange={selecionarFoto} />
    </div>
    <div className="ficha-dados-grid ficha-dados-address-one">
      <SelectField label="Correspondência" value={form.correspondencia} options={correspondenceOptions} onChange={(v) => setField('correspondencia', v)} />
      <TextField label="Endereço" value={form.endereco} onChange={(v) => setField('endereco', v)} />
      <TextField label="Complemento" value={form.complemento} onChange={(v) => setField('complemento', v)} />
      <TextField label="Bairro" value={form.bairro} onChange={(v) => setField('bairro', v)} />
    </div>
    <div className="ficha-dados-grid ficha-dados-address-two">
      <TextField label="Cidade" value={form.cidade} onChange={(v) => setField('cidade', v)} />
      <TextField label="CEP" value={form.cep} onChange={handleCepChange} onBlur={(event) => lookupCep?.(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === 'Tab') lookupCep?.(event.currentTarget.value); }} />
      <SelectField label="UF" value={form.uf} options={ufOptions} onChange={(v) => setField('uf', v)} />
      <EmailField value={form.email} onChange={(v) => setField('email', v)} />
    </div>
    <div className="ficha-dados-lower-grid">
      <section className="ficha-dados-group"><strong>Telefones:</strong>{[1, 2, 3, 4].map((n) => <div className="ficha-phone-row" key={n}><Select value={form[`tipo_fone${n}`]} options={phoneTypes} onChange={(v) => setField(`tipo_fone${n}`, v)} /><Input value={form[`fone${n}`]} onChange={(e) => setField(`fone${n}`, e.target.value)} /><WhatsAppButton value={form[`fone${n}`]} /></div>)}</section>
      <section className="ficha-dados-group ficha-dados-convenio"><strong>Convênio / Plano:</strong><div className="ficha-dados-grid two"><SelectField label="Convênio" value={form.id_convenio} options={convenioOptions} onChange={(v) => { const nextConvenio = Number(v || 0); const currentPlano = catalogs.planos.find((item) => Number(item.id || 0) === Number(form.id_plano || 0)); setField('id_convenio', v); if (!nextConvenio || !currentPlano || Number(currentPlano.convenio_id || 0) !== nextConvenio) setField('id_plano', null); }} loading={loading} /><SelectField label="Plano" value={form.id_plano} options={planoOptions} onChange={(v) => setField('id_plano', v)} loading={loading} disabled={convenioSelecionado <= 0} /></div><div className="ficha-dados-grid two"><TextField label="Nº carteira Particular" value={form.carteira} onChange={(v) => setField('carteira', v)} /><DateField label="Data de validade" value={form.validade} onChange={(v) => setField('validade', v)} /></div><div className="ficha-dados-grid two"><SelectField label="Tabela" value={form.tabela} options={tabelaOptions} onChange={(v) => setField('tabela', v)} loading={loading} /><TextField label="Nº do cartão nacional de saúde" value={form.cns} onChange={(v) => setField('cns', v)} /></div></section>
    </div>
    <div className="ficha-dados-grid ficha-dados-footer-fields"><div className="ficha-dados-return"><TextField label="Próximo retorno" value={form.proximoRetorno} onChange={() => {}} readOnly className="ficha-dados-readonly-cyan" /><Button size="small" disabled>...</Button></div><TextField label="Inclusão" value={form.inclusao} onChange={() => {}} readOnly className="ficha-dados-readonly-cyan" /><TextField label="Alteração" value={form.alteracao} onChange={() => {}} readOnly className="ficha-dados-readonly-cyan" /></div>
    {cepLookupLoading ? <div className="ficha-dados-cep-feedback">Consultando CEP...</div> : null}
    {cepLookupError ? <div className="ficha-dados-cep-feedback ficha-dados-cep-error">{cepLookupError}</div> : null}
  </div>;
}
