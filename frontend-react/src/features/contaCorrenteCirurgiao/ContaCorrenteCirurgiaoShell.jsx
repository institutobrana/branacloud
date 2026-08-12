import { useState } from 'react';

import { ContaCorrenteCirurgiaoPage } from './ContaCorrenteCirurgiaoPage.jsx';
import { InsereLancamentoModal } from './components/InsereLancamentoModal.jsx';
import { ContaCorrenteCirurgiaoToolbar } from './components/ContaCorrenteCirurgiaoToolbar.jsx';
import { atualizarLancamentoContaCirurgiao, criarLancamentoContaCirurgiao } from './contaCorrenteCirurgiaoApi.js';
import { useContaCorrenteCirurgiao } from './hooks/useContaCorrenteCirurgiao.js';

export function ContaCorrenteCirurgiaoShell() {
  const [launchModal, setLaunchModal] = useState({ open: false, type: 'debito', mode: 'create' });
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
    selectedRow,
    error,
    setMonth,
    setYear,
    setSurgeonId,
    setViewMode,
    setSelectedId,
    reloadLancamentos,
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
          hasSelection={selectedId != null}
          onMonthChange={setMonth}
          onYearChange={setYear}
          onSurgeonChange={setSurgeonId}
          onViewModeChange={setViewMode}
          onNewDebit={() => setLaunchModal({ open: true, type: 'debito', mode: 'create' })}
          onNewCredit={() => setLaunchModal({ open: true, type: 'credito', mode: 'create' })}
          onEdit={() => setLaunchModal({ open: true, type: selectedRow?.tipo === 'credito' ? 'credito' : 'debito', mode: 'edit' })}
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
      <InsereLancamentoModal
        open={launchModal.open}
        initialType={launchModal.type}
        prestadorId={surgeonId}
        mode={launchModal.mode || 'create'}
        lancamento={launchModal.mode === 'edit' ? selectedRow : null}
        onClose={() => setLaunchModal({ open: false, type: 'debito', mode: 'create' })}
        onSubmit={async (payload) => {
          if (launchModal.mode === 'edit' && selectedRow?.id != null) {
            await atualizarLancamentoContaCirurgiao(selectedRow.id, payload);
          } else {
            await criarLancamentoContaCirurgiao(payload);
          }
          await reloadLancamentos();
          setLaunchModal({ open: false, type: 'debito', mode: 'create' });
        }}
      />
    </>
  );
}
