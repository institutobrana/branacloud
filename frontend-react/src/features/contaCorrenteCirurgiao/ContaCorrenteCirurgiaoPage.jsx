import './contaCorrenteCirurgiao.css';
import { useMemo, useState } from 'react';

import { ContaCorrenteCirurgiaoTable } from './components/ContaCorrenteCirurgiaoTable.jsx';
import { ContaCorrenteCirurgiaoTotals } from './components/ContaCorrenteCirurgiaoTotals.jsx';

export function ContaCorrenteCirurgiaoPage() {
  const [selectedId, setSelectedId] = useState(null);
  const items = useMemo(() => [], []);

  return (
    <div className="conta-corrente-cirurgiao-page">
      <ContaCorrenteCirurgiaoTable
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onDoubleClick={() => {}}
      />
      <ContaCorrenteCirurgiaoTotals totalEntrada={0} totalSaida={0} saldo={0} />
    </div>
  );
}
