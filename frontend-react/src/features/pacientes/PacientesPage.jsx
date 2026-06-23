import { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Empty, Input, Row, Space, Spin, Table, Tag, Typography } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { listarPacientes, obterPaciente } from './pacientesApi.js';
import './pacientes.css';

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

function buildDetailItems(paciente) {
  if (!paciente) return [];
  const items = [
    ['Código', paciente.codigo ?? paciente.id ?? '-'],
    ['Nome completo', formatNomeCompleto(paciente) || '-'],
    ['CPF', paciente.cpf || 'Não informado'],
    ['Telefone', formatTelefone(paciente) || 'Não informado'],
    ['Cidade', paciente.cidade || 'Não informada'],
    ['Status', formatStatus(paciente)],
  ];

  if (paciente.id_convenio !== undefined && paciente.id_convenio !== null && paciente.id_convenio !== '') {
    items.push(['Convênio', `ID ${paciente.id_convenio}`]);
  }

  if (paciente.id_plano !== undefined && paciente.id_plano !== null && paciente.id_plano !== '') {
    items.push(['Plano', `ID ${paciente.id_plano}`]);
  }

  if (paciente.cod_prontuario) {
    items.push(['Cod. prontuário', paciente.cod_prontuario]);
  }

  return items;
}

export function PacientesPage({ onBackHome }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const selectedRowKeys = useMemo(() => (selectedId ? [selectedId] : []), [selectedId]);

  const loadPatients = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await listarPacientes(search);
      setItems(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length) {
        const nextSelected = data.find((item) => Number(item.id) === Number(selectedId)) || data[0];
        if (nextSelected) {
          setSelectedId(Number(nextSelected.id));
          setSelectedPatient(nextSelected);
        }
      } else {
        setSelectedId(null);
        setSelectedPatient(null);
      }
    } catch (err) {
      setItems([]);
      setSelectedId(null);
      setSelectedPatient(null);
      setError(err?.message || 'Falha ao carregar pacientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPatients('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (value) => {
    const next = String(value || '').trim();
    setQuery(next);
    await loadPatients(next);
  };

  const handleSelect = async (record) => {
    const id = Number(record?.id || 0) || 0;
    if (!id) return;
    setSelectedId(id);
    setSelectedPatient(record);
    setDetailLoading(true);
    try {
      const detail = await obterPaciente(id);
      setSelectedPatient(detail || record);
    } catch {
      setSelectedPatient(record);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
      width: 90,
      render: (value) => <Typography.Text strong>{value ?? '-'}</Typography.Text>,
    },
    {
      title: 'Nome completo',
      key: 'nome_completo',
      render: (_, record) => formatNomeCompleto(record) || 'Sem nome',
    },
    {
      title: 'Telefone',
      key: 'fone1',
      width: 160,
      render: (_, record) => formatTelefone(record) || '-',
    },
    {
      title: 'Cidade',
      dataIndex: 'cidade',
      width: 170,
      render: (value) => value || '-',
    },
    {
      title: 'Status',
      key: 'status',
      width: 130,
      render: (_, record) => <Tag color={getStatusColor(record)}>{formatStatus(record)}</Tag>,
    },
  ];

  return (
    <Space direction="vertical" size={16} className="pacientes-page">
      <div className="pacientes-header">
        <div>
          <Typography.Title level={2} className="pacientes-title">
            Pacientes
          </Typography.Title>
          <Typography.Text type="secondary" className="pacientes-subtitle">
            Consulta de pacientes cadastrados
          </Typography.Text>
        </div>
        <Tag color="green" className="pacientes-readonly-badge">
          Somente leitura
        </Tag>
      </div>

      <Card className="pacientes-toolbar-card" bordered={false}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            Navegação segura: consulta e resumo, sem cadastro, edição ou exclusão.
          </Typography.Text>
          <Input
            allowClear
            value={query}
            prefix={<SearchOutlined />}
            placeholder="Buscar por código, nome, CPF, telefone ou cidade"
            onChange={(event) => setQuery(event.target.value)}
            onPressEnter={(event) => handleSearch(event.target.value)}
            className="pacientes-search"
          />
        </Space>
      </Card>

      {error ? (
        <Alert
          type="error"
          showIcon
          message="Não foi possível carregar a lista de pacientes."
          description={error}
          className="pacientes-alert"
        />
      ) : null}

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={15}>
          <Card className="pacientes-list-card" title="Lista de pacientes" bordered={false}>
            {loading ? (
              <div className="pacientes-state">
                <Spin />
                <Typography.Text type="secondary">Carregando pacientes...</Typography.Text>
              </div>
            ) : items.length ? (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={items}
                pagination={false}
                size="middle"
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys,
                  onSelect: handleSelect,
                  columnWidth: 42,
                }}
                onRow={(record) => ({
                  onClick: () => handleSelect(record),
                })}
                className="pacientes-table"
              />
            ) : (
              <div className="pacientes-state">
                <Empty description="Nenhum paciente encontrado." />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} xl={9}>
          <Card className="pacientes-detail-card" title="Resumo somente leitura" bordered={false}>
            {detailLoading ? (
              <div className="pacientes-state">
                <Spin />
                <Typography.Text type="secondary">Carregando resumo...</Typography.Text>
              </div>
            ) : selectedPatient ? (
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <div className="pacientes-selected-head">
                  <Typography.Title level={4} className="pacientes-selected-name">
                    {formatNomeCompleto(selectedPatient) || 'Paciente sem nome'}
                  </Typography.Title>
                  <Tag color={selectedPatient.inativo ? 'default' : 'green'}>
                    {formatStatus(selectedPatient)}
                  </Tag>
                </div>

                <div className="pacientes-detail-grid">
                  {buildDetailItems(selectedPatient).map(([label, value]) => (
                    <div key={label} className="pacientes-detail-item">
                      <Typography.Text type="secondary" className="pacientes-detail-label">
                        {label}
                      </Typography.Text>
                      <Typography.Text strong className="pacientes-detail-value">
                        {String(value || '-')}
                      </Typography.Text>
                    </div>
                  ))}
                </div>

                <div className="pacientes-readonly-note">
                  <EyeOutlined />
                  <span>Visualização somente leitura. Nenhuma alteração é permitida nesta etapa.</span>
                </div>
              </Space>
            ) : (
              <Empty description="Selecione um paciente para visualizar o resumo." />
            )}
          </Card>
        </Col>
      </Row>

      <div className="pacientes-footer-actions">
        <button type="button" className="pacientes-back-link" onClick={onBackHome}>
          Voltar para Início
        </button>
      </div>
    </Space>
  );
}
