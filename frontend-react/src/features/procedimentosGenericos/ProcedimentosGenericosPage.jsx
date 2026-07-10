import { useEffect, useMemo, useState } from 'react';
import { Input, Select, Space, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaTable } from '../../components/BranaTable.jsx';
import { listarProcedimentosGenericos } from './procedimentosGenericosApi.js';

function statusDot(inativo) {
  return <span className={`auxiliary-table-status-dot${inativo ? ' is-inactive' : ' is-active'}`} aria-hidden="true" />;
}

export function ProcedimentosGenericosPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [q, setQ] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [error, setError] = useState('');

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);
  const especialidades = useMemo(() => {
    const seen = new Set();
    return items
      .map((item) => item.especialidade)
      .filter(Boolean)
      .filter((item) => {
        if (seen.has(item)) return false;
        seen.add(item);
        return true;
      })
      .sort((left, right) => left.localeCompare(right, 'pt-BR', { sensitivity: 'base' }));
  }, [items]);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarProcedimentosGenericos({ q, especialidade });
      setItems(data);
      setSelectedId((current) => (data.some((item) => item.id === current) ? current : data[0]?.id ?? null));
    } catch (err) {
      setItems([]);
      setSelectedId(null);
      setError(err?.message || 'Falha ao carregar procedimentos genéricos.');
      message.error(err?.message || 'Falha ao carregar procedimentos genéricos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, [q, especialidade]);

  const columns = [
    {
      key: 'codigo',
      title: 'Código',
      dataIndex: 'codigo',
      width: 110,
      render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
    },
    {
      key: 'descricao',
      title: 'Procedimento genérico',
      dataIndex: 'descricao',
      render: (value) => value || '-',
    },
    {
      key: 'especialidade',
      title: 'Especialidade',
      dataIndex: 'especialidade',
      width: 200,
      render: (value) => value || '-',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'inativo',
      width: 72,
      align: 'center',
      render: (_, record) => statusDot(record.inativo),
    },
  ];

  return (
    <Space direction="vertical" size={10} style={{ width: '100%', marginTop: 8 }}>
      <div className="auxiliary-shell-frame">
        <div className="auxiliary-layout">
          <Space direction="vertical" size={12} style={{ width: '100%', minWidth: 0, paddingTop: 2 }}>
            {error ? <Typography.Text type="danger">{error}</Typography.Text> : null}

            <BranaCard className="auxiliary-main-card">
              <div className="module-table-shell">
                <div className="brana-shell-band auxiliary-shell-band" aria-label="Barra operacional de procedimentos genéricos">
                  <div className="auxiliary-action-toolbar" role="toolbar" aria-label="Ações do módulo procedimentos genéricos">
                    <button type="button" className="auxiliary-shell-button primary" onClick={() => message.info('Novo procedimento ainda será definido nesta etapa.')}>
                      Novo procedimento
                    </button>
                    <button type="button" className="auxiliary-shell-button" onClick={() => (selectedItem ? message.info(`Alteração pendente para ${selectedItem.descricao}.`) : message.warning('Selecione um procedimento genérico.'))}>
                      Altera...
                    </button>
                    <button type="button" className="auxiliary-shell-button danger" onClick={() => (selectedItem ? message.info(`Exclusão pendente para ${selectedItem.descricao}.`) : message.warning('Selecione um procedimento genérico.'))}>
                      Elimina...
                    </button>
                    <button type="button" className="auxiliary-shell-button" onClick={() => message.info('Abertura de fases ficará na próxima etapa.')}>
                      Fases
                    </button>
                    <button type="button" className="auxiliary-shell-button" onClick={() => message.info('Abertura de materiais ficará na próxima etapa.')}>
                      Materiais
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 8, border: '1px solid #cfd8e3', borderTop: 'none', padding: '5px 6px', background: '#fff' }} aria-label="Filtros de procedimentos genéricos">
                  <label style={{ display: 'grid', gap: 2 }}>
                    <span>Especialidades</span>
                    <Select
                      value={especialidade || undefined}
                      placeholder="<<Todas>>"
                      options={especialidades.map((item) => ({ label: item, value: item }))}
                      onChange={(value) => setEspecialidade(value || '')}
                      allowClear
                    />
                  </label>
                  <label style={{ display: 'grid', gap: 2 }}>
                    <span>Procedimentos</span>
                    <Input
                      value={q}
                      onChange={(event) => setQ(event.target.value)}
                      placeholder="Buscar por código ou descrição"
                      prefix={<SearchOutlined />}
                      allowClear
                    />
                  </label>
                </div>

                <div className="users-grid-shell" role="grid" aria-label="Listagem de procedimentos genéricos">
                  <BranaTable
                    rowKey="id"
                    className="module-table auxiliary-compact-table"
                    loading={loading}
                    pagination={false}
                    size="small"
                    tableLayout="fixed"
                    dataSource={items}
                    columns={columns}
                    rowSelection={{
                      type: 'radio',
                      selectedRowKeys: selectedItem ? [selectedItem.id] : [],
                      onChange: (keys) => setSelectedId(keys[0] ?? null),
                    }}
                    onRow={(record) => ({
                      className: selectedItem?.id === record.id ? 'users-table-row-selected' : '',
                      onClick: () => setSelectedId(record.id),
                    })}
                    locale={{ emptyText: 'Nenhum procedimento genérico cadastrado.' }}
                  />
                </div>
              </div>
            </BranaCard>
          </Space>
        </div>
      </div>
    </Space>
  );
}
