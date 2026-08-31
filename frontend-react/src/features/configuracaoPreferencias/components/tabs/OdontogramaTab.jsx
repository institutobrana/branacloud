import { Checkbox, Select } from 'antd';
import { ODONTOGRAM_CHECKBOXES, ODONTOGRAM_FILTERS } from '../../constants/odontogramaConstants.js';
import { OdontogramaColorSelect } from '../odontograma/OdontogramaColorSelect.jsx';

const COLORS = [
  ['cor_anomalia', 'Anomalias'],
  ['cor_condicao_observada', 'Condição observada'],
  ['cor_realizado', 'Já realizado'],
  ['cor_a_realizar', 'A realizar'],
];

export function OdontogramaTab({ values, options, update }) {
  const specialties = (options.especialidades || []).map((item) => ({ value: item.id, label: item.label }));
  const filters = (options.filtros?.length ? options.filtros : ODONTOGRAM_FILTERS).map((item) => ({ value: item.id || item.value, label: item.label }));
  return <div className="config-preferencias-odontograma" aria-label="Preferências do odontograma">
    <div className="config-preferencias-odontograma-column">
      <label className="config-preferencias-field"><span>Especialidade mais utilizada</span><Select value={values.especialidade_mais_utilizada} options={specialties} onChange={(value) => update({ especialidade_mais_utilizada: value })} /></label>
      <fieldset className="config-preferencias-odontograma-box"><legend>Apresentação</legend>
        {ODONTOGRAM_CHECKBOXES.map((item) => <Checkbox key={item.key} checked={values[item.key]} onChange={(event) => update({ [item.key]: event.target.checked })}>{item.label}</Checkbox>)}
      </fieldset>
    </div>
    <div className="config-preferencias-odontograma-column">
      <label className="config-preferencias-field"><span>Filtro mais utilizado</span><Select value={values.filtro_mais_utilizado} options={filters} onChange={(value) => update({ filtro_mais_utilizado: value === 'todos' ? 'todas_tratamento' : value })} /></label>
      <fieldset className="config-preferencias-odontograma-box config-preferencias-odontograma-colors"><legend>Cores para símbolos</legend>
        {COLORS.map(([key, label]) => <div className="config-preferencias-odontograma-color-row" key={key}><span>{label}</span><OdontogramaColorSelect value={values[key]} onChange={(value) => update({ [key]: value })} /></div>)}
      </fieldset>
    </div>
  </div>;
}
