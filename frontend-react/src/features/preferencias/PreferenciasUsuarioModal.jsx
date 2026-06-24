import { Avatar, Button, Checkbox, Input, Modal, Select, Tabs, Typography, message } from 'antd';
import { CameraOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import './preferenciasUsuario.css';

const moduloAberturaOptions = [
  'Agenda diÃ¡ria',
  'Agenda por unidade',
  'Agenda semanal',
  'Cadastro de pacientes',
  'Contas a pagar',
  'Contas a receber',
  'Controle de estoque',
  'Dashboard',
  'Ficha clÃ­nica',
  'Fluxo de caixa',
  'Gerenciar tratamentos',
];

const especialidadesOptions = [
  'Cirurgia',
  'DentÃ­stica',
  'DiagnÃ³stico',
  'EmergÃªncia',
  'Endodontia',
  'Estomatologia',
  'EstÃ©tica',
  'Gerais',
  'HarmonizaÃ§Ã£o Orofacial',
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
    <div className="preferencias-tab-content preferencias-classic-window">
      <div className="preferencias-general-head">
        <div className="preferencias-general-identity">
          <div className="preferencias-identity-line"><strong>Nome:</strong> Gleisson Tel</div>
          <div className="preferencias-identity-line"><strong>CPF:</strong> 280.106.918-36</div>
          <div className="preferencias-identity-line"><strong>CRO/UF:</strong> 81611-SP</div>
        </div>

        <div className="preferencias-photo-right">
          <div className="preferencias-avatar-frame">
            <Avatar size={80} icon={<UserOutlined />} className="preferencias-avatar" />
          </div>
          <div className="preferencias-photo-strip">
            <Button icon={<CameraOutlined />} size="small" type="text">
              CÃ¢mera
            </Button>
            <Button icon={<UploadOutlined />} size="small" type="text">
              Upload
            </Button>
          </div>
        </div>
      </div>

      <div className="preferencias-general-form">
        <ClassicFormRow label="ApresentaÃ§Ã£o:">
          <Input.TextArea rows={3} defaultValue="ApresentaÃ§Ã£o ou CV resumido do profissional" />
        </ClassicFormRow>
        <ClassicFormRow label="Envio padrÃ£o para mensagens:">
          <Select
            className="preferencias-select-wide"
            defaultValue="WhatsApp Web (apenas 1 envio)"
            options={[{ label: 'WhatsApp Web (apenas 1 envio)', value: 'WhatsApp Web (apenas 1 envio)' }]}
          />
        </ClassicFormRow>
        <ClassicFormRow label="Conta bancÃ¡ria padrÃ£o:">
          <Select
            className="preferencias-select-wide"
            defaultValue="Conta padrÃ£o"
            options={[{ label: 'Conta padrÃ£o', value: 'Conta padrÃ£o' }]}
          />
        </ClassicFormRow>
        <ClassicFormRow label="Estoque padrÃ£o:">
          <Select
            className="preferencias-select-wide"
            allowClear
            defaultValue="Estoque padrÃ£o"
            options={[{ label: 'Estoque padrÃ£o', value: 'Estoque padrÃ£o' }]}
          />
        </ClassicFormRow>
        <ClassicFormRow label="MÃ³dulo de abertura:">
          <Select
            className="preferencias-select-wide"
            allowClear
            defaultValue="Dashboard"
            options={moduloAberturaOptions.map((item) => ({ label: item, value: item }))}
          />
        </ClassicFormRow>
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
              defaultValue="Especialidade odontolÃ³gica"
              options={[
                { label: 'Especialidade odontolÃ³gica', value: 'Especialidade odontolÃ³gica' },
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
          <div className="preferencias-form-label">Ficha clÃ­nica:</div>
          <div className="preferencias-form-field preferencias-checkbox-stack">
            <Checkbox defaultChecked>Abrir automaticamente painel de aceleradores</Checkbox>
            <Checkbox>Solicitar assinatura eletrÃ´nica na finalizaÃ§Ã£o de procedimentos</Checkbox>
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
        <ClassicFormRow label="Modelo padrÃ£o de orÃ§amentos:">
          <Select
            className="preferencias-select-wide"
            defaultValue="OrÃ§amento com odontograma"
            options={[{ label: 'OrÃ§amento com odontograma', value: 'OrÃ§amento com odontograma' }]}
          />
        </ClassicFormRow>
        <ClassicFormRow label="Mensagem para impressÃ£o:">
          <Input.TextArea rows={2} defaultValue="Mensagem padrÃ£o para orÃ§amento impresso" />
        </ClassicFormRow>
        <div className="preferencias-form-row preferencias-checks-row">
          <div className="preferencias-form-label">Assinatura de orÃ§amento:</div>
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
      <ClassicFormRow label="CÃ³digo de cancelamento:">
        <Input placeholder="CÃ³digo de cancelamento de NFS-e de sua prefeitura" />
      </ClassicFormRow>
      <ClassicFormRow label="Motivo de cancelamento:">
        <Input placeholder="Informe o motivo para cancelamento da NFS-e" />
      </ClassicFormRow>
      <ClassicFormRow label="Valor alÃ­quota ISS:">
        <Input type="number" suffix="%" />
      </ClassicFormRow>
      <ClassicFormRow label="Valor de deduÃ§Ã£o:">
        <Input type="number" suffix="%" />
      </ClassicFormRow>
      <ClassicFormRow label="Percentual sobre o valor bruto:">
        <Input type="number" suffix="%" />
      </ClassicFormRow>
      <Typography.Text className="preferencias-nfse-help" type="secondary">
        Campos visuais do print de referÃªncia EasyDental.
      </Typography.Text>
    </div>
  );
}

export function PreferenciasUsuarioModal({ open, userName, onClose }) {
  const [messageApi, contextHolder] = message.useMessage();
  const titleName = userName || 'Tel';
  const tabItems = [
    { key: 'geral', label: <PreferenciasTabLabel>Geral</PreferenciasTabLabel>, children: <GeneralTab /> },
    { key: 'clinica', label: <PreferenciasTabLabel>Ficha clÃ­nica</PreferenciasTabLabel>, children: <ClinicalTab /> },
    { key: 'orcamento', label: <PreferenciasTabLabel>OrÃ§amento</PreferenciasTabLabel>, children: <BudgetTab /> },
    { key: 'nfse', label: <PreferenciasTabLabel>NFS-e</PreferenciasTabLabel>, children: <NfseTab /> },
  ];

  const handleSave = () => {
    messageApi.info('PersistÃªncia de preferÃªncias ainda nÃ£o implementada.');
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
        title={<span className="preferencias-classic-title">ConfiguraÃ§Ãµes e preferÃªncias de {titleName}</span>}
        className="preferencias-modal"
      >
        <div className="preferencias-classic-window">
          <Tabs defaultActiveKey="geral" type="card" className="preferencias-classic-tabs" items={tabItems} />

          <div className="preferencias-footer-shell">
            <div className="preferencias-footer">
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="primary" onClick={handleSave}>
                Gravar preferÃªncias
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
