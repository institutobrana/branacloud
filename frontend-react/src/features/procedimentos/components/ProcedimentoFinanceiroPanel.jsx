import { Alert, Skeleton } from 'antd';

import {
  formatFinanceiroMoney,
  formatFinanceiroPercent,
  formatFinanceiroTempo,
} from '../procedimentosFinanceiroMappers.js';

const FINANCEIRO_LABELS = {
  custo_fph: 'CFPH',
  custo_material: 'Mat. Consumo',
  custo_proc: 'Custo R$',
  ir: 'Imposto',
  cd: 'Comissão CD',
  cartao: 'Taxa Cartão',
  valor_minimo: 'Valor Mínimo',
  lucro_bruto: 'Lucro Bruto',
  lucro_liquido: 'Lucro Líquido',
  rendimento: 'Rendimento %',
  rendimento_3040: 'Bom 30 a 40%',
  rendimento_1020: 'Bom 10 a 20%',
  lucro_hora: 'Lucro por hora',
};

const FINANCEIRO_ORDER = [
  'custo_fph',
  'custo_material',
  'custo_proc',
  'ir',
  'cd',
  'cartao',
  'valor_minimo',
  'lucro_bruto',
  'lucro_liquido',
  'rendimento',
  'rendimento_3040',
  'rendimento_1020',
  'lucro_hora',
];

function resolveFinanceiroDisplayValue(key, item) {
  if (key === 'rendimento') {
    return item?.rendimento_proc;
  }

  return item?.[key];
}

function formatFinanceiroValue(key, value) {
  if (value == null || value === '') return '—';
  if (key === 'rendimento' || key === 'rendimento_3040' || key === 'rendimento_1020') {
    return formatFinanceiroPercent(value);
  }
  if (key === 'tempo' || key === 'tempo_grafico') {
    return formatFinanceiroTempo(value);
  }
  return formatFinanceiroMoney(value);
}

function FinanceiroItem({ label, value, tone = 'neutral' }) {
  return (
    <div className={`procedimento-financeiro-item tone-${tone}`}>
      <div className="procedimento-financeiro-label">{label}</div>
      <div className="procedimento-financeiro-value">{value}</div>
    </div>
  );
}

export function ProcedimentoFinanceiroPanel({ loading = false, error = '', item = null, empty = false }) {
  const hasData = !!item && !empty;

  return (
    <section className="procedimento-editor-panel procedimento-editor-panel-financeiro">
      <div className="procedimento-editor-panel-title">Painel Financeiro</div>

      {loading ? (
        <div className="procedimento-financeiro-loading" aria-label="Carregando painel financeiro">
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        </div>
      ) : error ? (
        <Alert type="error" showIcon message="Nao foi possivel carregar o painel financeiro." description={error} />
      ) : hasData ? (
        <div className="procedimento-financeiro-grid procedimento-financeiro-grid-compact" aria-label="Painel financeiro do procedimento">
          {FINANCEIRO_ORDER.map((fieldKey) => (
            <FinanceiroItem
              key={fieldKey}
              label={FINANCEIRO_LABELS[fieldKey] || fieldKey}
              value={formatFinanceiroValue(fieldKey, resolveFinanceiroDisplayValue(fieldKey, item))}
              tone={
                fieldKey === 'rendimento_3040' || fieldKey === 'rendimento_1020'
                  ? 'positive'
                  : fieldKey === 'lucro_liquido' && Number(item?.[fieldKey] || 0) < 0
                    ? 'negative'
                    : 'neutral'
              }
            />
          ))}
        </div>
      ) : (
        <div className="procedimento-financeiro-grid procedimento-financeiro-grid-compact procedimento-financeiro-empty" aria-label="Painel financeiro vazio">
          {FINANCEIRO_ORDER.map((fieldKey) => (
            <FinanceiroItem
              key={fieldKey}
              label={FINANCEIRO_LABELS[fieldKey] || fieldKey}
              value="—"
              tone={fieldKey === 'rendimento_3040' || fieldKey === 'rendimento_1020' ? 'positive' : 'neutral'}
            />
          ))}
        </div>
      )}
    </section>
  );
}
