import { useEffect, useMemo, useState } from 'react';
import { Space, Typography, message } from 'antd';

import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaTable } from '../../components/BranaTable.jsx';
import { listarProcedimentosGenericos } from './procedimentosGenericosApi.js';

function statusDot(inativo) {
  return <span className={`auxiliary-table-status-dot${inativo ? ' is-inactive' : ' is-active'}`} aria-hidden="true" />;
}

export function ProcedimentosGenericosPage({ q, especialidade }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('brana-procedimentos-genericos-especialidades', {
          detail: { especialidades },
        }),
      );
    }
  }, [especialidades]);

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
      <div className="auxiliary-shell-frame procedimentos-genericos-frame">
        {error ? <Typography.Text type="danger">{error}</Typography.Text> : null}

        <BranaCard className="auxiliary-main-card procedimentos-genericos-card">
          <div className="module-table-shell procedimentos-genericos-shell">
            <div className="users-grid-shell procedimentos-genericos-grid" role="grid" aria-label="Listagem de procedimentos genéricos">
              <BranaTable
                rowKey="id"
                className="module-table auxiliary-compact-table procedimentos-genericos-table"
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
      </div>
    </Space>
  );
}
