import { Input, Modal, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminModuleShell } from '../shared/AdminModuleShell.jsx';
import { ClinicsToolbarContent } from './components/ClinicsToolbarContent.jsx';
import {
  CreateClinicAccountModal,
  EMPTY_CREATE_CLINIC_ACCOUNT_FORM,
} from './components/CreateClinicAccountModal.jsx';
import { ClinicsTable } from './components/ClinicsTable.jsx';
import { ClinicsLoadingState } from './components/ClinicsLoadingState.jsx';
import { ClinicsErrorState } from './components/ClinicsErrorState.jsx';
import { ClinicsEmptyState } from './components/ClinicsEmptyState.jsx';
import { useAdminClinics } from './hooks/useAdminClinics.js';
import { useClinicsTableState } from './hooks/useClinicsTableState.js';
import { useExtendClinicTrial } from './hooks/useExtendClinicTrial.js';
import { useUpdateClinicStatus } from './hooks/useUpdateClinicStatus.js';
import { useSetClinicDemo } from './hooks/useSetClinicDemo.js';
import { useSetClinicMonthlyPlan } from './hooks/useSetClinicMonthlyPlan.js';
import { useSetClinicAnnualPlan } from './hooks/useSetClinicAnnualPlan.js';
import { useSetClinicSuperAdminPlan } from './hooks/useSetClinicSuperAdminPlan.js';
import { useCreateAdminClinicAccount } from './hooks/useCreateAdminClinicAccount.js';
import {
  ADMIN_CLINIC_STATUS_REASON_MAX_LENGTH,
  ADMIN_CLINIC_TRIAL_EXTRA_INITIAL_DAYS,
  normalizeClinicStatusReason,
  normalizeTrialExtraDays,
} from './services/adminClinicActionsApi.js';
import '../admin.css';

