import { Checkbox } from 'antd';

import {
  AGENDA_VISUALIZACAO_DEFAULTS,
  AGENDA_VISUALIZACAO_FIELDS,
} from '../../agendaConfiguracaoState.js';

function normalizeVisualizacaoCampos(value) {
  if (!Array.isArray(value)) {
    return [...AGENDA_VISUALIZACAO_DEFAULTS];
  }
  const knownKeys = new Set(AGENDA_VISUALIZACAO_FIELDS.map((field) => field.key));
  const result = [];
  value.forEach((item) => {
    const key = String(item || '').trim();
    if (key && knownKeys.has(key) && !result.includes(key)) {
      result.push(key);
    }
  });
  return result;
}

function isChecked(fields, key) {
  return fields.includes(key);
}

export function AgendaVisualizacaoTab({ draft, updateDraft }) {
  const currentFields = normalizeVisualizacaoCampos(draft?.visualizacaoCampos);

  const handleToggle = (key) => (event) => {
    const checked = event.target.checked;
    const nextFields = checked
      ? [...currentFields, key]
      : currentFields.filter((item) => item !== key);
    updateDraft?.({ visualizacaoCampos: nextFields });
  };

  return (
    <div className="agenda-configuracao-pane agenda-configuracao-pane--visualizacao" aria-label="Aba Visualização">
      <section className="agenda-visualizacao-card">
        <div className="agenda-visualizacao-card-title">Dados a serem visualizados no agendamento</div>
        <div className="agenda-visualizacao-grid" role="group" aria-label="Dados a serem visualizados no agendamento">
          {AGENDA_VISUALIZACAO_FIELDS.map((field) => (
            <Checkbox
              key={field.key}
              checked={isChecked(currentFields, field.key)}
              onChange={handleToggle(field.key)}
              className="agenda-visualizacao-check"
            >
              {field.label}
            </Checkbox>
          ))}
        </div>
      </section>
    </div>
  );
}
