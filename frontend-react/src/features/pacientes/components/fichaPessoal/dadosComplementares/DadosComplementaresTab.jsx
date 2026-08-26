import { Checkbox } from 'antd';
import { useEffect, useRef } from 'react';
import { ComplementaryNameField, ComplementarySelectField, ComplementaryTextField } from './DadosComplementaresField.jsx';
import { formatCpfIfValid } from '../fichaPessoalFieldUtils.js';
import { optionsWithCurrent } from './dadosComplementaresOptions.js';

function Row({ children, className = '' }) { return <div className={`ficha-complementares-row ${className}`}>{children}</div>; }
function Sep() { return <div className="ficha-complementares-separator" aria-hidden="true" />; }

export function DadosComplementaresTab({ value, onChange, catalogs, loading, lookupCep, cepLookupLoading, cepLookupError, surname, nameSuggestions, nameSuggestionsLoading, buscarSugestoesSobrenome, selecionarResponsavel }) {
  const set = (field, next) => onChange({ ...value, [field]: next });
  const suggestionTimer = useRef(null);
  useEffect(() => () => suggestionTimer.current && window.clearTimeout(suggestionTimer.current), []);
  const handleCepChange = (next) => {
    set('cep_tra', next);
    if (String(next || '').replace(/\D/g, '').length === 8) lookupCep?.(next);
  };
  const text = (label, field, className) => <ComplementaryTextField label={label} value={value[field]} onChange={(next) => set(field, next)} className={className} />;
  const select = (label, field, options, className, allowClear = false) => <ComplementarySelectField label={label} value={value[field]} options={optionsWithCurrent(options, value[field])} onChange={(next) => set(field, next)} className={className} loading={loading} allowClear={allowClear} />;
  const name = (label, field, className) => <ComplementaryNameField label={label} value={value[field]} onChange={(next) => set(field, next)} className={className} suggestions={nameSuggestions} loading={nameSuggestionsLoading} onSelect={field === 'responsavel' ? selecionarResponsavel : undefined} onSearch={() => { if (suggestionTimer.current) window.clearTimeout(suggestionTimer.current); if (String(surname || '').trim().length < 2) return; suggestionTimer.current = window.setTimeout(() => buscarSugestoesSobrenome?.(), 250); }} />;
  const cpfResponsavel = <ComplementaryTextField label="CPF do responsável" value={value.cpf_responsavel} onChange={(next) => set('cpf_responsavel', next)} onBlur={(event) => set('cpf_responsavel', formatCpfIfValid(event.target.value))} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === 'Tab') set('cpf_responsavel', formatCpfIfValid(event.currentTarget.value)); }} className="span-4" />;
  return <div className="ficha-complementares-tab">
    <div className="ficha-complementares-grid">
      <Row>{text('Prontuário', 'matricula', 'span-3')}{name('Titular / responsável', 'responsavel', 'span-5')}{cpfResponsavel}</Row>
      <Row>{select('Unidade de atendimento', 'unidade_atendimento', catalogs.unidades, 'span-8')}{select('Cirurgião responsável', 'cirurgiao_responsavel', catalogs.cirurgioes, 'span-4')}</Row>
      <Sep />
      <Row>{name('Nome do pai', 'nome_pai', 'span-4')}{name('Nome da mãe', 'nome_mae', 'span-4')}{select('Estado civil', 'estado_civil_comp', catalogs.estadoCivil, 'span-4')}</Row>
      <Row>{name('Nome do cônjuge', 'nome_conjuge', 'span-4')}{text('CPF do cônjuge', 'cpf_conjuge', 'span-4')}{text('Profissão do cônjuge', 'profissao_conjuge', 'span-4')}</Row>
      <Row>{text('Apelido', 'apelido', 'span-4')}{text('Naturalidade', 'naturalidade', 'span-4')}{text('Nacionalidade', 'nacionalidade', 'span-4')}</Row>
      <Row>{text('Profissão', 'profissao', 'span-4')}{text('Local de trabalho', 'local_trabalho', 'span-4')}{text('Horário de trabalho', 'horario_trab', 'span-4')}</Row>
      <Row className="ficha-complementares-commercial-address-row">{text('Endereço comercial', 'end_tra', 'span-4')}{text('Complemento', 'com_tra', 'span-2')}{select('Bairro', 'bai_tra', catalogs.bairros, 'span-2')}{select('Cidade', 'cid_tra', catalogs.cidades, 'span-2')}{<ComplementaryTextField label="CEP" value={value.cep_tra} onChange={handleCepChange} className="span-1" onBlur={(event) => lookupCep?.(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === 'Tab') lookupCep?.(event.currentTarget.value); }} />}{select('UF', 'est_tra', catalogs.ufs, 'span-1')}</Row>
      <Sep />
      <Row>{select('Palavras-chave 1', 'palavra_chave_1', catalogs.palavrasChave, 'span-3', true)}{select('Palavras-chave 2', 'palavra_chave_2', catalogs.palavrasChave, 'span-3', true)}{select('Palavras-chave 3', 'palavra_chave_3', catalogs.palavrasChave, 'span-3', true)}{select('Palavras-chave 4', 'palavra_chave_4', catalogs.palavrasChave, 'span-3', true)}</Row>
      <Sep />
      <div className="ficha-complementares-flags"><Checkbox checked={value.publico} onChange={(event) => set('publico', event.target.checked)}>Público para a clínica</Checkbox><Checkbox checked={value.titular} onChange={(event) => set('titular', event.target.checked)}>Titular da família</Checkbox></div>
    </div>
    {cepLookupLoading ? <div className="ficha-dados-cep-feedback">Consultando CEP...</div> : null}
    {cepLookupError ? <div className="ficha-dados-cep-feedback ficha-dados-cep-error">{cepLookupError}</div> : null}
  </div>;
}
