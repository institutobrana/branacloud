import { useMemo, useState } from 'react';
import { Button, Card, Empty, Space, Table, Tabs, Tag, Typography, message } from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  FilterOutlined,
  LockOutlined,
  MoreOutlined,
  PrinterOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  TeamOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './fichaClinica.css';

const SELECTED_PATIENT_KEY = 'brana.fichaClinica.pacienteEmUso';

function formatNomeCompleto(item) {
  const nomeCompleto = String(item?.nome_completo || '').trim();
  if (nomeCompleto) return nomeCompleto;
  return [item?.nome || '', item?.sobrenome || ''].filter(Boolean).join(' ').trim();
}

function formatTelefone(item) {
  return String(item?.fone1 || '').trim();
}

function formatStatus(item) {
  if (item?.inativo) return 'Inativo';
  return String(item?.status || '').trim() || 'Ativo';
}

function getStatusColor(item) {
  if (item?.inativo) return 'default';
  const status = String(item?.status || '').toLowerCase();
  if (status.includes('inativo')) return 'default';
  if (status.includes('bloq')) return 'volcano';
  return 'green';
}

function readStoredPatient() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(SELECTED_PATIENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function storeSelectedPatient(paciente) {
  if (typeof window === 'undefined') return;
  try {
    if (!paciente) {
      window.sessionStorage.removeItem(SELECTED_PATIENT_KEY);
      return;
    }
    window.sessionStorage.setItem(SELECTED_PATIENT_KEY, JSON.stringify(paciente));
  } catch {
    // estado visual continua funcionando mesmo sem persistencia
  }
}

function buildPatientSummary(paciente) {
  if (!paciente) return [];

  const items = [
    ['Codigo', paciente.codigo ?? paciente.id ?? '-'],
    ['Nome completo', formatNomeCompleto(paciente) || '-'],
    ['Telefone', formatTelefone(paciente) || 'Nao informado'],
    ['Status', formatStatus(paciente)],
  ];

  if (paciente.cpf) {
    items.push(['CPF', paciente.cpf]);
  }

  if (paciente.cidade) {
    items.push(['Cidade', paciente.cidade]);
  }

  if (paciente.cod_prontuario) {
    items.push(['Prontuario', paciente.cod_prontuario]);
  }

  return items;
}

function buildCalendarDays(referenceDate = new Date()) {
  const current = new Date(referenceDate);
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(day);
  }

  return cells;
}

const clinicCategories = [
  { key: 'cirur', label: 'Cirur' },
  { key: 'dent', label: 'Dent' },
  { key: 'diag', label: 'Diag' },
  { key: 'emer', label: 'Emer' },
  { key: 'endo', label: 'Endo' },
  { key: 'espec', label: 'Espec' },
  { key: 'estet', label: 'Estét' },
  { key: 'estom', label: 'Estom' },
  { key: 'geral', label: 'Geral' },
  { key: 'hof', label: 'HOF' },
];

function PlaceholderBlock({ title, description }) {
  return (
    <div className="ficha-clinica-placeholder">
      <FileTextOutlined className="ficha-clinica-placeholder-icon" />
      <Typography.Title level={4} className="ficha-clinica-placeholder-title">
        {title}
      </Typography.Title>
      <Typography.Text type="secondary" className="ficha-clinica-placeholder-copy">
        {description}
      </Typography.Text>
    </div>
  );
}