export function ClinicsPage({ user, onToolbarChange, navigationState, onConsumeNavigationState }) {
  const clinics = useAdminClinics();
  const tableState = useClinicsTableState(clinics.rows, clinics.totalFromBackend);
  const trialAction = useExtendClinicTrial();
  const statusAction = useUpdateClinicStatus();
  const demoAction = useSetClinicDemo();
  const monthlyAction = useSetClinicMonthlyPlan();
  const annualAction = useSetClinicAnnualPlan();
  const superAdminAction = useSetClinicSuperAdminPlan();
  const createAccountAction = useCreateAdminClinicAccount();
  const [trialDays, setTrialDays] = useState(ADMIN_CLINIC_TRIAL_EXTRA_INITIAL_DAYS);
  const [trialConfirm, setTrialConfirm] = useState(null);
  const [statusConfirm, setStatusConfirm] = useState(null);
  const [statusReason, setStatusReason] = useState('');
  const [demoConfirm, setDemoConfirm] = useState(null);
  const [monthlyConfirm, setMonthlyConfirm] = useState(null);
  const [annualConfirm, setAnnualConfirm] = useState(null);
  const [superAdminConfirm, setSuperAdminConfirm] = useState(null);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [createAccountForm, setCreateAccountForm] = useState(EMPTY_CREATE_CLINIC_ACCOUNT_FORM);
  const selectedClinicIdFromUsers = Number(navigationState?.selectedClinicId || 0) || null;
  const selectedClinic = useMemo(
    () => tableState.rows.find((row) => Number(row.id) === Number(clinics.selectedId)) || null,
    [clinics.selectedId, tableState.rows],
  );
  const statusActionLabel = selectedClinic?.ativo === false ? 'Ativar' : 'Suspender';
  const demoDisabled = !selectedClinic || selectedClinic.plano === 'MASTER';
  const monthlyDisabled = !selectedClinic || selectedClinic.plano === 'MASTER';
  const annualDisabled = !selectedClinic || selectedClinic.plano === 'MASTER';
  const superAdminDisabled = !selectedClinic || selectedClinic.plano === 'MASTER';
  const canCreateAccount = Boolean(user?.is_master);

  const handleExtendTrial = useCallback(() => {
    if (!selectedClinic) {
      message.error('Selecione uma clínica.');
      return;
    }

    let resolvedDays;
    try {
      resolvedDays = normalizeTrialExtraDays(trialDays);
    } catch (err) {
      message.error(err?.message || 'Informe dias válidos.');
      return;
    }

    setTrialConfirm({
      clinicaId: selectedClinic.id,
      clinicaNome: selectedClinic.nome || `#${selectedClinic.id}`,
      dias: resolvedDays,
    });
  }, [selectedClinic, trialDays]);

  const handleCancelExtendTrial = useCallback(() => {
    if (trialAction.loading) return;
    setTrialConfirm(null);
  }, [trialAction.loading]);

  const handleConfirmExtendTrial = useCallback(async () => {
    if (!trialConfirm) {
      message.error('Selecione uma clínica.');
      return;
    }

    try {
      const result = await trialAction.execute({ clinicaId: trialConfirm.clinicaId, dias: trialConfirm.dias });
      if (!result) return;
      message.success(result.detail || 'Período de teste prorrogado.');
      setTrialConfirm(null);
      await clinics.refresh();
    } catch (err) {
      message.error(err?.message || 'Falha ao prorrogar período de teste.');
    }
  }, [clinics, trialAction, trialConfirm]);

  const handleStatusAction = useCallback(() => {
    if (!selectedClinic) {
      message.error('Selecione uma clínica.');
      return;
    }

    setStatusReason('');
    setStatusConfirm({
      clinicaId: selectedClinic.id,
      clinicaNome: selectedClinic.nome || `#${selectedClinic.id}`,
      ativo: selectedClinic.ativo === false,
    });
  }, [selectedClinic]);

  const handleCancelStatusAction = useCallback(() => {
    if (statusAction.loading) return;
    setStatusConfirm(null);
    setStatusReason('');
  }, [statusAction.loading]);

  const handleConfirmStatusAction = useCallback(async () => {
    if (!statusConfirm) {
      message.error('Selecione uma clínica.');
      return;
    }

    let resolvedReason;
    try {
      resolvedReason = normalizeClinicStatusReason(statusReason);
    } catch (err) {
      message.error(err?.message || 'Informe um motivo válido.');
      return;
    }

    try {
      const result = await statusAction.execute({
        clinicId: statusConfirm.clinicaId,
        ativo: statusConfirm.ativo,
        motivo: resolvedReason,
      });
      if (!result) return;
      message.success(result.detail || 'Status da clínica atualizado.');
      setStatusConfirm(null);
      setStatusReason('');
      await clinics.refresh();
    } catch (err) {
      message.error(err?.message || 'Falha ao atualizar status da clínica.');
    }
  }, [clinics, statusAction, statusConfirm, statusReason]);

  const handleDemo = useCallback(() => {
    if (!selectedClinic) {
      message.error('Selecione uma clínica.');
      return;
    }
    if (selectedClinic.plano === 'MASTER') {
      message.error('Clínica MASTER não pode ser alterada por esta ação.');
      return;
    }

    setDemoConfirm({
      clinicaId: selectedClinic.id,
      clinicaNome: selectedClinic.nome || `#${selectedClinic.id}`,
      planoAtual: selectedClinic.plano || '-',
      statusAtual: selectedClinic.assinaturaStatus || '-',
    });
  }, [selectedClinic]);

  const handleCancelDemo = useCallback(() => {
    if (demoAction.loading) return;
    setDemoConfirm(null);
  }, [demoAction.loading]);

  const handleConfirmDemo = useCallback(async () => {
    if (!demoConfirm) {
      message.error('Selecione uma clínica.');
      return;
    }

    try {
      const result = await demoAction.execute({ clinicId: demoConfirm.clinicaId });
      if (!result) return;
      message.success(result.detail || 'Plano Demo aplicado.');
      setDemoConfirm(null);
      await clinics.refresh();
    } catch (err) {
      message.error(err?.message || 'Falha ao aplicar plano Demo.');
    }
  }, [clinics, demoAction, demoConfirm]);

  const handleMonthly = useCallback(() => {
    if (!selectedClinic) {
      message.error('Selecione uma clínica.');
      return;
    }
    if (selectedClinic.plano === 'MASTER') {
      message.error('Clínica MASTER não pode ser alterada por esta ação.');
      return;
    }

    setMonthlyConfirm({
      clinicaId: selectedClinic.id,
      clinicaNome: selectedClinic.nome || `#${selectedClinic.id}`,
      planoAtual: selectedClinic.plano || '-',
      statusAtual: selectedClinic.assinaturaStatus || '-',
    });
  }, [selectedClinic]);

  const handleCancelMonthly = useCallback(() => {
    if (monthlyAction.loading) return;
    setMonthlyConfirm(null);
  }, [monthlyAction.loading]);

  const handleConfirmMonthly = useCallback(async () => {
    if (!monthlyConfirm) {
      message.error('Selecione uma clínica.');
      return;
    }

    try {
      const result = await monthlyAction.execute({ clinicId: monthlyConfirm.clinicaId });
      if (!result) return;
      message.success(result.detail || 'Plano Mensal aplicado.');
      setMonthlyConfirm(null);
      await clinics.refresh();
    } catch (err) {
      message.error(err?.message || 'Falha ao aplicar plano Mensal.');
    }
  }, [clinics, monthlyAction, monthlyConfirm]);

  const handleAnnual = useCallback(() => {
    if (!selectedClinic) {
      message.error('Selecione uma clínica.');
      return;
    }
    if (selectedClinic.plano === 'MASTER') {
      message.error('Clínica MASTER não pode ser alterada por esta ação.');
      return;
    }

    setAnnualConfirm({
      clinicaId: selectedClinic.id,
      clinicaNome: selectedClinic.nome || `#${selectedClinic.id}`,
      planoAtual: selectedClinic.plano || '-',
      statusAtual: selectedClinic.assinaturaStatus || '-',
    });
  }, [selectedClinic]);

  const handleCancelAnnual = useCallback(() => {
    if (annualAction.loading) return;
    setAnnualConfirm(null);
  }, [annualAction.loading]);

  const handleConfirmAnnual = useCallback(async () => {
    if (!annualConfirm) {
      message.error('Selecione uma clínica.');
      return;
    }

    try {
      const result = await annualAction.execute({ clinicId: annualConfirm.clinicaId });
      if (!result) return;
      message.success(result.detail || 'Plano Anual aplicado.');
      setAnnualConfirm(null);
      await clinics.refresh();
    } catch (err) {
      message.error(err?.message || 'Falha ao aplicar plano Anual.');
    }
  }, [annualAction, annualConfirm, clinics]);

  const handleSuperAdmin = useCallback(() => {
    if (!selectedClinic) {
      message.error('Selecione uma clínica.');
      return;
    }
    if (selectedClinic.plano === 'MASTER') {
      message.error('Clínica MASTER não pode ser alterada por esta ação.');
      return;
    }

    setSuperAdminConfirm({
      clinicaId: selectedClinic.id,
      clinicaNome: selectedClinic.nome || `#${selectedClinic.id}`,
      planoAtual: selectedClinic.plano || '-',
      statusAtual: selectedClinic.assinaturaStatus || '-',
    });
  }, [selectedClinic]);

  const handleCancelSuperAdmin = useCallback(() => {
    if (superAdminAction.loading) return;
    setSuperAdminConfirm(null);
  }, [superAdminAction.loading]);

  const handleConfirmSuperAdmin = useCallback(async () => {
    if (!superAdminConfirm) {
      message.error('Selecione uma clínica.');
      return;
    }

    try {
      const result = await superAdminAction.execute({ clinicId: superAdminConfirm.clinicaId });
      if (!result) return;
      message.success(result.detail || 'Plano Super Admin aplicado.');
      setSuperAdminConfirm(null);
      await clinics.refresh();
    } catch (err) {
      message.error(err?.message || 'Falha ao aplicar plano Super Admin.');
    }
  }, [clinics, superAdminAction, superAdminConfirm]);

  const handleOpenCreateAccount = useCallback(() => {
    if (!canCreateAccount) {
      message.error('Acesso restrito ao proprietário da plataforma.');
      return;
    }
    setCreateAccountForm(EMPTY_CREATE_CLINIC_ACCOUNT_FORM);
    setCreateAccountOpen(true);
  }, [canCreateAccount]);

  const handleCancelCreateAccount = useCallback(() => {
    if (createAccountAction.loading) return;
    setCreateAccountOpen(false);
    setCreateAccountForm(EMPTY_CREATE_CLINIC_ACCOUNT_FORM);
  }, [createAccountAction.loading]);

  const handleSubmitCreateAccount = useCallback(async () => {
    try {
      const result = await createAccountAction.execute(createAccountForm);
      if (!result) return;
      message.success(result.detail || 'Conta criada com sucesso.');
      setCreateAccountOpen(false);
      setCreateAccountForm(EMPTY_CREATE_CLINIC_ACCOUNT_FORM);
      await clinics.refresh();
      if (result.clinica_id) {
        clinics.setSelectedId(Number(result.clinica_id));
      }
    } catch (err) {
      message.error(err?.message || 'Falha ao criar nova conta.');
    }
  }, [clinics, createAccountAction, createAccountForm]);

  const toolbar = useMemo(
    () => (
      <ClinicsToolbarContent
        searchDraft={clinics.searchDraft}
        onSearchChange={clinics.updateSearch}
        trialDays={trialDays}
        trialLoading={trialAction.loading}
        trialDisabled={!selectedClinic}
        onTrialDaysChange={setTrialDays}
        onExtendTrial={handleExtendTrial}
        statusActionLabel={statusActionLabel}
        statusActionDisabled={!selectedClinic}
        statusActionLoading={statusAction.loading}
        onStatusAction={handleStatusAction}
        demoDisabled={demoDisabled}
        demoLoading={demoAction.loading}
        onDemo={handleDemo}
        monthlyDisabled={monthlyDisabled}
        monthlyLoading={monthlyAction.loading}
        onMonthly={handleMonthly}
        annualDisabled={annualDisabled}
        annualLoading={annualAction.loading}
        onAnnual={handleAnnual}
        superAdminDisabled={superAdminDisabled}
        superAdminLoading={superAdminAction.loading}
        superAdminLabel="Super Admin"
        onSuperAdmin={handleSuperAdmin}
        canCreateAccount={canCreateAccount}
        createAccountLoading={createAccountAction.loading}
        onCreateAccount={handleOpenCreateAccount}
      />
    ),
    [
      clinics.searchDraft,
      clinics.updateSearch,
      annualAction.loading,
      annualDisabled,
      demoAction.loading,
      demoDisabled,
      handleAnnual,
      handleExtendTrial,
      handleDemo,
      handleMonthly,
      handleOpenCreateAccount,
      handleStatusAction,
      monthlyAction.loading,
      monthlyDisabled,
      selectedClinic,
      statusAction.loading,
      statusActionLabel,
      canCreateAccount,
      createAccountAction.loading,
      superAdminAction.loading,
      superAdminDisabled,
      handleSuperAdmin,
      trialAction.loading,
      trialDays,
    ],
  );

  useEffect(() => {
    onToolbarChange?.(toolbar);
    return () => onToolbarChange?.(null);
  }, [onToolbarChange, toolbar]);

  useEffect(() => {
    clinics.setSelectedId((current) => {
      if (current === null || current === undefined) return null;
      return tableState.rows.some((row) => Number(row.id) === Number(current)) ? Number(current) : null;
    });
  }, [clinics.setSelectedId, tableState.rows]);

  useEffect(() => {
    if (!selectedClinicIdFromUsers || clinics.loading || clinics.refreshing) return;

    const target = clinics.rows.find((row) => Number(row.id) === Number(selectedClinicIdFromUsers));
    if (!target) {
      clinics.setSelectedId(null);
      message.warning('A conta vinculada a este usuÃ¡rio nÃ£o foi encontrada.');
      onConsumeNavigationState?.();
      return;
    }

    const isVisible = tableState.rows.some((row) => Number(row.id) === Number(selectedClinicIdFromUsers));
    if (!isVisible) {
      tableState.clearFilters();
    }
    clinics.setSelectedId(Number(selectedClinicIdFromUsers));
    onConsumeNavigationState?.();
  }, [
    clinics.loading,
    clinics.refreshing,
    clinics.rows,
    clinics.setSelectedId,
    onConsumeNavigationState,
    selectedClinicIdFromUsers,
    tableState.clearFilters,
    tableState.rows,
  ]);

  if (clinics.loading && !clinics.rows.length && !clinics.error) {
    return (
      <AdminModuleShell title="Clínicas">
        <ClinicsLoadingState />
      </AdminModuleShell>
    );
  }

  return (
    <AdminModuleShell title="Clínicas">
      <div className="admin-clinics-page">
        {clinics.error ? <ClinicsErrorState error={clinics.error} onRetry={clinics.refresh} /> : null}

        {!clinics.error && !clinics.rows.length ? <ClinicsEmptyState /> : null}

        {clinics.rows.length ? (
          <ClinicsTable
            rows={tableState.rows}
            loading={clinics.refreshing}
            selectedId={clinics.selectedId}
            onSelect={clinics.setSelectedId}
            filters={tableState.filters}
            sortState={tableState.sortState}
            onSort={(key, order) => tableState.setSortState({ key, order })}
            visibleColumns={tableState.visibleColumns}
            onToggleVisibleColumn={tableState.toggleVisibleColumn}
            onFilterApply={tableState.applyFilter}
            onFilterClear={tableState.clearFilter}
            footerLabel={tableState.footerLabel}
          />
        ) : null}
      </div>
      <Modal
        title="Prorrogar período de teste"
        open={Boolean(trialConfirm)}
        okText="Prorrogar"
        cancelText="Cancelar"
        confirmLoading={trialAction.loading}
        onOk={handleConfirmExtendTrial}
        onCancel={handleCancelExtendTrial}
      >
        <p>
          {trialConfirm
            ? `Prorrogar o período de teste da clínica "${trialConfirm.clinicaNome}" por ${trialConfirm.dias} dias?`
            : ''}
        </p>
      </Modal>
      <Modal
        title={statusConfirm?.ativo ? 'Ativar clínica' : 'Suspender clínica'}
        open={Boolean(statusConfirm)}
        okText={statusConfirm?.ativo ? 'Confirmar ativação' : 'Confirmar suspensão'}
        cancelText="Cancelar"
        confirmLoading={statusAction.loading}
        onOk={handleConfirmStatusAction}
        onCancel={handleCancelStatusAction}
      >
        <p>
          {statusConfirm?.ativo
            ? `Ativar novamente a clínica "${statusConfirm.clinicaNome}"?`
            : `Suspender a clínica "${statusConfirm?.clinicaNome || ''}"? Usuários dessa clínica podem perder acesso ao sistema.`}
        </p>
        <Input.TextArea
          value={statusReason}
          maxLength={ADMIN_CLINIC_STATUS_REASON_MAX_LENGTH}
          showCount
          rows={3}
          placeholder="Motivo (opcional)"
          disabled={statusAction.loading}
          onChange={(event) => setStatusReason(event.target.value)}
        />
      </Modal>
      <Modal
        title="Aplicar plano Demo"
        open={Boolean(demoConfirm)}
        okText="Confirmar Demo"
        cancelText="Cancelar"
        confirmLoading={demoAction.loading}
        onOk={handleConfirmDemo}
        onCancel={handleCancelDemo}
      >
        <p>{demoConfirm ? `Aplicar o plano Demo para a clínica "${demoConfirm.clinicaNome}"?` : ''}</p>
        <p>
          A ação altera o plano da clínica para Demo, mantém a clínica ativa e faz o backend criar um novo período de
          validade padrão de 7 dias.
        </p>
        <p>
          O estado da tabela será atualizado por refetch após a resposta do servidor. Cobranças existentes não são
          excluídas por esta ação.
        </p>
      </Modal>
      <Modal
        title="Aplicar plano Mensal"
        open={Boolean(monthlyConfirm)}
        okText="Confirmar Mensal"
        cancelText="Cancelar"
        confirmLoading={monthlyAction.loading}
        onOk={handleConfirmMonthly}
        onCancel={handleCancelMonthly}
      >
        <p>{monthlyConfirm ? `Aplicar o plano Mensal para a clínica "${monthlyConfirm.clinicaNome}"?` : ''}</p>
        <p>{monthlyConfirm ? `Plano atual: ${monthlyConfirm.planoAtual}. Novo plano: Mensal.` : ''}</p>
        <p>
          A ação altera o plano administrativo para Mensal, mantém a clínica ativa e faz o backend definir a validade
          padrão de 30 dias.
        </p>
        <p>
          Este endpoint sincroniza a assinatura, mas não cria cobrança, boleto, Pix ou checkout financeiro.
        </p>
      </Modal>
      <Modal
        title="Aplicar plano Anual"
        open={Boolean(annualConfirm)}
        okText="Confirmar Anual"
        cancelText="Cancelar"
        confirmLoading={annualAction.loading}
        onOk={handleConfirmAnnual}
        onCancel={handleCancelAnnual}
      >
        <p>{annualConfirm ? `Aplicar o plano Anual para a clínica "${annualConfirm.clinicaNome}"?` : ''}</p>
        <p>{annualConfirm ? `Plano atual: ${annualConfirm.planoAtual}. Novo plano: Anual.` : ''}</p>
        <p>
          A ação altera o plano administrativo para Anual, mantém a clínica ativa e faz o backend definir a validade
          padrão de 365 dias.
        </p>
        <p>
          Este endpoint sincroniza a assinatura e a próxima cobrança derivada, mas não cria cobrança, boleto, Pix ou
          checkout financeiro.
        </p>
      </Modal>
      <Modal
        title="Aplicar plano Super Admin"
        open={Boolean(superAdminConfirm)}
        okText="Confirmar Super Admin"
        cancelText="Cancelar"
        confirmLoading={superAdminAction.loading}
        onOk={handleConfirmSuperAdmin}
        onCancel={handleCancelSuperAdmin}
      >
        <p>
          {superAdminConfirm
            ? `Aplicar o plano Super Admin para a clínica "${superAdminConfirm.clinicaNome}"?`
            : ''}
        </p>
        <p>{superAdminConfirm ? `Plano atual: ${superAdminConfirm.planoAtual}. Novo plano: Super Admin.` : ''}</p>
        <p>
          A ação altera somente o plano administrativo da clínica para Super Admin, mantém a clínica ativa e faz o
          backend definir a validade padrão de 365 dias.
        </p>
        <p>
          O endpoint não promove usuário, não altera sessão, não altera `is_master` ou `is_superadmin` no usuário e não
          cria cobrança, boleto, Pix ou checkout financeiro.
        </p>
      </Modal>
      <CreateClinicAccountModal
        open={createAccountOpen}
        values={createAccountForm}
        loading={createAccountAction.loading}
        onChange={setCreateAccountForm}
        onCancel={handleCancelCreateAccount}
        onSubmit={handleSubmitCreateAccount}
      />
    </AdminModuleShell>
  );
}
