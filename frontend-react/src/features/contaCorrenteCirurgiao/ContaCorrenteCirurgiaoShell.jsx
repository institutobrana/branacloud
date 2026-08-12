import { useState } from 'react';
import { Button, Modal } from 'antd';

import { ContaCorrenteCirurgiaoPage } from './ContaCorrenteCirurgiaoPage.jsx';
import { InsereLancamentoModal } from './components/InsereLancamentoModal.jsx';
import { ContaCorrenteCirurgiaoToolbar } from './components/ContaCorrenteCirurgiaoToolbar.jsx';
import { atualizarLancamentoContaCirurgiao, criarLancamentoContaCirurgiao, excluirLancamentoContaCirurgiao } from './contaCorrenteCirurgiaoApi.js';
import { useContaCorrenteCirurgiao } from './hooks/useContaCorrenteCirurgiao.js';

export function ContaCorrenteCirurgiaoShell() {
  const [launchModal, setLaunchModal] = useState({ open: false, type: 'debito', mode: 'create' });
  const [deleting, setDeleting] = useState(false);
  const [deletePromptOpen, setDeletePromptOpen] = useState(false);
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

  const handleDelete = () => {
    if (!selectedRow?.id || deleting) return;
    setDeletePromptOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow?.id || deleting) return;
    setDeleting(true);
    try {
      await excluirLancamentoContaCirurgiao(selectedRow.id);
      setSelectedId(null);
      setDeletePromptOpen(false);
      await reloadLancamentos();
    } finally {
      setDeleting(false);
    }
  };

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
          onDelete={handleDelete}
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
      <Modal
        open={deletePromptOpen}
        title="Excluir lançamento"
        onCancel={() => {
          if (!deleting) setDeletePromptOpen(false);
        }}
        footer={[
          <Button key="cancel" onClick={() => setDeletePromptOpen(false)} disabled={deleting}>
            Cancelar
          </Button>,
          <Button key="ok" danger type="primary" onClick={confirmDelete} loading={deleting} disabled={deleting}>
            Excluir
          </Button>,
        ]}
        centered
        destroyOnClose
        maskClosable={false}
      >
        <p>{selectedRow ? `Confirma a exclusão do lançamento "${selectedRow.historico}"?` : 'Selecione um lançamento.'}</p>
      </Modal>
    </>
  );
}
