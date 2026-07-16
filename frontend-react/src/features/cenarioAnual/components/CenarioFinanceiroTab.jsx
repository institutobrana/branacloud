import { Alert, Button, Form, InputNumber, Select } from 'antd';
import { useEffect } from 'react';

import { CenarioFinancialRow } from './CenarioFinancialRow.jsx';
import { CenarioFinancialSection } from './CenarioFinancialSection.jsx';
import { CenarioMetricField } from './CenarioMetricField.jsx';
import { formatBrazilianNumber, parseBrazilianNumber } from '../utils/cenarioAnualNormalizers.js';

const MODE_OPTIONS = [
  { value: 'Perfil Fixo', label: 'Perfil Fixo' },
  { value: 'Perfil Flexível', label: 'Perfil Flexível' },
];

function formatMoney(value) {
  const number = Number(value || 0);
  return `R$ ${number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDecimal2(value) {
  return formatBrazilianNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(value) {
  return formatBrazilianNumber(value);
}

function parseMoney(value) {
  if (value === null || value === undefined || value === '') return '';
  const numericText = String(value).replace(/[^\d,.-]/g, '');
  return parseBrazilianNumber(numericText, 0);
}

function formatYear(value) {
  if (value === null || value === undefined || value === '') return '';
  const number = parseBrazilianNumber(value, NaN);
  if (!Number.isFinite(number)) return '';
  return String(Math.trunc(number));
}

export function CenarioFinanceiroTab({
  initialValues,
  activeHours,
  calcSummary,
  onValuesChange,
  onCalculate,
  calculating = false,
  calcError = '',
  validationErrors = {},
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ano_base: initialValues?.ano_base ?? new Date().getFullYear(),
      gasto_anual_particular: initialValues?.gasto_anual_particular ?? 0,
      gasto_anual_empresa: initialValues?.gasto_anual_empresa ?? 0,
      modo_horas: initialValues?.modo_horas || 'Perfil Fixo',
      horas_ano: activeHours,
      ir: initialValues?.ir ?? 0,
      cd: initialValues?.cd ?? 0,
      cartao: initialValues?.cartao ?? 0,
    });
  }, [activeHours, form, initialValues]);

  const handleValuesChange = (_, allValues) => {
    onValuesChange?.(_, {
      ano_base: allValues.ano_base === '' || allValues.ano_base === null || allValues.ano_base === undefined
        ? ''
        : parseBrazilianNumber(allValues.ano_base, 0),
      gasto_anual_particular: parseMoney(allValues.gasto_anual_particular),
      gasto_anual_empresa: parseMoney(allValues.gasto_anual_empresa),
      modo_horas: String(allValues.modo_horas || 'Perfil Fixo'),
      horas_ano: activeHours,
      ir: parseBrazilianNumber(allValues.ir, 0),
      cd: parseBrazilianNumber(allValues.cd, 0),
      cartao: parseBrazilianNumber(allValues.cartao, 0),
    });
  };

  const custoAnualInformado = calcSummary.custo_ano;
  const custoFixoHora = calcSummary.cfph;
  const custoFixoMinuto = calcSummary.cfpm;

  return (
    <Form form={form} layout="horizontal" className="cenario-tab-form" onValuesChange={handleValuesChange}>
      <div className="cenario-financeiro-tab">
        {calcError ? (
          <Alert type="warning" showIcon message="Atenção" description={calcError} className="cenario-financeiro-alert" />
        ) : null}

        <CenarioFinancialSection
          variant="year"
          helpText="Escolha o ano desejado para base de cálculo de custo fixo anual. Para ter esta opção sincronizada no sistema deve-se alimentar a conta corrente com lançamentos. As categorias que estão dentro dos grupos financeiros Custo fixo do cirurgião e Custo fixo da clínica serão a base de referência."
          className="cenario-financial-section--year-wide"
        >
          <CenarioFinancialRow
            label="Digite o ano-base de cálculo desejado"
            control={(
              <div className="cenario-financeiro-year-group">
                <Form.Item
                  name="ano_base"
                  colon={false}
                  className="cenario-financeiro-control cenario-financeiro-control--year"
                  validateStatus={validationErrors.ano_base ? 'error' : ''}
                  help={validationErrors.ano_base}
                >
                  <InputNumber
                    min={1900}
                    max={3000}
                    step={1}
                    controls
                    className="cenario-input cenario-input--compact"
                    parser={(value) => parseBrazilianNumber(value, value === '' ? '' : 0)}
                    formatter={(value) => formatYear(value)}
                  />
                </Form.Item>
                <div className="cenario-financeiro-year-button-wrap">
                  <Button type="primary" onClick={() => onCalculate?.(form.getFieldValue('ano_base'))} loading={calculating} disabled={calculating}>
                    Calcular
                  </Button>
                </div>
              </div>
            )}
          />
          <CenarioFinancialRow label="Custo Fixo Anual do Cirurgião" control={<CenarioMetricField value={formatMoney(initialValues?.fixo_pessoal)} className="cenario-financeiro-metric" />} />
          <CenarioFinancialRow label="Custo Fixo Anual Profissional" control={<CenarioMetricField value={formatMoney(initialValues?.fixo_empresa)} className="cenario-financeiro-metric" />} />
          <CenarioFinancialRow label="Custo Anual" control={<CenarioMetricField value={formatMoney(initialValues?.custo_anual_backend)} className="cenario-financeiro-metric" />} />
        </CenarioFinancialSection>

        <div className="cenario-financeiro-separator" />

        <CenarioFinancialSection
          helpText="Digite os valores referentes aos custos fixos do cirurgião e da clínica que deseja utilizar como base de cálculo para custo fixo por hora."
        >
          <CenarioFinancialRow
            label="Gasto Anual Particular"
            control={(
              <Form.Item
                name="gasto_anual_particular"
                colon={false}
                className="cenario-financeiro-control"
                validateStatus={validationErrors.gasto_anual_particular ? 'error' : ''}
                help={validationErrors.gasto_anual_particular}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  controls={false}
                  className="cenario-input cenario-input--compact cenario-financeiro-money"
                  formatter={(value) => formatMoney(value)}
                  parser={(value) => parseMoney(value)}
                />
              </Form.Item>
            )}
          />
          <CenarioFinancialRow
            label="Gasto Anual da Clínica"
            control={(
              <Form.Item
                name="gasto_anual_empresa"
                colon={false}
                className="cenario-financeiro-control"
                validateStatus={validationErrors.gasto_anual_empresa ? 'error' : ''}
                help={validationErrors.gasto_anual_empresa}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  controls={false}
                  className="cenario-input cenario-input--compact cenario-financeiro-money"
                  formatter={(value) => formatMoney(value)}
                  parser={(value) => parseMoney(value)}
                />
              </Form.Item>
            )}
          />
        </CenarioFinancialSection>

        <div className="cenario-financeiro-separator" />

        <CenarioFinancialSection
          helpText="Escolha o perfil de horário e use o total correspondente para o cálculo do custo fixo por hora."
        >
          <CenarioFinancialRow
            label="Escolha o perfil de horário"
            control={(
              <Form.Item
                name="modo_horas"
                colon={false}
                className="cenario-financeiro-control"
                validateStatus={validationErrors.modo_horas ? 'error' : ''}
                help={validationErrors.modo_horas}
              >
                <Select options={MODE_OPTIONS} />
              </Form.Item>
            )}
          />
          <CenarioFinancialRow label="Horas por Ano" control={<CenarioMetricField value={formatBrazilianNumber(activeHours)} className="cenario-financeiro-metric" />} />
          <CenarioFinancialRow label="Custo Anual" control={<CenarioMetricField value={formatMoney(custoAnualInformado)} className="cenario-financeiro-metric" />} />
          <CenarioFinancialRow label="Custo Fixo por Hora" control={<CenarioMetricField value={formatDecimal2(custoFixoHora)} className="cenario-financeiro-metric" />} />
          <CenarioFinancialRow label="Custo Fixo por Minuto" control={<CenarioMetricField value={formatDecimal2(custoFixoMinuto)} className="cenario-financeiro-metric" />} />
        </CenarioFinancialSection>

        <div className="cenario-financeiro-separator" />

        <CenarioFinancialSection
          helpText="Defina em percentual (%) qual a sua taxa de imposto de renda, comissão e taxa de operadoras de créditos."
        >
          <CenarioFinancialRow
            label="Imposto de Renda (%)"
            control={(
              <Form.Item
                name="ir"
                colon={false}
                className="cenario-financeiro-control"
                validateStatus={validationErrors.ir ? 'error' : ''}
                help={validationErrors.ir}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  controls={false}
                  className="cenario-input cenario-input--compact cenario-financeiro-percent"
                  formatter={(value) => formatPercent(value)}
                  parser={(value) => parseBrazilianNumber(value, value === '' ? '' : 0)}
                />
              </Form.Item>
            )}
          />
          <CenarioFinancialRow
            label="Comissão Dentista (%)"
            control={(
              <Form.Item
                name="cd"
                colon={false}
                className="cenario-financeiro-control"
                validateStatus={validationErrors.cd ? 'error' : ''}
                help={validationErrors.cd}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  controls={false}
                  className="cenario-input cenario-input--compact cenario-financeiro-percent"
                  formatter={(value) => formatPercent(value)}
                  parser={(value) => parseBrazilianNumber(value, value === '' ? '' : 0)}
                />
              </Form.Item>
            )}
          />
          <CenarioFinancialRow
            label="Taxa Cartão (%)"
            control={(
              <Form.Item
                name="cartao"
                colon={false}
                className="cenario-financeiro-control"
                validateStatus={validationErrors.cartao ? 'error' : ''}
                help={validationErrors.cartao}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  controls={false}
                  className="cenario-input cenario-input--compact cenario-financeiro-percent"
                  formatter={(value) => formatPercent(value)}
                  parser={(value) => parseBrazilianNumber(value, value === '' ? '' : 0)}
                />
              </Form.Item>
            )}
          />
        </CenarioFinancialSection>
      </div>
    </Form>
  );
}
