import { Checkbox, Input, InputNumber, Select } from 'antd';
import { GENERAL_SEARCH_OPTIONS } from '../../constants/configuracaoPreferenciasConstants.js';

function Field({ label, children, className = '' }) {
  return <label className={`config-preferencias-field ${className}`.trim()}><span>{label}</span>{children}</label>;
}

export function GeralTab({ values, options, update }) {
  const tabelas = (options.tabelas_intervencoes || []).map((item) => ({ value: item.id, label: item.nome }));
  const convenios = (options.convenios || []).map((item) => ({ value: item.id, label: item.nome }));
  return <div className="config-preferencias-geral" aria-label="Preferências gerais">
    <div className="config-preferencias-general-grid">
      <Field label="Pesquisa padrão no odontograma:"><Select value={values.pesquisa_padrao_odontograma} options={GENERAL_SEARCH_OPTIONS} onChange={(value) => update({ pesquisa_padrao_odontograma: value })} /></Field>
      <Field label="Tabela de intervenções padrão para novos cadastros:"><Select allowClear value={values.tabela_padrao_id ?? undefined} options={tabelas} onChange={(value) => update({ tabela_padrao_id: value ?? null })} /></Field>
      <Field label="Convênio padrão para novos cadastros:"><Select value={values.convenio_padrao_id} options={convenios} onChange={(value) => update({ convenio_padrao_id: value ?? 0 })} /></Field>
    </div>
    <Field label="Mensagem padrão para orçamentos:"><Input value={values.mensagem_padrao_orcamentos} onChange={(event) => update({ mensagem_padrao_orcamentos: event.target.value })} /></Field>
    <Field label="Histórico padrão para conta corrente:"><Input value={values.historico_padrao_conta_corrente} onChange={(event) => update({ historico_padrao_conta_corrente: event.target.value })} /></Field>
    <div className="config-preferencias-divider" />
    <div className="config-preferencias-checks">
      <Checkbox checked={values.exibir_quadro_avisos} onChange={(event) => update({ exibir_quadro_avisos: event.target.checked })}>Exibir quadro de avisos na abertura</Checkbox>
      <Checkbox checked={values.busca_automatica_pacientes_agendados} onChange={(event) => update({ busca_automatica_pacientes_agendados: event.target.checked })}>Busca automática de pacientes agendados</Checkbox>
      <label className="config-preferencias-alarm"><Checkbox checked={values.alarme_habilitado} onChange={(event) => update({ alarme_habilitado: event.target.checked })} /><span>Alarme com</span><InputNumber min={1} max={120} value={values.alarme_minutos_antecedencia} onChange={(value) => update({ alarme_minutos_antecedencia: value || 1 })} disabled={!values.alarme_habilitado} /><span>min de antecedência</span></label>
    </div>
  </div>;
}
