import { Form, InputNumber } from 'antd';
import { useEffect } from 'react';
import { CenarioHelpBox } from './CenarioHelpBox.jsx';
import { CenarioFixedRow } from './CenarioFixedRow.jsx';
import { CenarioMetricField } from './CenarioMetricField.jsx';
import { formatBrazilianNumber, parseBrazilianNumber } from '../utils/cenarioAnualNormalizers.js';

export function PerfilHorarioFixoTab({ initialValues, summary, onValuesChange, validationErrors = {} }) {
  const [form] = Form.useForm();

  const parseValue = (value) => parseBrazilianNumber(value, value === '' ? '' : 0);

  useEffect(() => {
    form.setFieldsValue(initialValues || {});
  }, [form, initialValues]);

  return (
    <Form form={form} layout="horizontal" className="cenario-tab-form" onValuesChange={onValuesChange}>
      <div className="cenario-fixed-column">
        <CenarioHelpBox className="cenario-help-box--compact">
          Defina quantidade de horas de trabalho no ano. Neste caso o perfil é definido como fixo por ter o mesmo número de horas todos os dias.
        </CenarioHelpBox>

        <div className="cenario-fixed-grid">
          <CenarioFixedRow
            label="Meses de trabalho no Ano"
            control={(
              <Form.Item
                name="meses_trabalhados"
                colon={false}
                validateStatus={validationErrors.meses_trabalhados ? 'error' : ''}
                help={validationErrors.meses_trabalhados}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  className="cenario-input cenario-input--compact"
                  controls={false}
                  decimalSeparator=","
                  formatter={(value) => formatBrazilianNumber(value)}
                  parser={parseValue}
                />
              </Form.Item>
            )}
          />

          <CenarioFixedRow
            label="Dias úteis / Mês"
            control={(
              <Form.Item
                name="dias_uteis_mes"
                colon={false}
                validateStatus={validationErrors.dias_uteis_mes ? 'error' : ''}
                help={validationErrors.dias_uteis_mes}
              >
                <InputNumber
                  min={0}
                  step={1}
                  className="cenario-input cenario-input--compact"
                  controls
                  formatter={(value) => formatBrazilianNumber(value)}
                  parser={parseValue}
                />
              </Form.Item>
            )}
          />

          <CenarioFixedRow
            label="Dias úteis / Ano"
            control={<CenarioMetricField value={formatBrazilianNumber(summary.dias_uteis_ano)} />}
          />

          <CenarioFixedRow
            label="Horas por dia"
            control={(
              <Form.Item
                name="horas_atendimento_dia"
                colon={false}
                validateStatus={validationErrors.horas_atendimento_dia ? 'error' : ''}
                help={validationErrors.horas_atendimento_dia}
              >
                <InputNumber
                  min={0}
                  step={0.25}
                  className="cenario-input cenario-input--compact"
                  controls={false}
                  decimalSeparator=","
                  formatter={(value) => formatBrazilianNumber(value)}
                  parser={parseValue}
                />
              </Form.Item>
            )}
          />

          <CenarioFixedRow isSeparator />

          <CenarioFixedRow
            label="Nº de Consultórios"
            control={(
              <Form.Item
                name="num_consultorios"
                colon={false}
                validateStatus={validationErrors.num_consultorios ? 'error' : ''}
                help={validationErrors.num_consultorios}
              >
                <InputNumber
                  min={0}
                  step={1}
                  className="cenario-input cenario-input--compact"
                  controls
                  formatter={(value) => formatBrazilianNumber(value)}
                  parser={parseValue}
                />
              </Form.Item>
            )}
          />

          <CenarioFixedRow
            label="Horas por ano"
            control={<CenarioMetricField value={formatBrazilianNumber(summary.total_horas_fixo)} />}
          />

          <CenarioFixedRow
            label="Minutos por ano"
            control={<CenarioMetricField value={formatBrazilianNumber(summary.total_minutos_fixo)} />}
          />

          <CenarioFixedRow
            label="Turnos por ano"
            control={<CenarioMetricField value={formatBrazilianNumber(summary.total_turnos_fixo)} />}
          />
        </div>
      </div>
    </Form>
  );
}
