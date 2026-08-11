import './contaCorrenteCirurgiao.css';
import { useState } from 'react';

import { ContaCorrenteCirurgiaoTable } from './components/ContaCorrenteCirurgiaoTable.jsx';
import { ContaCorrenteCirurgiaoTotals } from './components/ContaCorrenteCirurgiaoTotals.jsx';

export function ContaCorrenteCirurgiaoPage() {
  const [selectedId, setSelectedId] = useState(null);
  const items = [];

  return (
    <div className="conta-corrente-cirurgiao-page">
      <div className="conta-corrente-cirurgiao-content">
        <ContaCorrenteCirurgiaoTable
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDoubleClick={() => {}}
        />
        <ContaCorrenteCirurgiaoTotals totalEntrada={0} totalSaida={0} saldo={0} />
      </div>
    </div>
  );
}
