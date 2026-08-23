import { DeleteOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';

import { ContaCorrenteCirurgiaoFilters } from './ContaCorrenteCirurgiaoFilters.jsx';

export function ContaCorrenteCirurgiaoToolbar({
  month,
  year,
  surgeonId,
  viewMode,
  surgeonOptions,
  hasSelection = false,
  onMonthChange,
  onYearChange,
  onSurgeonChange,
  onViewModeChange,
  onNewDebit,
  onNewCredit,
  onEdit,
  onDelete,
  onPrint,
}) {
  return (
    <div className="conta-corrente-cirurgiao-toolbar" role="toolbar" aria-label="Barra operacional da conta corrente do cirurgiao">
      <div className="conta-corrente-cirurgiao-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" onClick={() => onNewDebit?.()}>
          Novo debito
        </button>
        <button type="button" className="auxiliary-shell-button primary" onClick={() => onNewCredit?.()}>
          Novo credito
        </button>
        <button type="button" className="auxiliary-shell-button" disabled={!hasSelection} aria-disabled={!hasSelection} onClick={() => onEdit?.()}>
          <EditOutlined /> Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled={!hasSelection} aria-disabled={!hasSelection} onClick={() => onDelete?.()}>
          <DeleteOutlined /> Elimina
        </button>
        <button type="button" className="auxiliary-shell-button" onClick={() => onPrint?.()}>
          <FileTextOutlined /> Imprime
        </button>
        <span className="conta-corrente-cirurgiao-toolbar-divider" aria-hidden="true" />
      </div>

      <ContaCorrenteCirurgiaoFilters
        month={month}
        year={year}
        surgeonId={surgeonId}
        viewMode={viewMode}
        surgeonOptions={surgeonOptions}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        onSurgeonChange={onSurgeonChange}
        onViewModeChange={onViewModeChange}
      />
    </div>
  );
}
