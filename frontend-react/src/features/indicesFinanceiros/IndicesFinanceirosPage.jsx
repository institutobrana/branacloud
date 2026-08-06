import { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';

import { IndiceFinanceiroFormDialog } from './components/IndiceFinanceiroFormDialog.jsx';
import { IndiceFinanceiroDeleteDialog } from './components/IndiceFinanceiroDeleteDialog.jsx';
import { IndiceFinanceiroMigrationDialog } from './components/IndiceFinanceiroMigrationDialog.jsx';
import { IndiceFinanceiroQuotationFormDialog } from './components/IndiceFinanceiroQuotationFormDialog.jsx';
import { IndiceFinanceiroQuotationDeleteDialog } from './components/IndiceFinanceiroQuotationDeleteDialog.jsx';
import { IndicesFinanceirosTable } from './components/IndicesFinanceirosTable.jsx';
import { IndicesCotacoesTable } from './components/IndicesCotacoesTable.jsx';
import { checkIndiceFinanceiroEmUso, createIndiceFinanceiroCotacao, criarIndiceFinanceiro, deleteIndiceFinanceiro, deleteIndiceFinanceiroCotacao, migrateAndDeleteIndiceFinanceiro, updateIndiceFinanceiro, updateIndiceFinanceiroCotacao } from './indicesFinanceirosApi.js';
import { parseIndiceFinanceiroQuotationValue } from './indicesFinanceirosQuotationValidators.js';
import {
  canCreateQuotationIndiceFinanceiro,
  canDeleteIndiceFinanceiro,
  canEditIndiceFinanceiro,
  canMigrateAndDeleteIndiceFinanceiro,
  isIndiceFinanceiroReservado,
} from './indicesFinanceirosReserved.js';
import { useIndicesCotacoes } from './hooks/useIndicesCotacoes.js';
import { useIndicesFinanceiros } from './hooks/useIndicesFinanceiros.js';

const EMPTY_MODAL = {
  open: false,
  mode: 'create',
  initialValues: { nome: '', sigla: '' },
  numero: null,
};

export function IndicesFinanceirosPage() {
  const [modalState, setModalState] = useState(EMPTY_MODAL);
  const [submitError, setSubmitError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [saving, setSaving] = useState(false);
  const [checkingUsage, setCheckingUsage] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(false);
  const [migratingIndex, setMigratingIndex] = useState(false);
  const [quotingIndex, setQuotingIndex] = useState(false);
  const [migrationError, setMigrationError] = useState('');
  const [quotationError, setQuotationError] = useState('');
  const [migrationDialogState, setMigrationDialogState] = useState({
    open: false,
    target: null,
    numeroDestino: null,
  });
  const [quotationDialogState, setQuotationDialogState] = useState({
    open: false,
    mode: 'create',
    target: null,
    cotacaoId: null,
    initialValues: { data: '', valor: '' },
  });
  const [quotationDeleteDialogState, setQuotationDeleteDialogState] = useState({
    open: false,
    target: null,
  });
  const [deleteDialogState, setDeleteDialogState] = useState({
    open: false,
    target: null,
  });
  const selectedIndiceRef = useRef(null);
  const { rows, loading, error, selectedNumero, selectedRow, selectRow, reload } = useIndicesFinanceiros();
  const {
    rows: cotacoesRows,
    loading: cotacoesLoading,
    error: cotacoesError,
    selectedKey: selectedCotacaoKey,
    selectedRow: selectedCotacaoRow,
    selectRow: selectCotacaoRow,
    reload: reloadCotacoes,
    clearState: clearCotacoesState,
    hasSelectedIndex,
  } = useIndicesCotacoes(selectedNumero);

  const selectedIndice = useMemo(
    () => rows.find((row) => Number(row.numero) === Number(selectedNumero)) || null,
    [rows, selectedNumero],
  );

  useEffect(() => {
    selectedIndiceRef.current = selectedIndice;
  }, [selectedIndice]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('brana-indices-financeiros-toolbar-state', {
        detail: {
          selectedNumero: selectedIndice?.numero ?? null,
          selectedIsReserved: Boolean(selectedIndice && isIndiceFinanceiroReservado(selectedIndice)),
          loading: Boolean(loading || saving || checkingUsage || deletingIndex || migratingIndex || quotingIndex),
          canDeleteIndex: Boolean(canDeleteIndiceFinanceiro(selectedIndice) && !loading && !saving && !checkingUsage && !deletingIndex && !migratingIndex && !quotingIndex),
          canCreateQuotation: Boolean(canCreateQuotationIndiceFinanceiro(selectedIndice) && !loading && !saving && !checkingUsage && !deletingIndex && !migratingIndex && !quotingIndex),
          canEditQuotation: Boolean(selectedCotacaoRow && canCreateQuotationIndiceFinanceiro(selectedIndice) && !loading && !saving && !checkingUsage && !deletingIndex && !migratingIndex && !quotingIndex),
          canDeleteQuotation: Boolean(selectedCotacaoRow && canCreateQuotationIndiceFinanceiro(selectedIndice) && !loading && !saving && !checkingUsage && !deletingIndex && !migratingIndex && !quotingIndex),
          checkingUsage: Boolean(checkingUsage),
          deletingIndex: Boolean(deletingIndex),
          migratingIndex: Boolean(migratingIndex),
          quotingIndex: Boolean(quotingIndex),
        },
      }),
    );
  }, [checkingUsage, deletingIndex, loading, migratingIndex, quotingIndex, saving, selectedCotacaoRow, selectedIndice]);

  useEffect(() => {
    const onToolbarAction = (event) => {
      const action = event?.detail?.action;
      const currentSelectedIndice = selectedIndiceRef.current;

      if (action === 'novo' || action === 'new-index') {
        setSubmitError('');
        setModalState({
          open: true,
          mode: 'create',
          initialValues: { nome: '', sigla: '' },
          numero: null,
        });
        return;
      }

      if (action === 'alterar' || action === 'edit-index') {
        if (!canEditIndiceFinanceiro(currentSelectedIndice) || loading || saving) {
          return;
        }

        setSubmitError('');
        setModalState({
          open: true,
          mode: 'edit',
          numero: Number(currentSelectedIndice.numero),
          initialValues: {
            nome: currentSelectedIndice.nome,
            sigla: currentSelectedIndice.sigla,
          },
        });
      }

      if (action === 'eliminar' || action === 'delete-index') {
        if (!canDeleteIndiceFinanceiro(currentSelectedIndice) || loading || saving || checkingUsage || deletingIndex || migratingIndex || quotingIndex) {
          return;
        }

        setDeleteError('');
        setMigrationError('');
        void (async () => {
          setCheckingUsage(true);
          try {
            const usage = await checkIndiceFinanceiroEmUso(currentSelectedIndice.numero);
            const emUso = Boolean(usage?.emUso ?? usage?.em_uso);
            if (emUso) {
              setDeleteDialogState({ open: false, target: null });
              setMigrationDialogState({
                open: true,
                target: currentSelectedIndice,
                numeroDestino: null,
              });
              return;
            }
            setMigrationDialogState({ open: false, target: null, numeroDestino: null });
            setDeleteDialogState({ open: true, target: currentSelectedIndice });
          } catch (err) {
            setDeleteError(err?.message || 'Falha ao verificar uso do índice financeiro.');
          } finally {
            setCheckingUsage(false);
          }
        })();
        return;
      }

      if (action === 'novo-valor' || action === 'new-quotation') {
        if (!canCreateQuotationIndiceFinanceiro(currentSelectedIndice) || loading || saving || checkingUsage || deletingIndex || migratingIndex || quotingIndex) {
          return;
        }

        setQuotationError('');
        setQuotationDialogState({
          open: true,
          mode: 'create',
          target: currentSelectedIndice,
          cotacaoId: null,
          initialValues: { data: '', valor: '' },
        });
        return;
      }

      if (action === 'edit-quotation') {
        if (!currentSelectedIndice || !selectedCotacaoRow || loading || saving || checkingUsage || deletingIndex || migratingIndex || quotingIndex) {
          return;
        }

        setQuotationError('');
        setQuotationDialogState({
          open: true,
          mode: 'edit',
          target: currentSelectedIndice,
          cotacaoId: selectedCotacaoRow.cotacaoId ?? selectedCotacaoRow.id ?? null,
          initialValues: {
            data: selectedCotacaoRow.data ?? '',
            valor: selectedCotacaoRow.valor ?? '',
          },
        });
        return;
      }

      if (action === 'delete-quotation') {
        if (!currentSelectedIndice || !selectedCotacaoRow || loading || saving || checkingUsage || deletingIndex || migratingIndex || quotingIndex) {
          return;
        }

        setQuotationError('');
        setQuotationDeleteDialogState({
          open: true,
          target: {
            indice: currentSelectedIndice,
            cotacao: selectedCotacaoRow,
          },
        });
      }
    };

    window.addEventListener('brana-indices-financeiros-toolbar-action', onToolbarAction);
    return () => window.removeEventListener('brana-indices-financeiros-toolbar-action', onToolbarAction);
  }, [checkingUsage, deletingIndex, loading, migratingIndex, quotingIndex, saving, selectedCotacaoRow]);

  const handleSelectIndice = (numero) => {
    selectRow(numero);
    selectCotacaoRow(null);
    clearCotacoesState();
    setQuotationDialogState((current) => (current.open && current.mode === 'edit' ? { ...current, open: false } : current));
  };

  const handleCloseModal = () => {
    if (saving) return;
    setModalState(EMPTY_MODAL);
    setSubmitError('');
  };

  const handleCloseDeleteDialog = () => {
    if (deletingIndex || checkingUsage) return;
    setDeleteDialogState({ open: false, target: null });
    setDeleteError('');
  };

  const handleCloseMigrationDialog = () => {
    if (migratingIndex || checkingUsage) return;
    setMigrationDialogState({ open: false, target: null, numeroDestino: null });
    setMigrationError('');
  };

  const handleCloseQuotationDialog = () => {
    if (quotingIndex) return;
    setQuotationDialogState({ open: false, mode: 'create', target: null, cotacaoId: null, initialValues: { data: '', valor: '' } });
    setQuotationError('');
  };

  const handleCloseQuotationDeleteDialog = () => {
    if (quotingIndex) return;
    setQuotationDeleteDialogState({ open: false, target: null });
    setQuotationError('');
  };

  const handleConfirmDelete = async () => {
    const target = deleteDialogState.target;
    if (!target || deletingIndex || checkingUsage) {
      return;
    }

    setDeleteError('');
    setDeletingIndex(true);
    try {
      await deleteIndiceFinanceiro(target.numero);
      await reload();
      clearCotacoesState();
      const nextRow = rows.find((row) => Number(row.numero) !== Number(target.numero) && canDeleteIndiceFinanceiro(row)) || null;
      if (nextRow?.numero != null) {
        selectRow(nextRow.numero);
      } else {
        selectRow(null);
      }
      setDeleteDialogState({ open: false, target: null });
    } catch (err) {
      setDeleteError(err?.message || 'Falha ao excluir índice financeiro.');
    } finally {
      setDeletingIndex(false);
    }
  };

  const handleConfirmMigration = async () => {
    const target = migrationDialogState.target;
    const numeroDestino = Number(migrationDialogState.numeroDestino);

    if (!canMigrateAndDeleteIndiceFinanceiro(target) || migratingIndex || checkingUsage || !Number.isFinite(numeroDestino) || numeroDestino <= 0 || Number(numeroDestino) === Number(target.numero)) {
      return;
    }

    setMigrationError('');
    setMigratingIndex(true);
    try {
      await migrateAndDeleteIndiceFinanceiro(target.numero, { numero_destino: numeroDestino });
      await reload();
      clearCotacoesState();
      setMigrationDialogState({ open: false, target: null, numeroDestino: null });
      selectRow(numeroDestino);
    } catch (err) {
      setMigrationError(err?.message || 'Falha ao migrar e excluir índice financeiro.');
    } finally {
      setMigratingIndex(false);
    }
  };

  const migrationOptions = useMemo(() => {
    const targetNumero = migrationDialogState.target?.numero;
    return rows.filter((row) => Number(row.numero) !== Number(targetNumero));
  }, [migrationDialogState.target, rows]);

  const handleConfirmQuotation = async (values) => {
    const target = quotationDialogState.target || selectedIndiceRef.current;
    const resolvedNumero = Number(target?.numero);
    const resolvedCotacaoId = Number(quotationDialogState.cotacaoId);
    const isEditMode = quotationDialogState.mode === 'edit';
    const parsedValue = parseIndiceFinanceiroQuotationValue(values?.valorRaw);

    if (!target || !Number.isFinite(resolvedNumero) || resolvedNumero <= 0 || quotingIndex || loading || saving || checkingUsage || deletingIndex || migratingIndex) {
      return;
    }

    if (isEditMode && (!Number.isFinite(resolvedCotacaoId) || resolvedCotacaoId <= 0)) {
      throw new Error('Selecione uma cotação válida.');
    }

    if (!values?.data || !values?.valorRaw || parsedValue == null || parsedValue <= 0) {
      throw new Error('Informe uma cotação válida.');
    }

    setQuotationError('');
    setQuotingIndex(true);
    try {
      if (isEditMode) {
        await updateIndiceFinanceiroCotacao(resolvedNumero, resolvedCotacaoId, {
          data: values.data,
          valor: parsedValue,
        });
      } else {
        await createIndiceFinanceiroCotacao(resolvedNumero, {
          data: values.data,
          valor: parsedValue,
        });
      }
      await reloadCotacoes();
      await reload();
      selectRow(resolvedNumero);
      if (isEditMode) {
        selectCotacaoRow(resolvedCotacaoId);
      }
      setQuotationDialogState({ open: false, mode: 'create', target: null, cotacaoId: null, initialValues: { data: '', valor: '' } });
    } catch (err) {
      setQuotationError(err?.message || 'Falha ao salvar cotação.');
      throw err;
    } finally {
      setQuotingIndex(false);
    }
  };

  const pickNextCotacaoId = (rowsSnapshot, deletedCotacaoId) => {
    if (!Array.isArray(rowsSnapshot) || rowsSnapshot.length === 0) {
      return null;
    }

    const currentIndex = rowsSnapshot.findIndex((row) => Number(row.cotacaoId) === Number(deletedCotacaoId));
    if (currentIndex < 0) {
      return null;
    }

    const nextRow = rowsSnapshot[currentIndex + 1] || rowsSnapshot[currentIndex - 1] || null;
    return nextRow ? Number(nextRow.cotacaoId) : null;
  };

  const handleConfirmQuotationDelete = async () => {
    const target = quotationDeleteDialogState.target;
    const targetIndice = target?.indice || null;
    const targetCotacao = target?.cotacao || null;
    const resolvedNumero = Number(targetIndice?.numero);
    const resolvedCotacaoId = Number(targetCotacao?.cotacaoId ?? targetCotacao?.id);

    if (!targetIndice || !targetCotacao || !Number.isFinite(resolvedNumero) || resolvedNumero <= 0 || !Number.isFinite(resolvedCotacaoId) || resolvedCotacaoId <= 0 || quotingIndex || loading || saving || checkingUsage || deletingIndex || migratingIndex) {
      return;
    }

    setQuotationError('');
    setQuotingIndex(true);
    try {
      const nextSelectedCotacaoId = pickNextCotacaoId(cotacoesRows, resolvedCotacaoId);
      await deleteIndiceFinanceiroCotacao(resolvedNumero, resolvedCotacaoId);
      await reloadCotacoes();
      await reload();
      selectRow(resolvedNumero);
      selectCotacaoRow(nextSelectedCotacaoId);
      setQuotationDeleteDialogState({ open: false, target: null });
    } catch (err) {
      setQuotationError(err?.message || 'Falha ao excluir cota��o.');
      throw err;
    } finally {
      setQuotingIndex(false);
    }
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    setSubmitError('');

    try {
      if (modalState.mode === 'edit') {
        const currentSelectedIndice = selectedIndiceRef.current;
        if (modalState.numero == null || !canEditIndiceFinanceiro(currentSelectedIndice)) {
          throw new Error('Índice inválido.');
        }
        await updateIndiceFinanceiro(modalState.numero, values);
        await reload();
        selectRow(modalState.numero);
        setModalState(EMPTY_MODAL);
        message.success('Índice financeiro alterado com sucesso.');
      } else {
        const created = await criarIndiceFinanceiro(values);
        await reload();
        if (created?.numero != null) {
          selectRow(created.numero);
        }
        setModalState(EMPTY_MODAL);
        message.success('Índice financeiro criado com sucesso.');
      }
    } catch (err) {
      setSubmitError(err?.message || (modalState.mode === 'edit' ? 'Falha ao alterar índice financeiro.' : 'Falha ao criar índice financeiro.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="indices-financeiros-page">
      <div className="indices-financeiros-panels">
        <IndicesFinanceirosTable
          rows={rows}
          loading={loading}
          error={error}
          selectedNumero={selectedNumero}
          selectedRow={selectedRow}
          onSelect={handleSelectIndice}
          onRetry={reload}
        />
        <IndicesCotacoesTable
          rows={cotacoesRows}
          loading={cotacoesLoading}
          error={cotacoesError}
          selectedKey={selectedCotacaoKey}
          onSelect={selectCotacaoRow}
          onRetry={reloadCotacoes}
          hasSelectedIndex={hasSelectedIndex}
        />
      </div>
      <IndiceFinanceiroFormDialog
        open={modalState.open}
        mode={modalState.mode}
        initialValues={modalState.initialValues}
        saving={saving}
        submitError={submitError}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
      />
      <IndiceFinanceiroDeleteDialog
        open={deleteDialogState.open}
        target={deleteDialogState.target}
        loading={deletingIndex}
        error={deleteError}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
      <IndiceFinanceiroMigrationDialog
        open={migrationDialogState.open}
        target={migrationDialogState.target}
        loading={migratingIndex}
        error={migrationError}
        destinationOptions={migrationOptions}
        selectedDestinationNumero={migrationDialogState.numeroDestino}
        onDestinationChange={(value) => setMigrationDialogState((current) => ({ ...current, numeroDestino: value == null ? null : Number(value) }))}
        onCancel={handleCloseMigrationDialog}
        onConfirm={handleConfirmMigration}
      />
      <IndiceFinanceiroQuotationFormDialog
        open={quotationDialogState.open}
        mode={quotationDialogState.mode}
        indice={quotationDialogState.target}
        initialValues={quotationDialogState.initialValues}
        saving={quotingIndex}
        submitError={quotationError}
        onCancel={handleCloseQuotationDialog}
        onSubmit={handleConfirmQuotation}
      />
      <IndiceFinanceiroQuotationDeleteDialog
        open={quotationDeleteDialogState.open}
        loading={quotingIndex}
        error={quotationError}
        indice={quotationDeleteDialogState.target?.indice}
        cotacao={quotationDeleteDialogState.target?.cotacao}
        onCancel={handleCloseQuotationDeleteDialog}
        onConfirm={handleConfirmQuotationDelete}
      />
    </div>
  );
}
