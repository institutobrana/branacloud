import { Typography } from 'antd';

import { formatMoney } from '../../servicosProtetico/utils/servicosProteticoFormatters.js';

export function ContaCorrenteCirurgiaoTotals({ totalEntrada = 0, totalSaida = 0, saldo = 0 }) {
  const saldoNegativo = Number(saldo || 0) < 0;

  const renderValue = (value, negative = false) => (
    <span className="conta-corrente-cirurgiao-total-value">
      <span className="conta-corrente-cirurgiao-total-currency">R$</span>
      <span className={`conta-corrente-cirurgiao-total-amount${negative ? ' is-negative' : ''}`}>{formatMoney(value)}</span>
    </span>
  );

  return (
    <div className="conta-corrente-cirurgiao-totals" aria-label="Totais da conta corrente do cirurgião">
      <div className="conta-corrente-cirurgiao-total">
        <Typography.Text type="secondary" className="conta-corrente-cirurgiao-total-label">
          Entradas do mês
        </Typography.Text>
        {renderValue(totalEntrada)}
      </div>
      <div className="conta-corrente-cirurgiao-total">
        <Typography.Text type="secondary" className="conta-corrente-cirurgiao-total-label">
          Despesas do mês
        </Typography.Text>
        {renderValue(totalSaida)}
      </div>
      <div className={`conta-corrente-cirurgiao-total conta-corrente-cirurgiao-total-saldo${saldoNegativo ? ' is-negative' : ''}`}>
        <Typography.Text type="secondary" className="conta-corrente-cirurgiao-total-label">
          Saldo do mês
        </Typography.Text>
        {renderValue(saldo, saldoNegativo)}
      </div>
    </div>
  );
}
