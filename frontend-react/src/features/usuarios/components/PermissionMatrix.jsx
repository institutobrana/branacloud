import { Button, Empty, Table } from 'antd';
import { CheckCircleOutlined, KeyOutlined, StopOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const labels = { habilitado: 'Habilitado', desabilitado: 'Desabilitado', protegido: 'Protegido' };

function State({ value }) {
  const level = labels[value] ? value : 'desabilitado';
  return <span className={`usuarios-permission-status-dot is-${level}`} role="img" aria-label={labels[level]} title={labels[level]} />;
}

function LevelToolbar({ functionMode = false, level, onLevelChange, saving = false }) {
  const action = (nextLevel) => onLevelChange?.(nextLevel);
  const buttonProps = (nextLevel) => ({
    type: level === nextLevel ? 'primary' : 'default',
    disabled: saving,
    'aria-pressed': level === nextLevel,
    onClick: () => action(nextLevel),
  });
  return <div className="usuarios-permission-level-toolbar" aria-label={functionMode ? 'Nível da função' : 'Nível do módulo'}>
    <Button {...buttonProps('habilitado')} icon={<CheckCircleOutlined />}>{functionMode ? 'Permite execução' : 'Permite acesso'}</Button>
    <Button {...buttonProps('desabilitado')} icon={<StopOutlined />}>{functionMode ? 'Proíbe execução' : 'Proíbe acesso'}</Button>
    <Button {...buttonProps('protegido')} icon={<KeyOutlined />}>Solicita senha</Button>
  </div>;
}

export function PermissionMatrix({ schema, permissions, onModuleLevelChange, onFunctionLevelChange, saving }) {
  const modules = Array.isArray(schema?.modules) ? schema.modules : [];
  const levels = permissions?.permissoes || {};
  const functions = schema?.function_schema_by_module || schema?.functions_by_module || {};
  const [selectedCode, setSelectedCode] = useState(modules[0]?.codigo || '');
  const [selectedFunction, setSelectedFunction] = useState(null);
  useEffect(() => { setSelectedCode(modules[0]?.codigo || ''); }, [schema]);
  if (!modules.length) return <Empty description="Nenhum módulo de permissão encontrado" />;
  const selected = modules.find((module) => String(module.codigo) === String(selectedCode)) || modules[0];
  const selectedFunctions = Array.isArray(functions[selected?.codigo]) ? functions[selected.codigo] : [];
  const moduleLevel = levels[selected?.codigo];
  const functionRows = selectedFunctions.map((item, index) => {
    const functionItem = typeof item === 'string' ? { codigo: `${selected?.codigo || 'module'}_${index}`, nome: item } : item;
    return { key: functionItem.codigo, codigo: functionItem.codigo, name: functionItem.nome || functionItem.codigo };
  });
  const functionLevels = permissions?.functions || {};
  const functionLevel = selectedFunction ? functionLevels[selected?.codigo]?.[selectedFunction] || moduleLevel : moduleLevel;
  const functionColumns = [
    { title: 'Função', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Status', key: 'status', width: 140, align: 'right', render: (_, row) => <State value={functionLevels[selected?.codigo]?.[row.codigo] || moduleLevel} /> },
  ];
  const moduleColumns = [
    { title: 'Módulo', dataIndex: 'nome', key: 'nome', ellipsis: true, render: (value, module) => value || module.codigo },
    { title: 'Status', key: 'status', width: 56, align: 'center', render: (_, module) => <State value={levels[module.codigo]} /> },
  ];
  return <div className="usuarios-permission-layout">
    <section className="usuarios-permission-section" aria-label="Módulos">
      <LevelToolbar level={moduleLevel} onLevelChange={(nextLevel) => onModuleLevelChange?.(selected?.codigo, nextLevel)} saving={saving} />
      <Table className="usuarios-permission-module-table" rowKey="codigo" size="small" pagination={false} tableLayout="fixed" scroll={{ y: 135 }} dataSource={modules} columns={moduleColumns} rowClassName={(module) => String(module.codigo) === String(selected?.codigo) ? 'is-selected' : ''} onRow={(module) => ({ onClick: () => { setSelectedCode(module.codigo); setSelectedFunction(null); } })} />
    </section>
    <section className="usuarios-permission-section" aria-label="Funções">
      <div className="usuarios-permission-section-title">Funções — {selected?.nome || selected?.codigo}</div>
      <LevelToolbar functionMode level={functionLevel} saving={saving} onLevelChange={(nextLevel) => selectedFunction && onFunctionLevelChange?.(selected?.codigo, selectedFunction, nextLevel)} />
    {functionRows.length ? <Table className="usuarios-permission-function-table" rowKey="key" size="small" pagination={false} tableLayout="fixed" scroll={{ y: 135 }} dataSource={functionRows} columns={functionColumns} rowClassName={(row) => row.key === selectedFunction ? 'is-selected' : ''} onRow={(row) => ({ onClick: () => setSelectedFunction(row.key) })} /> : <Empty description="Nenhuma função declarada para este módulo" />}
    </section>
  </div>;
}