function ToothGrid() {
  const upperTeeth = useMemo(() => Array.from({ length: 16 }, (_, index) => index + 1), []);
  const lowerTeeth = useMemo(() => Array.from({ length: 16 }, (_, index) => index + 17), []);

  return (
    <div className="ficha-clinica-tooth-grid">
      <div className="ficha-clinica-tooth-row">
        {upperTeeth.map((tooth) => (
          <div key={`up-${tooth}`} className={`ficha-clinica-tooth is-upper is-${((tooth - 1) % 4) + 1}`}>
            <span className="ficha-clinica-tooth-shape ficha-clinica-tooth-shape-top" />
            <span className="ficha-clinica-tooth-label">{tooth}</span>
          </div>
        ))}
      </div>

      <div className="ficha-clinica-tooth-glyph-row">
        {upperTeeth.map((tooth) => (
          <span key={`mid-up-${tooth}`} className="ficha-clinica-tooth-glyph" aria-hidden="true" />
        ))}
      </div>

      <div className="ficha-clinica-tooth-glyph-row">
        {lowerTeeth.map((tooth) => (
          <span key={`mid-low-${tooth}`} className="ficha-clinica-tooth-glyph" aria-hidden="true" />
        ))}
      </div>

      <div className="ficha-clinica-tooth-row ficha-clinica-tooth-row-bottom">
        {lowerTeeth.map((tooth) => (
          <div key={`low-${tooth}`} className={`ficha-clinica-tooth is-lower is-${((tooth - 17) % 4) + 1}`}>
            <span className="ficha-clinica-tooth-shape ficha-clinica-tooth-shape-bottom" />
            <span className="ficha-clinica-tooth-label">{tooth}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FichaClinicaPage({ onBackHome }) {
  const [selectedPatient, setSelectedPatient] = useState(() => readStoredPatient());
  const [activeTab, setActiveTab] = useState('tratamento');

  const patientLabel = useMemo(() => {
    if (!selectedPatient) return 'Nenhum paciente em uso';
    return formatNomeCompleto(selectedPatient) || `Paciente ${selectedPatient.id ?? ''}`.trim();
  }, [selectedPatient]);

  const calendarDays = useMemo(() => buildCalendarDays(new Date()), []);
  const currentDay = new Date().getDate();

  const handleClearPatient = () => {
    setSelectedPatient(null);
    storeSelectedPatient(null);
    message.info('Paciente em uso limpo.');
  };

  const handlePlaceholderAction = (label) => {
    if (!selectedPatient) {
      message.info('Selecione um paciente para abrir este fluxo.');
      return;
    }
    message.info(`${label}: fluxo em implantacao no Brana Cloude.`);
  };

  const treatmentColumns = [
    {
      title: 'Procedimento',
      dataIndex: 'procedimento',
      key: 'procedimento',
      render: () => <Typography.Text type="secondary">Nenhum tratamento selecionado no odontograma.</Typography.Text>,
    },
    {
      title: 'Região',
      dataIndex: 'regiao',
      key: 'regiao',
      width: 110,
      render: () => '-',
    },
    {
      title: 'Rep',
      dataIndex: 'rep',
      key: 'rep',
      width: 100,
      render: () => '-',
    },
    {
      title: 'Pac',
      dataIndex: 'pac',
      key: 'pac',
      width: 90,
      render: () => '-',
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 120,
      render: () => (
        <Button type="link" size="small" onClick={() => handlePlaceholderAction('Abrir tratamento')}>
          Abrir
        </Button>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'tratamento',
      label: 'Tratamento',
      children: (
        <div className="ficha-clinica-treatment-tab">
          <div className="ficha-clinica-treatment-toolbar">
            <Button type="text" icon={<PlusOutlined />} onClick={() => handlePlaceholderAction('Novo procedimento')} />
            <Button type="text" icon={<DollarOutlined />} onClick={() => handlePlaceholderAction('Financeiro')} />
            <Button type="text" icon={<UserOutlined />} onClick={() => handlePlaceholderAction('Vincular prestador')} />
            <Button type="text" icon={<StopOutlined />} onClick={() => handlePlaceholderAction('Interromper')} />
            <Button type="text" icon={<LockOutlined />} onClick={() => handlePlaceholderAction('Bloquear')} />
            <Button type="text" icon={<DeleteOutlined />} onClick={() => handlePlaceholderAction('Excluir')} />
            <Button type="text" icon={<MoreOutlined />} onClick={() => handlePlaceholderAction('Mais ações')} />
          </div>

          <Card bordered={false} className="ficha-clinica-treatment-card">
            <Table
              rowKey="id"
              columns={treatmentColumns}
              dataSource={[]}
              pagination={false}
              size="middle"
              locale={{
                emptyText: (
                  <Empty
                    description={
                      selectedPatient
                        ? 'Nenhum procedimento vinculado. Fluxo visual em implantação.'
                        : 'Selecione um paciente para iniciar a ficha clínica.'
                    }
                  />
                ),
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'financeiro',
      label: 'Financeiro',
      children: (
        <PlaceholderBlock
          title="Financeiro da ficha"
          description="Painel reservado para títulos, repasses e cobrança vinculada ao paciente em uso."
        />
      ),
    },
    {
      key: 'timeline',
      label: 'Timeline',
      children: (
        <PlaceholderBlock
          title="Timeline do paciente"
          description="Histórico visual do atendimento, eventos clínicos e evolução da ficha."
        />
      ),
    },
    {
      key: 'documentos',
      label: 'Documentos',
      children: (
        <PlaceholderBlock
          title="Documentos da ficha"
          description="Área preparada para prontuários, anexos e emitidos sem expor dados sensíveis nesta etapa."
        />
      ),
    },
    {
      key: 'anotacoes',
      label: 'Anotações',
      children: (
        <PlaceholderBlock
          title="Anotações clínicas"
          description="Espaço inicial para observações, orientações e evolução do atendimento."
        />
      ),
    },
  ];

  return (
    <div className="ficha-clinica-page">
      <div className="ficha-clinica-stage">
        <section className="ficha-clinica-board ficha-clinica-odontogram-board">
          <div className="ficha-clinica-board-toolbar">
            <Button type="text" icon={<PlusOutlined />} />
            <Button type="text" icon={<SearchOutlined />} />
            <Button type="text" icon={<FilterOutlined />} />
            <span className="ficha-clinica-board-divider" />
            <Button type="text" icon={<FileTextOutlined />} />
            <Button type="text" icon={<DollarOutlined />} />
            <Button type="text" icon={<PrinterOutlined />} />
          </div>

          <div className="ficha-clinica-odontogram-frame">
            <ToothGrid />
          </div>

          <div className="ficha-clinica-clinic-categories" aria-label="Categorias clinicas">
            <Button type="text" className="ficha-clinica-clinic-arrow" aria-label="Categorias anteriores">
              ‹
            </Button>
            {clinicCategories.map((category, index) => (
              <button
                key={category.key}
                type="button"
                className={`ficha-clinica-clinic-category${index === 0 ? ' is-active' : ''}`}
              >
                <span className="ficha-clinica-clinic-category-icon" aria-hidden="true" />
                <span className="ficha-clinica-clinic-category-label">{category.label}</span>
              </button>
            ))}
            <Button type="text" className="ficha-clinica-clinic-arrow" aria-label="Categorias seguintes">
              ›
            </Button>
          </div>

          <div className="ficha-clinica-odontogram-footer">
            <Tabs
              activeKey="boca"
              items={[
                {
                  key: 'boca',
                  label: 'Boca',
                  children: (
                    <div className="ficha-clinica-boca-empty">
                      <Typography.Text className="ficha-clinica-boca-empty-copy">
                        Nenhum tratamento selecionado no odontograma.
                        <br />
                        Selecione o tratamento desejado para visualizar os detalhes.
                      </Typography.Text>
                    </div>
                  ),
                },
                { key: 'dente', label: 'Dente', children: <div className="ficha-clinica-boca-empty" /> },
              ]}
            />
          </div>
        </section>

        <section className="ficha-clinica-board ficha-clinica-treatment-board">
          <Card bordered={false} className="ficha-clinica-treatment-shell">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              className="ficha-clinica-tabs"
              destroyInactiveTabPane={false}
            />
          </Card>
        </section>

        <aside className="ficha-clinica-patient-rail">
          <div className="ficha-clinica-patient-header">
            <div className="ficha-clinica-patient-header-top">
              <Button type="text" icon={<span className="ficha-clinica-patient-arrow">↙</span>} />
              <Typography.Text className="ficha-clinica-patient-name">{patientLabel}</Typography.Text>
              <Button type="text" icon={<span className="ficha-clinica-patient-arrow">›</span>} />
            </div>
          </div>

          <div className="ficha-clinica-calendar">
            <div className="ficha-clinica-calendar-header">
              <Button type="text" icon={<span className="ficha-clinica-calendar-nav">◀</span>} />
              <Typography.Text className="ficha-clinica-calendar-title">Junho 2026</Typography.Text>
              <Button type="text" icon={<span className="ficha-clinica-calendar-nav">▶</span>} />
            </div>

            <div className="ficha-clinica-calendar-days-head">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="ficha-clinica-calendar-grid">
              {calendarDays.map((day, index) => (
                <div
                  key={day === null ? `empty-${index}` : `day-${day}`}
                  className={`ficha-clinica-calendar-cell${day === currentDay ? ' is-today' : ''}${day === null ? ' is-empty' : ''}`}
                >
                  {day || ''}
                </div>
              ))}
            </div>
          </div>

          <div className="ficha-clinica-patient-meta">
            <Tag color={selectedPatient ? 'green' : 'gold'} className="ficha-clinica-patient-status">
              {selectedPatient ? 'Paciente em uso' : 'Sem paciente em uso'}
            </Tag>
            <Typography.Title level={4} className="ficha-clinica-patient-title">
              {patientLabel}
            </Typography.Title>
            <Typography.Text className="ficha-clinica-patient-subtitle">
              {selectedPatient
                ? `${formatStatus(selectedPatient)} | ${formatTelefone(selectedPatient) || 'Sem telefone'}`
                : 'Use a busca superior para localizar um paciente.'}
            </Typography.Text>
          </div>

          <div className="ficha-clinica-patient-actions">
            <Button icon={<SearchOutlined />} onClick={() => handlePlaceholderAction('Buscar paciente')}>
              Buscar paciente
            </Button>
            <Button icon={<TeamOutlined />} onClick={handleClearPatient} disabled={!selectedPatient}>
              Limpar
            </Button>
            <Button type="primary" icon={<FileTextOutlined />} onClick={() => handlePlaceholderAction('Abrir ficha clínica')}>
              Fluxo em implantação
            </Button>
          </div>

          <div className="ficha-clinica-patient-footer">
            <Typography.Text strong>26/06/2026 Sexta-feira</Typography.Text>
            <Space size={12}>
              <Button type="text" icon={<SearchOutlined />} />
              <Button type="text" icon={<PlusOutlined />} />
            </Space>
          </div>

          <div className="ficha-clinica-patient-back">
            <Button block onClick={onBackHome}>
              Voltar para Início
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
