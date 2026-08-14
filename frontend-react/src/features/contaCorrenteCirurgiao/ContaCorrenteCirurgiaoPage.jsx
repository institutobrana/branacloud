import './contaCorrenteCirurgiao.css';

import { ContaCorrenteCirurgiaoTable } from './components/ContaCorrenteCirurgiaoTable.jsx';
import { ContaCorrenteCirurgiaoTotals } from './components/ContaCorrenteCirurgiaoTotals.jsx';

export function ContaCorrenteCirurgiaoPage({
  items = [],
  totalEntrada = 0,
  totalSaida = 0,
  saldo = 0,
  selectedId = null,
  error = '',
  onSelect,
  onDoubleClick,
}) {
  return (
    <div className="conta-corrente-cirurgiao-page">
      <div className="conta-corrente-cirurgiao-content">
        {error ? <div className="conta-corrente-cirurgiao-error" role="alert">{error}</div> : null}
        <ContaCorrenteCirurgiaoTable
          items={items}
          selectedId={selectedId}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
        />
        <ContaCorrenteCirurgiaoTotals totalEntrada={totalEntrada} totalSaida={totalSaida} saldo={saldo} />
      </div>
    </div>
  );
}
