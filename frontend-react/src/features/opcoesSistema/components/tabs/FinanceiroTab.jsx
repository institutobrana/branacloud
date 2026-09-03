import { Checkbox, Input, InputNumber, Select } from 'antd';
import { REPORT_INDEX_OPTIONS } from '../../constants/opcoesSistemaConstants.js';

function Field({ label, children, className = '' }) {
  return <label className={`opcoes-sistema-field ${className}`.trim()}><span>{label}</span>{children}</label>;
}

export function FinanceiroTab({ values, options, update }) {
  const indices = (options.indices || []).map((x) => ({ value: x.id, label: `${x.sigla || ''} - ${x.nome || ''}` }));
  const indexOptions = (value) => value != null && !indices.some((x) => x.value === value) ? [{ value, label: `Valor recebido (${value}) — opção não encontrada` }, ...indices] : indices;
  const cobrancas = (options.tipos_cobranca || []).map((x) => ({ value: x.codigo, label: x.descricao }));
  const categorias = (options.categorias_financeiras || []).map((x) => ({ value: x.id, label: x.nome }));
  const set = (patch) => update('financeiro', patch);
  return <div className="opcoes-sistema-pane-content" aria-label="Opções financeiras">
    <h3>Índices financeiros e moedas</h3>
    <div className="opcoes-sistema-grid financeiro">
      <div className="financeiro-periodo"><span>Período padrão para parcelamento</span><span className="financeiro-periodo-guide" aria-hidden="true" /><InputNumber min={1} step={1} value={values.periodo_parcelamento} onChange={(v) => set({ periodo_parcelamento: v })} /></div>
      <Field label="Índice padrão:" className="financeiro-indice"><Select popupClassName="opcoes-sistema-financeiro-select-popup" value={values.indice_padrao_id} options={indexOptions(values.indice_padrao_id)} onChange={(v) => set({ indice_padrao_id: v })} /></Field>
      <Field label="Moeda corrente:" className="financeiro-moeda"><Input value={values.moeda_corrente} onChange={(e) => set({ moeda_corrente: e.target.value })} /></Field>
      <Field label="Sigla:" className="financeiro-sigla"><Input value={values.sigla_moeda} onChange={(e) => set({ sigla_moeda: e.target.value })} /></Field>
      <Field label="Tipo de cobrança padrão:" className="financeiro-cobranca"><Select popupClassName="opcoes-sistema-financeiro-select-popup" value={values.tipo_cobranca_padrao || undefined} options={cobrancas} onChange={(v) => set({ tipo_cobranca_padrao: v || '' })} /></Field>
      <Field label="Categoria financeira para mensalidades de Ortodontia:" className="financeiro-categoria"><Select popupClassName="opcoes-sistema-financeiro-select-popup" value={values.categoria_mensalidade_ortodontia_id ?? undefined} options={categorias} onChange={(v) => set({ categoria_mensalidade_ortodontia_id: v ?? null })} /></Field>
      <Field label="Índice utilizado pelos relatórios:" className="financeiro-relatorios"><Select popupClassName="opcoes-sistema-financeiro-select-popup" value={values.indice_relatorios_id} options={REPORT_INDEX_OPTIONS} onChange={(v) => set({ indice_relatorios_id: v })} /></Field>
    </div>
    <div className="opcoes-sistema-checks">{[['pedir_indices_diariamente', 'Pedir índices financeiros diariamente na abertura do programa'], ['lancar_creditos_baixa_clinica', 'Lançar créditos de baixa na conta da clínica'], ['lancar_debitos_convenio_paciente', 'Lançar automaticamente débitos de convênio na conta corrente do paciente'], ['considerar_creditos_futuros_devedores', 'Considerar créditos futuros na lista de devedores']].map(([key, label]) => <Checkbox key={key} checked={!!values[key]} onChange={(e) => set({ [key]: e.target.checked })}>{label}</Checkbox>)}</div>
  </div>;
}
