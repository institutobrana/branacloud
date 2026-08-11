import { Typography } from 'antd';

import { formatMoney } from '../../servicosProtetico/utils/servicosProteticoFormatters.js';

export function ContaCorrenteCirurgiaoTotals({ totalEntrada = 0, totalSaida = 0, saldo = 0 }) {
  const saldoNegativo = Number(saldo || 0) < 0;

  return (
    <div className="conta-corrente-cirurgiao-totals" aria-label="Totais da conta corrente do cirurgião">
      <div className="conta-corrente-cirurgiao-total">
        <Typography.Text type="secondary">Entradas do mês</Typography.Text>
        <Typography.Text strong>{formatMoney(totalEntrada)}</Typography.Text>
      </div>
      <div className="conta-corrente-cirurgiao-total">
        <Typography.Text type="secondary">Despesas do mês</Typography.Text>
        <Typography.Text strong>{formatMoney(totalSaida)}</Typography.Text>
      </div>
      <div className={`conta-corrente-cirurgiao-total conta-corrente-cirurgiao-total-saldo${saldoNegativo ? ' is-negative' : ''}`}>
        <Typography.Text type="secondary">Saldo do mês</Typography.Text>
        <Typography.Text strong>{formatMoney(saldo)}</Typography.Text>
      </div>
    </div>
  );
}
