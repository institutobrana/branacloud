import { Avatar, Button, Checkbox, Input, Modal, Select, Tabs, Typography, message } from 'antd';
import { CameraOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import './preferenciasUsuario.css';

const moduloAberturaOptions = [
  'Agenda diária',
  'Agenda por unidade',
  'Agenda semanal',
  'Cadastro de pacientes',
  'Contas a pagar',
  'Contas a receber',
  'Controle de estoque',
  'Dashboard',
  'Ficha clínica',
  'Fluxo de caixa',
  'Gerenciar tratamentos',
];

const especialidadesOptions = [
  'Cirurgia',
  'Dentística',
  'Diagnóstico',
  'Emergência',
  'Endodontia',
  'Estomatologia',
  'Estética',
  'Gerais',
  'Harmonização Orofacial',
  'Implantodontia',
  'Odontologia Legal',
  'Odontopediatria',
  'Ortodontia',
  'Ortopedia Funcional dos Maxilares',
];

function PreferenciasTabLabel({ children }) {
  return <span className="preferencias-tab-label">{children}</span>;
}

function ClassicFormRow({ label, children, className = '' }) {
  return (
    <div className={`preferencias-form-row ${className}`.trim()}>
      <div className="preferencias-form-label">{label}</div>
      <div className="preferencias-form-field">{children}</div>
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="preferencias-tab-content preferencias-classic-window preferencias-general-tab">
      <div className="preferencias-geral-easy-layout">
        <div className="preferencias-geral-form-area">
          <div className="preferencias-general-form preferencias-general-form-fixed preferencias-general-identity-grid">
            <ClassicFormRow label="Nome:">
              <span className="preferencias-form-value">Gleisson Tel</span>
            </ClassicFormRow>
            <ClassicFormRow label="CPF:">
              <span className="preferencias-form-value">280.106.918-36</span>
            </ClassicFormRow>
            <ClassicFormRow label="CRO/UF:">
              <span className="preferencias-form-value">81611-SP</span>
            </ClassicFormRow>
            <ClassicFormRow label="Apresentação:">
              <Input.TextArea rows={3} defaultValue="Apresentação ou CV resumido do profissional" />
            </ClassicFormRow>
            <ClassicFormRow label="Envio padrão para mensagens:">
              <Select
                className="preferencias-select-wide"
                defaultValue="WhatsApp Web (apenas 1 envio)"
                options={[{ label: 'WhatsApp Web (apenas 1 envio)', value: 'WhatsApp Web (apenas 1 envio)' }]}
              />
            </ClassicFormRow>
            <ClassicFormRow label="Conta bancária padrão:">
              <Select
                className="preferencias-select-wide"
                defaultValue="CX Gleisson Tel"
                options={[{ label: 'CX Gleisson Tel', value: 'CX Gleisson Tel' }]}
              />
            </ClassicFormRow>
            <ClassicFormRow label="Estoque padrão:">
              <Select
                className="preferencias-select-wide"
                allowClear
                defaultValue="Estoque padrão"
                options={[{ label: 'Estoque padrão', value: 'Estoque padrão' }]}
              />
            </ClassicFormRow>
            <ClassicFormRow label="Módulo de abertura:">
              <Select
                className="preferencias-select-wide"
                allowClear
                defaultValue="Dashboard"
                options={moduloAberturaOptions.map((item) => ({ label: item, value: item }))}
              />
            </ClassicFormRow>
          </div>
        </div>

        <div className="preferencias-geral-photo-area">
          <div className="preferencias-avatar-frame">
            <Avatar size={80} icon={<UserOutlined />} className="preferencias-avatar" />
          </div>
          <div className="preferencias-photo-strip">
            <Button icon={<CameraOutlined />} size="small" type="text">
              Câmera
            </Button>
            <Button icon={<UploadOutlined />} size="small" type="text">
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClinicalTab() {
  return (
    <div className="preferencias-tab-content preferencias-classic-window">
      <div className="preferencias-clinical-topline">
        <ClassicFormRow label="Especialidade(s):" className="preferencias-inline-row">
          <div className="preferencias-specialty-line">
            <Select
              allowClear
              defaultValue="Especialidade odontológica"
              options={[
                { label: 'Especialidade odontológica', value: 'Especialidade odontológica' },
                ...especialidadesOptions.map((item) => ({ label: item, value: item })),
              ]}
            />
            <Button type="link" className="preferencias-inline-link">
              Incluir
            </Button>
          </div>
        </ClassicFormRow>
        <div className="preferencias-listbox-wrap">
          <div className="preferencias-listbox">
            {especialidadesOptions.map((specialty) => (
              <div key={specialty} className="preferencias-listbox-item">
                {specialty}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="preferencias-clinical-checks">
        <div className="preferencias-form-row preferencias-checks-row">
          <div className="preferencias-form-label">Ficha clínica:</div>
          <div className="preferencias-form-field preferencias-checkbox-stack">
            <Checkbox defaultChecked>Abrir automaticamente painel de aceleradores</Checkbox>
            <Checkbox>Solicitar assinatura eletrônica na finalização de procedimentos</Checkbox>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetTab() {
  return (
    <div className="preferencias-tab-content preferencias-classic-window">
      <div className="preferencias-general-form preferencias-budget-form">
        <ClassicFormRow label="Modelo padrão de orçamentos:">
          <Select
            className="preferencias-select-wide"
            defaultValue="Orçamento com odontograma"
            options={[{ label: 'Orçamento com odontograma', value: 'Orçamento com odontograma' }]}
          />
        </ClassicFormRow>
        <ClassicFormRow label="Mensagem para impressão:">
          <Input.TextArea rows={2} defaultValue="Mensagem padrão para orçamento impresso" />
        </ClassicFormRow>
        <div className="preferencias-form-row preferencias-checks-row">
          <div className="preferencias-form-label">Assinatura de orçamento:</div>
          <div className="preferencias-form-field preferencias-checkbox-stack">
            <Checkbox defaultChecked>Apresentar CPF/CNPJ</Checkbox>
            <Checkbox defaultChecked>Apresentar CRO/UF</Checkbox>
          </div>
        </div>
      </div>
    </div>
  );
}

function NfseTab() {
  return (
    <div className="preferencias-tab-content preferencias-classic-window preferencias-nfse-form">
      <ClassicFormRow label="Código de cancelamento:">
        <Input placeholder="Código de cancelamento de NFS-e de sua prefeitura" />
      </ClassicFormRow>
      <ClassicFormRow label="Motivo de cancelamento:">
        <Input placeholder="Informe o motivo para cancelamento da NFS-e" />
      </ClassicFormRow>
      <ClassicFormRow label="Valor alíquota ISS:">
        <Input type="number" suffix="%" />
      </ClassicFormRow>
      <ClassicFormRow label="Valor de dedução:">
        <Input type="number" suffix="%" />
      </ClassicFormRow>
      <ClassicFormRow label="Percentual sobre o valor bruto:">
        <Input type="number" suffix="%" />
      </ClassicFormRow>
    </div>
  );
}

export function PreferenciasUsuarioModal({ open, userName, onClose }) {
  const [messageApi, contextHolder] = message.useMessage();
  const titleName = userName || 'Tel';
  const tabItems = [
    { key: 'geral', label: <PreferenciasTabLabel>Geral</PreferenciasTabLabel>, children: <GeneralTab /> },
    { key: 'clinica', label: <PreferenciasTabLabel>Ficha clínica</PreferenciasTabLabel>, children: <ClinicalTab /> },
    { key: 'orcamento', label: <PreferenciasTabLabel>Orçamento</PreferenciasTabLabel>, children: <BudgetTab /> },
    { key: 'nfse', label: <PreferenciasTabLabel>NFS-e</PreferenciasTabLabel>, children: <NfseTab /> },
  ];

  const handleSave = () => {
    messageApi.info('Persistência de preferências ainda não implementada.');
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={952}
        styles={{ body: { padding: 0 } }}
        centered
        destroyOnClose
        maskClosable={false}
        title={<span className="preferencias-classic-title">Configurações e preferências de {titleName}</span>}
        className="preferencias-modal"
      >
        <div className="preferencias-classic-window">
          <Tabs defaultActiveKey="geral" type="card" className="preferencias-classic-tabs" items={tabItems} />

          <div className="preferencias-footer-shell">
            <div className="preferencias-footer">
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="primary" onClick={handleSave}>
                Gravar preferências
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
