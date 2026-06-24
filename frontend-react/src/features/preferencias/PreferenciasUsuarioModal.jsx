import { Avatar, Button, Checkbox, Col, Form, Input, Modal, Row, Select, Tabs, Typography, message } from 'antd';
import {
  CameraOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
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

const emptyNfsMessage = 'Conteúdo da aba NFS-e pendente de mapeamento complementar.';

function PreferenciasTabLabel({ children }) {
  return <span className="preferencias-tab-label">{children}</span>;
}

function GeneralTab() {
  return (
    <div className="preferencias-tab-content">
      <Row gutter={[12, 8]} className="preferencias-general-grid">
        <Col xs={24} md={6} lg={5}>
          <div className="preferencias-avatar-card">
            <Avatar size={72} icon={<UserOutlined />} className="preferencias-avatar" />
            <div className="preferencias-avatar-actions">
              <Button icon={<CameraOutlined />} size="small" type="text">Câmera</Button>
              <Button icon={<UploadOutlined />} size="small" type="text">Upload</Button>
            </div>
          </div>
        </Col>

        <Col xs={24} md={18} lg={19}>
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Form.Item label="Nome">
                <Input placeholder="Nome do usuário" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="CPF">
                <Input placeholder="000.000.000-00" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="CRO">
                <Input placeholder="CRO" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="UF">
                <Input placeholder="UF" maxLength={2} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Apresentação/CV resumido">
                <Input.TextArea rows={2} placeholder="Resumo profissional" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Envio padrão para mensagens">
                <Input placeholder="Mensagem padrão" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Conta bancária padrão">
                <Input placeholder="Conta padrão" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Estoque padrão">
                <Input placeholder="Estoque padrão" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Módulo de abertura">
                <Select
                  placeholder="Selecione"
                  options={moduloAberturaOptions.map((item) => ({ label: item, value: item }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

function ClinicalTab() {
  return (
    <div className="preferencias-tab-content">
      <Row gutter={[12, 8]}>
        <Col xs={24} md={8}>
          <Form.Item label="Especialidade(s)">
            <Select
              mode="multiple"
              placeholder="Selecione especialidades"
              options={especialidadesOptions.map((item) => ({ label: item, value: item }))}
            />
          </Form.Item>
          <Button type="default" className="preferencias-inline-action">Incluir</Button>
        </Col>
        <Col xs={24} md={16}>
          <Form.Item label="Especialidades incluídas">
            <Input.TextArea
              rows={8}
              placeholder="Lista visual de especialidades incluídas"
              value={especialidadesOptions.join('\n')}
              readOnly
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="preferencias-clinical-checks">
        <Checkbox>Abrir automaticamente painel de aceleradores</Checkbox>
        <Checkbox>Solicitar assinatura eletrônica na finalização de procedimentos</Checkbox>
      </div>
    </div>
  );
}

function BudgetTab() {
  return (
    <div className="preferencias-tab-content">
      <Row gutter={[12, 8]}>
        <Col xs={24} md={12}>
          <Form.Item label="Modelo padrão de orçamentos">
            <Input placeholder="Modelo padrão" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Mensagem para impressão">
            <Input.TextArea rows={3} placeholder="Mensagem do orçamento" />
          </Form.Item>
        </Col>
      </Row>
      <div className="preferencias-budget-checks">
        <Checkbox>Apresentar CPF/CNPJ</Checkbox>
        <Checkbox>Apresentar CRO/UF</Checkbox>
      </div>
    </div>
  );
}

function NfseTab() {
  return (
    <div className="preferencias-tab-content preferencias-nfse-pending">
      <Typography.Text type="secondary">{emptyNfsMessage}</Typography.Text>
    </div>
  );
}

export function PreferenciasUsuarioModal({ open, userName, onClose }) {
  const [messageApi, contextHolder] = message.useMessage();

  const titleName = userName || 'Tel';

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
        width={980}
        centered
        destroyOnClose
        maskClosable={false}
        title={`Configurações e preferências de ${titleName}`}
        className="preferencias-modal"
      >
        <Form layout="vertical" className="preferencias-form">
          <Tabs
            defaultActiveKey="geral"
            type="card"
            items={[
              { key: 'geral', label: <PreferenciasTabLabel>Geral</PreferenciasTabLabel>, children: <GeneralTab /> },
              { key: 'clinica', label: <PreferenciasTabLabel>Ficha clínica</PreferenciasTabLabel>, children: <ClinicalTab /> },
              { key: 'orcamento', label: <PreferenciasTabLabel>Orçamento</PreferenciasTabLabel>, children: <BudgetTab /> },
              { key: 'nfse', label: <PreferenciasTabLabel>NFS-e</PreferenciasTabLabel>, children: <NfseTab /> },
            ]}
          />

          <div className="preferencias-footer">
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="primary" onClick={handleSave}>
              Gravar preferências
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
