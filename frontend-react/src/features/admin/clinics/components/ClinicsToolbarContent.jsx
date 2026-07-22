import { Input, InputNumber } from 'antd';
import {
  ADMIN_CLINIC_TRIAL_EXTRA_MAX_DAYS,
  ADMIN_CLINIC_TRIAL_EXTRA_MIN_DAYS,
} from '../services/adminClinicActionsApi.js';

export function ClinicsToolbarContent({
  searchDraft,
  onSearchChange,
  trialDays,
  trialLoading,
  trialDisabled,
  onTrialDaysChange,
  onExtendTrial,
  statusActionLabel = 'Suspender',
  statusActionDisabled = true,
  statusActionLoading = false,
  onStatusAction,
  demoDisabled = true,
  demoLoading = false,
  onDemo,
  monthlyDisabled = true,
  monthlyLoading = false,
  onMonthly,
  annualDisabled = true,
  annualLoading = false,
  onAnnual,
  superAdminDisabled = true,
  superAdminLoading = false,
  superAdminLabel = 'Super Admin',
  onSuperAdmin,
  canCreateAccount = false,
  createAccountLoading = false,
  onCreateAccount,
}) {
  return (
    <div className="admin-clinics-toolbar" role="toolbar" aria-label="Controles de leitura de clínicas">
      <div className="materiais-estoque-toolbar-actions admin-clinics-toolbar-actions">
        <InputNumber
          size="small"
          min={ADMIN_CLINIC_TRIAL_EXTRA_MIN_DAYS}
          max={ADMIN_CLINIC_TRIAL_EXTRA_MAX_DAYS}
          step={1}
          precision={0}
          controls={false}
          disabled={trialDisabled || trialLoading}
          value={trialDays}
          aria-label="Dias de teste"
          className="admin-clinics-toolbar-days"
          onChange={onTrialDaysChange}
        />
        <button
          type="button"
          className="auxiliary-shell-button primary"
          disabled={trialDisabled || trialLoading}
          aria-busy={trialLoading}
          onClick={() => {
            if (trialDisabled || trialLoading) return;
            onExtendTrial?.();
          }}
        >
          {trialLoading ? '+Teste...' : '+Teste'}
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          disabled={statusActionDisabled || statusActionLoading}
          aria-busy={statusActionLoading}
          onClick={() => {
            if (statusActionDisabled || statusActionLoading) return;
            onStatusAction?.();
          }}
        >
          {statusActionLoading ? `${statusActionLabel}...` : statusActionLabel}
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          disabled={demoDisabled || demoLoading}
          aria-busy={demoLoading}
          onClick={() => {
            if (demoDisabled || demoLoading) return;
            onDemo?.();
          }}
        >
          {demoLoading ? 'Demo...' : 'Demo'}
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          disabled={monthlyDisabled || monthlyLoading}
          aria-busy={monthlyLoading}
          onClick={() => {
            if (monthlyDisabled || monthlyLoading) return;
            onMonthly?.();
          }}
        >
          {monthlyLoading ? 'Mensal...' : 'Mensal'}
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          disabled={annualDisabled || annualLoading}
          aria-busy={annualLoading}
          onClick={() => {
            if (annualDisabled || annualLoading) return;
            onAnnual?.();
          }}
        >
          {annualLoading ? 'Anual...' : 'Anual'}
        </button>
        <button
          type="button"
          className="auxiliary-shell-button"
          disabled={superAdminDisabled || superAdminLoading}
          aria-busy={superAdminLoading}
          onClick={() => {
            if (superAdminDisabled || superAdminLoading) return;
            onSuperAdmin?.();
          }}
        >
          {superAdminLoading ? `${superAdminLabel}...` : superAdminLabel}
        </button>
        {canCreateAccount ? (
          <button
            type="button"
            className="auxiliary-shell-button"
            disabled={createAccountLoading}
            aria-busy={createAccountLoading}
            onClick={() => {
              if (createAccountLoading) return;
              onCreateAccount?.();
            }}
          >
            {createAccountLoading ? 'Nova conta...' : 'Nova conta'}
          </button>
        ) : null}
        <button type="button" className="auxiliary-shell-button danger" disabled>
          Excluir
        </button>
      </div>

      <div className="admin-clinics-toolbar-search">
        <Input.Search
          allowClear
          size="small"
          value={searchDraft}
          placeholder="Buscar clínica"
          aria-label="Buscar clínica"
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
      </div>
    </div>
  );
}
