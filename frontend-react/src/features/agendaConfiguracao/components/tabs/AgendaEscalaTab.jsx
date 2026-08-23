import { Input, InputNumber, Typography } from 'antd';

import { AGENDA_ESCALA_DEFAULTS } from '../../agendaConfiguracaoState.js';
import { agendaHoraBlurValue, agendaHoraInputValue, isValidAgendaHoraInput } from '../../utils/agendaHorarioUtils.js';

function TimeField({ label, value, onChange, onCommit, invalid }) {
  return (
    <label className="agenda-configuracao-inline-field agenda-configuracao-inline-field--time">
      <span className="agenda-configuracao-inline-label">{label}</span>
      <Input
        value={value}
        onChange={(event) => onChange(agendaHoraInputValue(event.target.value))}
        onBlur={() => onCommit()}
        onFocus={(event) => event.target.select()}
        placeholder="HH:MM"
        inputMode="numeric"
        status={invalid ? 'error' : ''}
        maxLength={5}
        className="agenda-configuracao-time-input"
      />
    </label>
  );
}

function NumberField({ label, value, min, step, onChange, unit = '', className = '' }) {
  return (
    <label className={`agenda-configuracao-inline-field agenda-configuracao-inline-field--number ${className}`.trim()}>
      <span className="agenda-configuracao-inline-label">{label}</span>
      <span className="agenda-configuracao-inline-control">
        <InputNumber
          value={value}
          min={min}
          step={step}
          controls
          className="agenda-configuracao-number-input"
          onChange={(next) => onChange(Number.isFinite(next) ? next : min)}
        />
        {unit ? <span className="agenda-configuracao-inline-unit">{unit}</span> : null}
      </span>
    </label>
  );
}

function resolveTimeState(value) {
  return agendaHoraBlurValue(value);
}

export function AgendaEscalaTab({ draft = AGENDA_ESCALA_DEFAULTS, updateDraft }) {
  const escala = {
    manhaInicio: String(draft?.manhaInicio ?? AGENDA_ESCALA_DEFAULTS.manhaInicio),
    manhaFim: String(draft?.manhaFim ?? AGENDA_ESCALA_DEFAULTS.manhaFim),
    tardeInicio: String(draft?.tardeInicio ?? AGENDA_ESCALA_DEFAULTS.tardeInicio),
    tardeFim: String(draft?.tardeFim ?? AGENDA_ESCALA_DEFAULTS.tardeFim),
    duracao: Number.isFinite(Number(draft?.duracao)) ? Number(draft.duracao) : AGENDA_ESCALA_DEFAULTS.duracao,
    semanaHorarios: Number.isFinite(Number(draft?.semanaHorarios)) ? draft.semanaHorarios : AGENDA_ESCALA_DEFAULTS.semanaHorarios,
    diaHorarios: Number.isFinite(Number(draft?.diaHorarios)) ? draft.diaHorarios : AGENDA_ESCALA_DEFAULTS.diaHorarios,
  };

  const updateTime = (field, nextValue) => {
    updateDraft?.({ [field]: nextValue });
  };

  const commitTime = (field, currentValue) => {
    const normalized = resolveTimeState(currentValue);
    updateDraft?.({ [field]: normalized === '' ? '' : normalized });
  };

  const setNumber = (field, value, min) => {
    const next = Number.isFinite(value) ? Math.max(min, Math.trunc(value)) : min;
    updateDraft?.({ [field]: next });
  };

  const timeInvalid = (value) => value !== '' && !isValidAgendaHoraInput(value);

  return (
    <div className="agenda-configuracao-pane" aria-label="Aba Escala">
      <div className="agenda-configuracao-escala-grid">
        <section className="agenda-configuracao-card agenda-configuracao-card--morning" aria-label="Quadro Manhã">
          <Typography.Text className="agenda-configuracao-card-title">Manhã</Typography.Text>
          <div className="agenda-configuracao-card-fields agenda-configuracao-card-fields--stacked">
            <TimeField
              label="Horário inicial"
              value={escala.manhaInicio}
              invalid={timeInvalid(escala.manhaInicio)}
              onChange={(value) => updateTime('manhaInicio', value)}
              onCommit={() => commitTime('manhaInicio', escala.manhaInicio)}
            />
            <TimeField
              label="Horário final"
              value={escala.manhaFim}
              invalid={timeInvalid(escala.manhaFim)}
              onChange={(value) => updateTime('manhaFim', value)}
              onCommit={() => commitTime('manhaFim', escala.manhaFim)}
            />
          </div>
        </section>

        <section className="agenda-configuracao-card agenda-configuracao-card--duration" aria-label="Quadro Duração do horário">
          <Typography.Text className="agenda-configuracao-card-title">Duração do horário</Typography.Text>
          <div className="agenda-configuracao-card-fields">
            <NumberField
              label=" "
              value={escala.duracao}
              min={5}
              step={5}
              onChange={(value) => setNumber('duracao', value, 5)}
              unit="minutos"
              className="agenda-configuracao-number-field--compact"
            />
          </div>
        </section>

        <section className="agenda-configuracao-card agenda-configuracao-card--afternoon" aria-label="Quadro Tarde">
          <Typography.Text className="agenda-configuracao-card-title">Tarde</Typography.Text>
          <div className="agenda-configuracao-card-fields agenda-configuracao-card-fields--stacked">
            <TimeField
              label="Horário inicial"
              value={escala.tardeInicio}
              invalid={timeInvalid(escala.tardeInicio)}
              onChange={(value) => updateTime('tardeInicio', value)}
              onCommit={() => commitTime('tardeInicio', escala.tardeInicio)}
            />
            <TimeField
              label="Horário final"
              value={escala.tardeFim}
              invalid={timeInvalid(escala.tardeFim)}
              onChange={(value) => updateTime('tardeFim', value)}
              onCommit={() => commitTime('tardeFim', escala.tardeFim)}
            />
          </div>
        </section>

        <section className="agenda-configuracao-card agenda-configuracao-card--view" aria-label="Quadro Visualizar horários">
          <Typography.Text className="agenda-configuracao-card-title">Visualizar horários</Typography.Text>
          <div className="agenda-configuracao-card-fields agenda-configuracao-card-fields--stacked">
            <NumberField
              label="Agenda da semana"
              value={escala.semanaHorarios}
              min={1}
              step={1}
              onChange={(value) => setNumber('semanaHorarios', value, 1)}
              unit="horários"
            />
            <NumberField
              label="Agenda do dia"
              value={escala.diaHorarios}
              min={1}
              step={1}
              onChange={(value) => setNumber('diaHorarios', value, 1)}
              unit="horários"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
