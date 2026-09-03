import { Input, InputNumber, Select } from 'antd';

function Field({ label, children, className = '' }) {
  return <label className={`opcoes-sistema-field ${className}`.trim()}><span>{label}</span>{children}</label>;
}

function splitTime(value) {
  const [hours = '', minutes = ''] = String(value || '').split(':');
  return { hours: hours ? hours.padStart(2, '0') : '', minutes: minutes ? minutes.padStart(2, '0') : '' };
}

export function DataTab({ values, update }) {
  const time = splitTime(values.hora_atual);
  return <div className="opcoes-sistema-grid data" aria-label="Opções de data">
    <Field label="Formato de data:" className="data-formato"><Select value={values.formato_data} options={[{ value: 'DD/MM/AA', label: 'DD/MM/AA' }, { value: 'DD/MM/AAAA', label: 'DD/MM/AAAA' }]} onChange={(v) => update({ formato_data: v })} /></Field>
    <Field label="Data atual:" className="data-atual"><Input value={values.data_atual} readOnly /></Field>
    <div className="opcoes-sistema-field data-hora" aria-label="Hora atual"><span>Hora atual:</span><div className="data-hora-fields"><Input value={time.hours} readOnly aria-label="Hora" /><span aria-hidden="true">:</span><Input value={time.minutes} readOnly aria-label="Minutos" /></div></div>
    <div className="data-line data-ano"><span>Considerar ano 2000 para anos menores que</span><span className="data-line-guide" aria-hidden="true" /><InputNumber min={0} max={99} value={values.considerar_ano_2000_menor_que} onChange={(v) => update({ considerar_ano_2000_menor_que: v })} aria-label="Considerar ano 2000 para anos menores que" /></div>
    <div className="data-line data-semanas"><span>Número de semanas pesquisadas na busca de horários livres</span><span className="data-line-guide" aria-hidden="true" /><InputNumber min={1} value={values.semanas_horarios_livres} onChange={(v) => update({ semanas_horarios_livres: v })} aria-label="Número de semanas pesquisadas na busca de horários livres" /></div>
  </div>;
}
