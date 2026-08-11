import { useMemo, useState } from 'react';

import { ContaCorrenteCirurgiaoToolbar } from './components/ContaCorrenteCirurgiaoToolbar.jsx';
import './contaCorrenteCirurgiao.css';

export function ContaCorrenteCirurgiaoPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [surgeonId, setSurgeonId] = useState(null);
  const [viewMode, setViewMode] = useState('todos');

  const surgeonOptions = useMemo(() => [], []);

  return (
    <div className="conta-corrente-cirurgiao-page">
      <ContaCorrenteCirurgiaoToolbar
        month={month}
        year={year}
        surgeonId={surgeonId}
        viewMode={viewMode}
        surgeonOptions={surgeonOptions}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onSurgeonChange={setSurgeonId}
        onViewModeChange={setViewMode}
      />
      <div className="conta-corrente-cirurgiao-shell" aria-label="Área da conta corrente do cirurgião" />
    </div>
  );
}
