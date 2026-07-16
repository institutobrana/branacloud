import { Form, InputNumber } from 'antd';
import { useEffect, useMemo } from 'react';

import { CenarioHelpBox } from './CenarioHelpBox.jsx';
import { CenarioMetricField } from './CenarioMetricField.jsx';
import { formatBrazilianNumber, parseBrazilianNumber } from '../utils/cenarioAnualNormalizers.js';
import { calculateFlexibleDayTotals } from '../utils/cenarioAnualFlexCalculations.js';
import { CENARIO_ANUAL_DAY_INDEXES } from '../constants/cenarioAnualDefaults.js';

const DAY_COLUMNS = [
  { key: '1', label: 'Segunda' },
  { key: '2', label: 'Terça' },
  { key: '3', label: 'Quarta' },
  { key: '4', label: 'Quinta' },
  { key: '5', label: 'Sexta' },
  { key: '6', label: 'Sábado' },
];

const ROWS = [
  { key: 'manha', label: 'Horas da Manhã', editable: true, step: 0.25 },
  { key: 'tarde', label: 'Horas da Tarde', editable: true, step: 0.25 },
  { key: 'noite', label: 'Horas da Noite', editable: true, step: 0.25 },
  { key: 'total_dia', label: 'Total Horas/Dia', editable: false },
  { key: 'dias', label: 'Dias no ano', editable: true, step: 1 },
  { key: 'horas_ano_dia', label: 'Horas por ano', editable: false },
];

function buildInitialRows(turnosFlex) {
  const rows = {};
  for (const index of CENARIO_ANUAL_DAY_INDEXES) {
    const key = String(index);
    rows[key] = turnosFlex?.[key] || { manha: 0, tarde: 0, noite: 0, dias: 0 };
  }
  return rows;
}

export function PerfilHorarioFlexivelTab({ initialValues, summary, onValuesChange }) {
  const [form] = Form.useForm();
  const turnosFlex = initialValues?.turnos_flex || {};
  const rowState = useMemo(() => buildInitialRows(turnosFlex), [turnosFlex]);

  useEffect(() => {
    const nextValues = {};
    for (const day of DAY_COLUMNS) {
      const row = rowState[day.key] || {};
      nextValues[`manha_${day.key}`] = row.manha ?? 0;
      nextValues[`tarde_${day.key}`] = row.tarde ?? 0;
      nextValues[`noite_${day.key}`] = row.noite ?? 0;
      nextValues[`dias_${day.key}`] = row.dias ?? 0;
    }
    nextValues.num_consultorios_flex = initialValues?.num_consultorios_flex ?? 1;
    form.setFieldsValue(nextValues);
  }, [form, initialValues, rowState]);

  const handleValuesChange = (_, allValues) => {
    const patch = { ...allValues };
    const nextTurnos = { ...(initialValues?.turnos_flex || {}) };

    for (const day of DAY_COLUMNS) {
      nextTurnos[day.key] = {
        manha: parseBrazilianNumber(allValues[`manha_${day.key}`], 0),
        tarde: parseBrazilianNumber(allValues[`tarde_${day.key}`], 0),
        noite: parseBrazilianNumber(allValues[`noite_${day.key}`], 0),
        dias: parseBrazilianNumber(allValues[`dias_${day.key}`], 0),
      };
    }

    patch.turnos_flex = nextTurnos;
    patch.num_consultorios_flex = allValues.num_consultorios_flex === '' || allValues.num_consultorios_flex === null || allValues.num_consultorios_flex === undefined
      ? 0
      : parseBrazilianNumber(allValues.num_consultorios_flex, 0);

    onValuesChange?.(_, patch);
  };

  return (
    <Form form={form} layout="horizontal" className="cenario-tab-form" onValuesChange={handleValuesChange}>
      <div className="cenario-flex-tab">
        <CenarioHelpBox className="cenario-help-box--compact cenario-help-box--flex">
          Defina quantidade de horas de trabalho no ano. Neste caso o perfil é definido como flexível por ter carga horária diária flexível com oportunidade de escolher o número de horas trabalhadas por dia.
        </CenarioHelpBox>

        <div className="cenario-flex-grid">
          <div className="cenario-flex-header cenario-flex-header--label" />
          {DAY_COLUMNS.map((day) => (
            <div key={day.key} className="cenario-flex-header">
              {day.label}
            </div>
          ))}

          {ROWS.map((row) => (
            <div key={row.key} className="cenario-flex-row">
              <div className="cenario-flex-row-label">{row.label}</div>
              {DAY_COLUMNS.map((day) => {
                const totals = calculateFlexibleDayTotals(rowState, day.key);

                if (row.key === 'total_dia') {
                  return (
                    <div key={day.key} className="cenario-flex-cell">
                      <CenarioMetricField value={formatBrazilianNumber(totals.total_dia)} />
                    </div>
                  );
                }

                if (row.key === 'horas_ano_dia') {
                  return (
                    <div key={day.key} className="cenario-flex-cell">
                      <CenarioMetricField value={formatBrazilianNumber(totals.horas_ano_dia)} />
                    </div>
                  );
                }

                return (
                    <div key={day.key} className="cenario-flex-cell">
                    <Form.Item name={`${row.key}_${day.key}`} colon={false}>
                      <InputNumber
                        min={0}
                        step={row.step}
                        className="cenario-input cenario-input--compact cenario-flex-number-input"
                        controls={false}
                        decimalSeparator=","
                        formatter={(value) => formatBrazilianNumber(value)}
                        parser={(value) => parseBrazilianNumber(value, value === '' ? '' : 0)}
                      />
                    </Form.Item>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="cenario-flex-bottom">
          <div className="cenario-flex-bottom-row">
            <div className="cenario-lbl cenario-flex-bottom-label">Nº de Consultórios</div>
            <Form.Item name="num_consultorios_flex" colon={false} className="cenario-flex-bottom-control">
              <InputNumber
                min={0}
                step={1}
                className="cenario-input cenario-input--compact cenario-flex-number-input"
                controls
                formatter={(value) => formatBrazilianNumber(value)}
                parser={(value) => parseBrazilianNumber(value, value === '' ? '' : 0)}
              />
            </Form.Item>
          </div>

          <div className="cenario-flex-bottom-grid">
            <div className="cenario-lbl">Horas por ano</div>
            <CenarioMetricField value={formatBrazilianNumber(summary.total_horas_flex)} />
            <div className="cenario-lbl">Minutos por ano</div>
            <CenarioMetricField value={formatBrazilianNumber(summary.total_minutos_flex)} />
            <div className="cenario-lbl">Turnos por ano</div>
            <CenarioMetricField value={formatBrazilianNumber(summary.total_turnos_flex)} />
          </div>
        </div>
      </div>
    </Form>
  );
}
