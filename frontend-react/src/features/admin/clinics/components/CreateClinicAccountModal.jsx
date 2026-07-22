import { Input, Modal } from 'antd';

export const EMPTY_CREATE_CLINIC_ACCOUNT_FORM = {
  nomeClinica: '',
  adminNome: '',
  adminEmail: '',
  adminSenha: '',
  adminConfirmaSenha: '',
};

export function CreateClinicAccountModal({ open, values, loading, onChange, onCancel, onSubmit }) {
  const form = values || EMPTY_CREATE_CLINIC_ACCOUNT_FORM;
  const updateField = (field) => (event) => {
    onChange?.({ ...form, [field]: event.target.value });
  };

  return (
    <Modal
      title="Nova conta"
      open={open}
      okText="Criar conta"
      cancelText="Cancelar"
      confirmLoading={loading}
      onOk={onSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
      <div className="admin-clinics-new-account-form">
        <label className="admin-clinics-new-account-field">
          <span>Nome da clínica</span>
          <Input
            value={form.nomeClinica}
            maxLength={120}
            disabled={loading}
            autoFocus
            placeholder="Ex.: Clínica Brana"
            onChange={updateField('nomeClinica')}
          />
        </label>
        <label className="admin-clinics-new-account-field">
          <span>Nome do administrador</span>
          <Input
            value={form.adminNome}
            maxLength={120}
            disabled={loading}
            placeholder="Ex.: Maria Silva"
            onChange={updateField('adminNome')}
          />
        </label>
        <label className="admin-clinics-new-account-field">
          <span>E-mail do administrador</span>
          <Input
            value={form.adminEmail}
            maxLength={180}
            disabled={loading}
            placeholder="admin@clinica.com"
            onChange={updateField('adminEmail')}
          />
        </label>
        <label className="admin-clinics-new-account-field">
          <span>Senha temporária</span>
          <Input.Password
            value={form.adminSenha}
            disabled={loading}
            autoComplete="new-password"
            placeholder="Mínimo de 6 caracteres"
            onChange={updateField('adminSenha')}
          />
        </label>
        <label className="admin-clinics-new-account-field">
          <span>Confirmar senha temporária</span>
          <Input.Password
            value={form.adminConfirmaSenha}
            disabled={loading}
            autoComplete="new-password"
            placeholder="Repita a senha"
            onChange={updateField('adminConfirmaSenha')}
          />
        </label>
        <p className="admin-clinics-new-account-note">
          A conta será criada ativa, no plano Demo de 7 dias, com primeiro acesso pendente para o administrador.
        </p>
      </div>
    </Modal>
  );
}
