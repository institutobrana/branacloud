import { DeleteOutlined, EditOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';

import { ContaCorrenteCirurgiaoFilters } from './ContaCorrenteCirurgiaoFilters.jsx';

export function ContaCorrenteCirurgiaoToolbar({
  month,
  year,
  surgeonId,
  viewMode,
  surgeonOptions,
  onMonthChange,
  onYearChange,
  onSurgeonChange,
  onViewModeChange,
}) {
  return (
    <div className="conta-corrente-cirurgiao-toolbar" role="toolbar" aria-label="Barra operacional da conta corrente do cirurgião">
      <div className="conta-corrente-cirurgiao-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" disabled>
          <PlusOutlined /> Novo débito
        </button>
        <button type="button" className="auxiliary-shell-button primary" disabled>
          <PlusOutlined /> Novo crédito
        </button>
        <button type="button" className="auxiliary-shell-button" disabled aria-disabled="true">
          <EditOutlined /> Altera
        </button>
        <button type="button" className="auxiliary-shell-button danger" disabled aria-disabled="true">
          <DeleteOutlined /> Elimina
        </button>
        <button type="button" className="auxiliary-shell-button" disabled>
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
