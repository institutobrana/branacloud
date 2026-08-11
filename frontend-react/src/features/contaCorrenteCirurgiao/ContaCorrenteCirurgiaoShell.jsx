import { ContaCorrenteCirurgiaoPage } from './ContaCorrenteCirurgiaoPage.jsx';
import { ContaCorrenteCirurgiaoToolbar } from './components/ContaCorrenteCirurgiaoToolbar.jsx';
import { useContaCorrenteCirurgiao } from './hooks/useContaCorrenteCirurgiao.js';

export function ContaCorrenteCirurgiaoShell() {
  const {
    month,
    year,
    surgeonId,
    viewMode,
    surgeonOptions,
    items,
    totalEntrada,
    totalSaida,
    saldo,
    selectedId,
    error,
    setMonth,
    setYear,
    setSurgeonId,
    setViewMode,
    setSelectedId,
  } = useContaCorrenteCirurgiao();

  return (
    <>
      <div className="brana-shell-band auxiliary-shell-band" aria-label="Barra operacional da conta corrente do cirurgião">
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
      </div>
      <ContaCorrenteCirurgiaoPage
        items={items}
        totalEntrada={totalEntrada}
        totalSaida={totalSaida}
        saldo={saldo}
        selectedId={selectedId}
        error={error}
        onSelect={setSelectedId}
      />
    </>
  );
}
