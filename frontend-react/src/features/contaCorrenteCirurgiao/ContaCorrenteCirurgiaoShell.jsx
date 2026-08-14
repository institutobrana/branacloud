import { ContaCorrenteCirurgiaoPage } from './ContaCorrenteCirurgiaoPage.jsx';

export function ContaCorrenteCirurgiaoShell({
  items = [],
  totalEntrada = 0,
  totalSaida = 0,
  saldo = 0,
  selectedId = null,
  selectedRow = null,
  error = '',
  month,
  year,
  surgeonId,
  viewMode,
  surgeonOptions = [],
  onMonthChange,
  onYearChange,
  onSurgeonChange,
  onViewModeChange,
  onSelect,
  onDoubleClick,
}) {
  return (
    <ContaCorrenteCirurgiaoPage
      items={items}
      totalEntrada={totalEntrada}
      totalSaida={totalSaida}
      saldo={saldo}
      selectedId={selectedId}
      selectedRow={selectedRow}
      error={error}
      onSelect={onSelect}
      onDoubleClick={onDoubleClick}
    />
  );
}
