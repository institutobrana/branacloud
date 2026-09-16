import { Checkbox, DatePicker, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { normalizeFichaDateInput } from '../pacientes/components/fichaPessoal/fichaPessoalFieldUtils.js';

const date = (label, value, onChange) => {
  const parsedValue = value ? dayjs(value, ['YYYY-MM-DD', 'DD/MM/YYYY'], true) : null;
  const commit = (event) => {
    const normalized = normalizeFichaDateInput(event.target.value);
    onChange(normalized?.format('YYYY-MM-DD') || '');
  };
  const selectText = (event) => requestAnimationFrame(() => event.target.select());
  return <label className="novo-tratamento-field">{label}<DatePicker value={parsedValue?.isValid() ? parsedValue : null} format="DD/MM/YYYY" onChange={(nextValue) => onChange(nextValue?.isValid() ? nextValue.format('YYYY-MM-DD') : '')} onFocus={selectText} onClick={selectText} onBlur={commit} /></label>;
};
const select = (label, value, options, onChange) => <label className="novo-tratamento-field">{label}<Select value={value || undefined} options={(options || []).map((x) => ({ value: x?.value ?? x?.id, label: x?.label ?? x?.nome ?? x?.descricao ?? x?.value }))} onChange={onChange} /></label>;

export function NovoTratamentoPrincipalTab({ form, setField, data }) {
  return <div className="novo-tratamento-pane">
    <div className="novo-tratamento-grid three">{date('Início', form.data_inicio, (v) => setField('data_inicio', v))}{date('Finalização', form.data_finalizacao, (v) => setField('data_finalizacao', v))}{select('Situação', form.situacao, data.situacoes, (v) => setField('situacao', v))}</div>
    <div className="novo-tratamento-grid three">{select('Tabela principal', form.tabela_codigo, data.tabelas, (v) => setField('tabela_codigo', v))}{select('Índice', form.indice, data.indices, (v) => setField('indice', v))}{select('Cirurgião responsável', form.cirurgiao_responsavel_id, data.cirurgioes, (v) => setField('cirurgiao_responsavel_id', v))}</div>
    <div className="novo-tratamento-grid one">{select('Unidade de atendimento', form.unidade_atendimento, data.unidades, (v) => setField('unidade_atendimento', v))}</div>
    <label className="novo-tratamento-field">Observações<Input.TextArea value={form.observacoes} onChange={(e) => setField('observacoes', e.target.value)} /></label>
    <div className="novo-tratamento-grid two"><label className="novo-tratamento-field">Inclusão<Input className="novo-tratamento-readonly-cyan" value={form.inclusao} readOnly /></label><label className="novo-tratamento-field">Alteração<Input className="novo-tratamento-readonly-cyan" value={form.alteracao} readOnly /></label></div>
    <div className="novo-tratamento-section-title">Novo tratamento</div>
    <div className="novo-tratamento-grid two"><label className="novo-tratamento-field">Idade<Input value={form.idade} readOnly /></label>{select('Arcada predominante', form.arcada_predominante, data.arcadas, (v) => setField('arcada_predominante', v))}</div>
    <Checkbox checked={form.copiar_intervencoes} onChange={(e) => setField('copiar_intervencoes', e.target.checked)}>Copiar intervenções a realizar do tratamento anterior</Checkbox>
  </div>;
}
