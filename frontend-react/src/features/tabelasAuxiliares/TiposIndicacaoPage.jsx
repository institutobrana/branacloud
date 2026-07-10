import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Checkbox, Form, Input, Modal, Select, Space, Typography, message } from 'antd';
import { LockOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaTable } from '../../components/BranaTable.jsx';
import { TableColumnFilterHeader } from '../../components/TableColumnFilterHeader.jsx';
import {
  atualizarAuxiliar,
  atualizarMotivoAgendamento,
  atualizarStatusMotivoAgendamento,
  criarAuxiliar,
  criarMotivoAgendamento,
  excluirAuxiliar,
  excluirMotivoAgendamento,
  listarAuxiliares,
  listarMotivosAgendamento,
  substituirEExcluirMotivoAgendamento,
  verificarExclusaoMotivoAgendamento,
} from './auxiliaresApi.js';

const AUXILIARY_TABLES = [
  { key: 'bairro', label: 'Bairro', tipo: 'Bairro' },
  { key: 'bancos', label: 'Bancos', tipo: 'Bancos' },
  { key: 'cidade', label: 'Cidade', tipo: 'Cidade' },
  { key: 'especialidades', label: 'Especialidades', tipo: 'Especialidade' },
  { key: 'estado-civil', label: 'Estado civil', tipo: 'Estado civil' },
  { key: 'fase-procedimento', label: 'Fase procedimento', tipo: 'Fase procedimento' },
  { key: 'fabricantes', label: 'Fabricantes', tipo: 'Fabricantes' },
  { key: 'grupo-medicamento', label: 'Grupo de medicamento', tipo: 'Grupo de medicamento' },
  { key: 'motivos-agendamento', label: 'Motivos de agendamento', tipo: 'Motivos de agendamento' },
  { key: 'motivo-atestado', label: 'Motivo de atestado', tipo: 'Motivo de atestado' },
  { key: 'motivo-retorno', label: 'Motivo de retorno', tipo: 'Motivo de retorno' },
  { key: 'palavra-chave', label: 'Palavra chave', tipo: 'Palavra chave' },
  { key: 'prefs-pessoais', label: 'Prefixos pessoais', tipo: 'Prefixo pessoais' },
  { key: 'situacao-agendamento', label: 'Situação do agendamento', tipo: 'Situação do agendamento' },
  { key: 'situacao-paciente', label: 'Situação do paciente', tipo: 'Situação do paciente' },
  { key: 'tipos-apresentacao', label: 'Tipos de apresentação', tipo: 'Tipos de apresentação' },
  { key: 'tipos-cobranca', label: 'Tipos de cobrança', tipo: 'Tipos de cobrança' },
  { key: 'tipos-contato', label: 'Tipos de contato', tipo: 'Tipos de contato' },
  { key: 'tipos-indicacao', label: 'Tipos de indicação', tipo: 'Tipos de indicação' },
  { key: 'tipos-material', label: 'Tipos de material', tipo: 'Tipos de material' },
  { key: 'tipos-pagamento', label: 'Tipos de pagamento', tipo: 'Tipos de pagamento' },
  { key: 'tipos-uso', label: 'Tipos de uso', tipo: 'Tipos de uso' },
  { key: 'tipos-usuario', label: 'Tipos de usuário', tipo: 'Tipos de usuário' },
  { key: 'unidades-medida', label: 'Unidades de medida', tipo: 'Unidades de medida' },
];

const SPECIALTY_IMAGE_OPTIONS = [
  { id: 1, label: 'Dentística' },
  { id: 2, label: 'Prótese' },
  { id: 3, label: 'Endodontia' },
  { id: 4, label: 'Periodontia' },
  { id: 5, label: 'Gerais' },
  { id: 6, label: 'Cirurgia' },
  { id: 7, label: 'Ortodontia' },
  { id: 8, label: 'Prevenção' },
  { id: 9, label: 'Odontopediatria' },
  { id: 10, label: 'Diagnóstico' },
  { id: 11, label: 'Radiologia' },
  { id: 12, label: 'Estética' },
  { id: 13, label: 'Implantodontia' },
  { id: 14, label: 'Genérica' },
];

const APPOINTMENT_STATUS_COLOR_OPTIONS = [
  '#FFFF00', '#FFFF99', '#0000FF', '#666699', '#3366FF', '#000078', '#000080', '#99CCFF', '#003366', '#00CCFF', '#333399', '#8A2BE2', '#FFFFFF', '#00FFFF', '#33CCCC',
  '#CCFFFF', '#808080', '#333333', '#969696', '#FFCC00', '#FF7F00', '#FF9900', '#FF6600', '#CC99FF', '#FF00FF', '#993300', '#FFCC99', '#C0C0C0', '#000000', '#FF99CC',
  '#800080', '#993366', '#008000', '#CCFFCC', '#003300', '#32CD32', '#99CC00', '#339966', '#333300', '#00FF00', '#808000', '#008080', '#FF0000', '#800000',
];

const APPOINTMENT_STATUS_LIGHT_COLORS = new Set([
  '#FFFFFF', '#FFFF99', '#CCFFFF', '#CC99FF', '#C0C0C0', '#FFCC99', '#FF99CC', '#99CCFF', '#FFCC00', '#33CCCC',
]);

const APPOINTMENT_REASON_COLOR_OPTIONS = APPOINTMENT_STATUS_COLOR_OPTIONS;
const APPOINTMENT_REASON_LIGHT_COLORS = APPOINTMENT_STATUS_LIGHT_COLORS;

function emptyFormValues() {
  return {
    codigo: '',
    nome: '',
    descricao: '',
    inativo: false,
    cor_apresentacao: '',
    exibir_anotacao_historico: false,
    mensagem_alerta: '',
    desativar_paciente_sistema: false,
  };
}

function buildEmptyFormValues(table, items = []) {
  if (table?.tipo === 'Motivos de agendamento') {
    return {
      codigo: generateNextReasonCode(items),
      nome: '',
      descricao: '',
      tipo: 'agendamento',
      cor: '',
      compromisso_produtivo: false,
      inativo: false,
    };
  }

  return emptyFormValues();
}

function generateNextNumericCode(items) {
  let maxValue = 0;
  let width = 2;
  for (const item of Array.isArray(items) ? items : []) {
    const code = String(item?.codigo ?? '').trim();
    if (!/^\d+$/.test(code)) continue;
    maxValue = Math.max(maxValue, Number(code));
    width = Math.max(width, code.length);
  }
  return String(maxValue + 1).padStart(width, '0');
}

function generateNextReasonCode(items) {
  let maxValue = 0;
  for (const item of Array.isArray(items) ? items : []) {
    const code = String(item?.codigo ?? '').trim().toUpperCase();
    const match = code.match(/^MA-(\d+)$/);
    if (!match) continue;
    maxValue = Math.max(maxValue, Number(match[1]));
  }
  return `MA-${String(maxValue + 1).padStart(3, '0')}`;
}

function normalizeSpecialtyImageIndex(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) && numeric >= 1 ? numeric : 0;
}

function getSpecialtyImageLabel(index) {
  const option = SPECIALTY_IMAGE_OPTIONS.find((item) => item.id === Number(index || 0));
  return option ? option.label : '';
}

export function TiposIndicacaoPage() {
  const [activeTableKey, setActiveTableKey] = useState(AUXILIARY_TABLES[0].key);
  const [items, setItems] = useState([]);
  const [sortState, setSortState] = useState({ key: null, order: null });
  const [visibleColumns, setVisibleColumns] = useState({ codigo: true, descricao: true, status: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form] = Form.useForm();

  const activeTable = useMemo(
    () => AUXILIARY_TABLES.find((table) => table.key === activeTableKey) || AUXILIARY_TABLES[0],
    [activeTableKey],
  );
  const isGrupoMedicamento = activeTable.tipo === 'Grupo de medicamento';
  const isAppointmentReason = activeTable.tipo === 'Motivos de agendamento';
  const isAppointmentStatus = activeTable.tipo === 'Situação do agendamento';
  const isPatientStatus = activeTable.tipo === 'Situação do paciente';
  const isSpeciality = activeTable.tipo === 'Especialidade';
  const selectedReasonType = Form.useWatch('tipo', form);
  const selectedReasonColor = Form.useWatch('cor', form);
  const selectedReasonInactive = Form.useWatch('inativo', form);
  const selectedAppointmentColor = Form.useWatch('cor_apresentacao', form);
  const selectedSpecialtyImage = Form.useWatch('imagem_indice', form);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);

  const sortedItems = useMemo(() => {
    const nextItems = [...items];
    if (!sortState.key || !sortState.order) return nextItems;

    nextItems.sort((left, right) => {
      const leftValue = String(left?.[sortState.key] ?? '').toLowerCase();
      const rightValue = String(right?.[sortState.key] ?? '').toLowerCase();
      const comparison = leftValue.localeCompare(rightValue, 'pt-BR', { sensitivity: 'base' });
      return sortState.order === 'asc' ? comparison : -comparison;
    });

    return nextItems;
  }, [items, sortState.key, sortState.order]);

  const loadItems = async (table = activeTable) => {
    setLoading(true);
    setError('');
    try {
      const data = table.tipo === 'Motivos de agendamento'
        ? await listarMotivosAgendamento()
        : await listarAuxiliares(table.tipo);
      setItems(data);
      setSelectedId((current) => (data.some((item) => item.id === current) ? current : data[0]?.id ?? null));
    } catch (err) {
      setItems([]);
      setSelectedId(null);
      setError(err?.message || `Falha ao carregar ${table.label.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems(activeTable);
  }, [activeTable]);

  useEffect(() => {
    if (!modalOpen) {
      form.resetFields();
      setEditingItem(null);
      return;
    }

    form.setFieldsValue(
      editingItem
        ? isAppointmentReason
          ? {
              codigo: editingItem.codigo,
              nome: editingItem.nome || editingItem.descricao,
              descricao: editingItem.descricao,
              tipo: editingItem.tipo || 'agendamento',
              cor: editingItem.cor || '',
              compromisso_produtivo: Boolean(editingItem.compromisso_produtivo),
              inativo: editingItem.inativo,
            }
          : {
              codigo: editingItem.codigo,
              nome: editingItem.descricao,
              descricao: editingItem.descricao,
              inativo: editingItem.inativo,
              ordem: editingItem.ordem,
              imagem_indice: editingItem.imagem_indice,
              cor_apresentacao: editingItem.cor_apresentacao,
              exibir_anotacao_historico: editingItem.exibir_anotacao_historico,
              mensagem_alerta: editingItem.mensagem_alerta,
              desativar_paciente_sistema: editingItem.desativar_paciente_sistema,
            }
        : buildEmptyFormValues(activeTable, items),
    );
  }, [activeTable, editingItem, form, isAppointmentReason, items, modalOpen]);

  const openNewModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedItem) {
      message.warning('Selecione um registro para alterar.');
      return;
    }
    setEditingItem(selectedItem);
    setModalOpen(true);
  };

  const handleTableChange = (tableKey) => {
    if (tableKey === activeTableKey) return;
    setActiveTableKey(tableKey);
    setSelectedId(null);
    setEditingItem(null);
    setModalOpen(false);
    setSortState({ key: null, order: null });
    setVisibleColumns(
      tableKey === 'especialidades'
        ? { codigo: true, descricao: true, ordem: true, imagem: true, status: true }
        : tableKey === 'motivos-agendamento'
          ? { codigo: true, name: true, descricao: true, color: true, lock: true, status: true }
        : { codigo: true, descricao: true, status: true },
    );
  };

  const handleFinish = async (values) => {
    setSaving(true);
    try {
      const codigo = isGrupoMedicamento
        ? (editingItem?.codigo || generateNextNumericCode(items))
        : isAppointmentReason
          ? String(values.codigo || '').trim() || generateNextReasonCode(items)
          : String(values.codigo || '').trim();

      if (editingItem) {
        if (isAppointmentReason) {
          await atualizarMotivoAgendamento(editingItem.id, {
            codigo,
            nome: String(values.nome || '').trim(),
            descricao: String(values.descricao || '').trim(),
            tipo: String(values.tipo || 'agendamento').trim(),
            cor: String(values.cor || '').trim(),
            compromisso_produtivo: Boolean(values.compromisso_produtivo),
            inativo: Boolean(values.inativo),
          });
        } else {
          const payload = {
            tipo: activeTable.tipo,
            codigo,
            descricao: String(values.descricao || values.nome || '').trim(),
            inativo: isGrupoMedicamento ? Boolean(editingItem?.inativo) : Boolean(values.inativo),
            ordem: isSpeciality ? (String(values.ordem || '').trim() === '' ? null : Number(values.ordem)) : null,
            imagem_indice: isSpeciality ? normalizeSpecialtyImageIndex(values.imagem_indice) : null,
            cor_apresentacao: isAppointmentStatus ? String(values.cor_apresentacao || '').trim() : '',
            exibir_anotacao_historico: isAppointmentStatus ? Boolean(values.exibir_anotacao_historico) : false,
            mensagem_alerta: isAppointmentStatus || isPatientStatus ? String(values.mensagem_alerta || '').trim() : '',
            desativar_paciente_sistema: isAppointmentStatus || isPatientStatus ? Boolean(values.desativar_paciente_sistema) : false,
          };
          await atualizarAuxiliar(editingItem.id, payload);
        }
        message.success(`${activeTable.label} atualizado.`);
      } else {
        if (isAppointmentReason) {
          await criarMotivoAgendamento({
            codigo,
            nome: String(values.nome || '').trim(),
            descricao: String(values.descricao || '').trim(),
            tipo: String(values.tipo || 'agendamento').trim(),
            cor: String(values.cor || '').trim(),
            compromisso_produtivo: Boolean(values.compromisso_produtivo),
            inativo: Boolean(values.inativo),
          });
        } else {
          const payload = {
            tipo: activeTable.tipo,
            codigo,
            descricao: String(values.descricao || values.nome || '').trim(),
            inativo: isGrupoMedicamento ? Boolean(editingItem?.inativo) : Boolean(values.inativo),
            ordem: isSpeciality ? (String(values.ordem || '').trim() === '' ? null : Number(values.ordem)) : null,
            imagem_indice: isSpeciality ? normalizeSpecialtyImageIndex(values.imagem_indice) : null,
            cor_apresentacao: isAppointmentStatus ? String(values.cor_apresentacao || '').trim() : '',
            exibir_anotacao_historico: isAppointmentStatus ? Boolean(values.exibir_anotacao_historico) : false,
            mensagem_alerta: isAppointmentStatus || isPatientStatus ? String(values.mensagem_alerta || '').trim() : '',
            desativar_paciente_sistema: isAppointmentStatus || isPatientStatus ? Boolean(values.desativar_paciente_sistema) : false,
          };
          await criarAuxiliar(payload);
        }
        message.success(`${activeTable.label} criado.`);
      }

      setModalOpen(false);
      await loadItems(activeTable);
    } catch (err) {
      message.error(err?.message || `Falha ao salvar ${activeTable.label.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      if (isAppointmentReason) {
        await excluirMotivoAgendamento(selectedItem.id);
      } else {
        await excluirAuxiliar(selectedItem.id);
      }
      message.success(`${activeTable.label} excluído.`);
      setSelectedId(null);
      await loadItems(activeTable);
    } catch (err) {
      message.error(err?.message || `Falha ao excluir ${activeTable.label.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!isAppointmentReason || !modalOpen) {
      return;
    }

    if (String(selectedReasonType || '').trim() !== 'compromisso') {
      form.setFieldsValue({
        cor: '',
        compromisso_produtivo: false,
      });
      return;
    }

    if (!form.getFieldValue('compromisso_produtivo')) {
      form.setFieldValue('compromisso_produtivo', true);
    }
  }, [form, isAppointmentReason, modalOpen, selectedReasonType]);

  useEffect(() => {
    const onToolbarAction = (event) => {
      const action = event?.detail?.action;
      if (action === 'novo') {
        openNewModal();
      } else if (action === 'alterar') {
        openEditModal();
      } else if (action === 'excluir') {
        void handleDelete();
      }
    };

    window.addEventListener('brana-auxiliar-toolbar-action', onToolbarAction);
    return () => window.removeEventListener('brana-auxiliar-toolbar-action', onToolbarAction);
  }, [selectedItem]);

  const filterColumns = isAppointmentReason
    ? [
        { key: 'codigo', label: 'Código', visible: true },
        { key: 'name', label: 'Nome', visible: true },
        { key: 'descricao', label: 'Descrição', visible: true },
        { key: 'color', label: 'Cor', visible: true, locked: true },
        { key: 'lock', label: 'Bloqueio', visible: true, locked: true },
        { key: 'status', label: 'Status', visible: true, locked: true },
      ]
    : isPatientStatus
    ? [
        { key: 'codigo', label: 'Código', visible: true },
        { key: 'descricao', label: 'Descrição', visible: true },
        { key: 'status', label: 'Status', visible: true, locked: true },
      ]
    : isSpeciality
      ? [
          { key: 'codigo', label: 'Código', visible: true },
          { key: 'descricao', label: 'Descrição', visible: true },
          { key: 'ordem', label: 'Ordem', visible: true },
          { key: 'imagem', label: 'Imagem', visible: true },
          { key: 'status', label: 'Status', visible: true, locked: true },
        ]
    : [
        { key: 'codigo', label: 'Código', visible: true },
        { key: 'name', label: 'Nome', visible: true },
        { key: 'descricao', label: 'Descrição', visible: true },
        { key: 'color', label: 'Cor', visible: true, locked: true },
        { key: 'lock', label: 'Bloqueio', visible: true, locked: true },
        { key: 'status', label: 'Status', visible: true, locked: true },
      ];

  const renderFilterTitle = (columnKey, label, hideLabel = false) => (
    <TableColumnFilterHeader
      label={label}
      activeSort={sortState.key === columnKey ? sortState.order : null}
      onSortAsc={columnKey === 'status' ? undefined : () => setSortState({ key: columnKey, order: 'asc' })}
      onSortDesc={columnKey === 'status' ? undefined : () => setSortState({ key: columnKey, order: 'desc' })}
      columns={filterColumns}
      onToggleColumn={(key) => setVisibleColumns((current) => ({ ...current, [key]: !current[key] }))}
      hideLabel={hideLabel}
    />
  );

  const allColumns = isAppointmentReason
    ? [
        {
          key: 'codigo',
          title: renderFilterTitle('codigo', 'Código'),
          dataIndex: 'codigo',
          width: 120,
          render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
        },
        {
          key: 'name',
          title: renderFilterTitle('name', 'Nome'),
          dataIndex: 'nome',
          width: 200,
          render: (value, record) => (
            <Typography.Text className="auxiliary-table-name-text" strong>
              {value || record.descricao || '-'}
            </Typography.Text>
          ),
        },
        {
          key: 'descricao',
          title: renderFilterTitle('descricao', 'Descrição'),
          dataIndex: 'descricao',
          render: (value) => value || '-',
        },
        {
          key: 'color',
          title: renderFilterTitle('color', 'Cor', true),
          dataIndex: 'cor',
          width: 78,
          align: 'center',
          render: (value) => {
            const color = String(value || '').trim();
            return (
              <span
                className="auxiliary-table-color-chip"
                title={color || 'Sem cor'}
                style={{ backgroundColor: color || 'transparent' }}
                aria-hidden="true"
              />
            );
          },
        },
        {
          key: 'lock',
          title: renderFilterTitle('lock', 'Bloqueio', true),
          dataIndex: 'compromisso_produtivo',
          width: 72,
          align: 'center',
          render: (value) => (
            <span className={`auxiliary-table-lock${value ? ' is-locked' : ''}`} title={value ? 'Bloqueado' : 'Livre'}>
              <LockOutlined />
            </span>
          ),
        },
        {
          key: 'status',
          title: renderFilterTitle('status', 'Status', true),
          dataIndex: 'inativo',
          width: 72,
          align: 'center',
          render: (_, record) => (
            <span className={`auxiliary-table-status-dot${record.inativo ? ' is-inactive' : ' is-active'}`} title={record.inativo ? 'Inativo' : 'Ativo'} aria-hidden="true" />
          ),
        },
      ]
    : isPatientStatus
    ? [
        {
          key: 'codigo',
          title: renderFilterTitle('codigo', 'Código'),
          dataIndex: 'codigo',
          width: 120,
          render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
        },
        {
          key: 'descricao',
          title: renderFilterTitle('descricao', 'Descrição'),
          dataIndex: 'descricao',
          render: (value) => value || '-',
        },
        {
          key: 'status',
          title: renderFilterTitle('status', 'Status', true),
          dataIndex: 'inativo',
          width: 72,
          align: 'center',
          render: (_, record) => (
            <span className={`auxiliary-table-status-dot${record.inativo ? ' is-inactive' : ' is-active'}`} title={record.inativo ? 'Inativo' : 'Ativo'} aria-hidden="true" />
          ),
        },
      ]
    : isSpeciality
      ? [
          {
            key: 'codigo',
            title: renderFilterTitle('codigo', 'Código'),
            dataIndex: 'codigo',
            width: 110,
            render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
          },
          {
            key: 'descricao',
            title: renderFilterTitle('descricao', 'Descrição'),
            dataIndex: 'descricao',
            render: (value) => value || '-',
          },
          {
            key: 'ordem',
            title: renderFilterTitle('ordem', 'Ordem'),
            dataIndex: 'ordem',
            width: 90,
            align: 'center',
            render: (value) => (value === null || value === undefined || value === '' ? '-' : String(value)),
          },
          {
            key: 'imagem',
            title: renderFilterTitle('imagem', 'Imagem'),
            dataIndex: 'imagem_indice',
            width: 150,
            render: (value) => getSpecialtyImageLabel(value) || '-',
          },
          {
            key: 'status',
            title: renderFilterTitle('status', 'Status', true),
            dataIndex: 'inativo',
            width: 72,
            align: 'center',
            render: (_, record) => (
              <span className={`auxiliary-table-status-dot${record.inativo ? ' is-inactive' : ' is-active'}`} title={record.inativo ? 'Inativo' : 'Ativo'} aria-hidden="true" />
            ),
          },
        ]
    : [
        {
          key: 'codigo',
          title: renderFilterTitle('codigo', 'Código'),
          dataIndex: 'codigo',
          width: 120,
          render: (value) => <Typography.Text strong>{value || '-'}</Typography.Text>,
        },
        {
          key: 'name',
          title: renderFilterTitle('name', 'Nome'),
          dataIndex: 'name',
          width: 200,
          render: (value, record) => (
            <Typography.Text className="auxiliary-table-name-text" strong={record.codigo === '01'}>
              {value || record.descricao || '-'}
            </Typography.Text>
          ),
        },
        {
          key: 'descricao',
          title: renderFilterTitle('descricao', 'Descrição'),
          dataIndex: 'descricao',
          render: (value) => value || '-',
        },
        {
          key: 'color',
          title: renderFilterTitle('color', 'Cor', true),
          dataIndex: 'cor_apresentacao',
          width: 78,
          align: 'center',
          render: (value) => {
            const color = String(value || '').trim();
            return (
              <span
                className="auxiliary-table-color-chip"
                title={color || 'Sem cor'}
                style={{ backgroundColor: color || 'transparent' }}
                aria-hidden="true"
              />
            );
          },
        },
        {
          key: 'lock',
          title: renderFilterTitle('lock', 'Bloqueio', true),
          dataIndex: 'inativo',
          width: 72,
          align: 'center',
          render: (value) => (
            <span className={`auxiliary-table-lock${value ? ' is-locked' : ''}`} title={value ? 'Bloqueado' : 'Livre'}>
              <LockOutlined />
            </span>
          ),
        },
        {
          key: 'status',
          title: renderFilterTitle('status', 'Status', true),
          dataIndex: 'inativo',
          width: 72,
          align: 'center',
          render: (_, record) => (
            <span className={`auxiliary-table-status-dot${record.inativo ? ' is-inactive' : ' is-active'}`} title={record.inativo ? 'Inativo' : 'Ativo'} aria-hidden="true" />
          ),
        },
      ];
  const columns = allColumns.filter((column) => visibleColumns[column.key] !== false);

  const modalWidth = isGrupoMedicamento ? 520 : isAppointmentReason ? 520 : isAppointmentStatus ? 520 : isPatientStatus ? 500 : 760;
  const resolvedModalWidth = isSpeciality ? 376 : modalWidth;
  const modalClassName = [
    'terra-password-modal',
    'client-modal',
    'auxiliary-modal',
    isAppointmentReason ? 'auxiliary-reason-modal' : '',
    isAppointmentStatus ? 'auxiliary-status-modal' : '',
    isPatientStatus ? 'auxiliary-patient-modal' : '',
    isSpeciality ? 'auxiliary-speciality-modal' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const formClassName = [
    'terra-password-form',
    'client-modal-form',
    'auxiliary-modal-form',
    isAppointmentReason ? 'auxiliary-reason-form' : '',
    isAppointmentStatus ? 'auxiliary-status-form' : '',
    isPatientStatus ? 'auxiliary-patient-status-form' : '',
    isSpeciality ? 'auxiliary-speciality-form' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Space direction="vertical" size={10} style={{ width: '100%', marginTop: 8 }}>
      <div className={`auxiliary-shell-frame${sidebarCollapsed ? ' is-collapsed' : ''}`}>
        <div className="auxiliary-layout">
          <aside className="auxiliary-sidebar">
            <div className="auxiliary-sidebar-header">
              <div className="auxiliary-sidebar-header-row">
                <Typography.Text className="auxiliary-sidebar-kicker">Tabelas auxiliares</Typography.Text>
                <Button
                  type="text"
                  size="small"
                  className="auxiliary-sidebar-collapse"
                  icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setSidebarCollapsed((current) => !current)}
                  aria-label={sidebarCollapsed ? 'Expandir submenu' : 'Recolher submenu'}
                />
              </div>
            </div>

            <div className="auxiliary-sidebar-list" role="listbox" aria-label="Tabelas auxiliares">
              {AUXILIARY_TABLES.map((table) => {
                const isActive = table.key === activeTable.key;
                return (
                  <button
                    key={table.key}
                    type="button"
                    className={`auxiliary-sidebar-item${isActive ? ' is-active' : ''}`}
                    onClick={() => handleTableChange(table.key)}
                    title={table.label}
                  >
                    <span className="auxiliary-sidebar-item-label">{table.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <Space direction="vertical" size={12} style={{ width: '100%', minWidth: 0, paddingTop: 2 }}>
            {error ? <Alert type="error" showIcon message="Falha ao carregar a tabela." description={error} /> : null}

            <BranaCard className="auxiliary-main-card">
              <div className="module-table-shell">
                <div className="users-grid-shell">
                  <BranaTable
                    rowKey="id"
                    className="module-table auxiliary-compact-table"
                    loading={loading}
                    pagination={false}
                    size="small"
                    tableLayout="fixed"
                    dataSource={sortedItems}
                    columns={columns}
                    rowSelection={{
                      type: 'radio',
                      selectedRowKeys: selectedItem ? [selectedItem.id] : [],
                      onChange: (keys) => setSelectedId(keys[0] ?? null),
                    }}
                    onRow={(record) => ({
                      onClick: () => setSelectedId(record.id),
                    })}
                    locale={{ emptyText: `Nenhum registro de ${activeTable.label.toLowerCase()} cadastrado.` }}
                  />
                </div>
              </div>
            </BranaCard>
          </Space>
        </div>
      </div>

      <Modal
        open={modalOpen}
        className={modalClassName}
        centered
        width={resolvedModalWidth}
        destroyOnClose
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <div className="terra-password-modal-header">
          <Typography.Title level={3} className="terra-password-modal-title">
            {editingItem ? `Alterar ${activeTable.label.toLowerCase()}` : `Novo ${activeTable.label.toLowerCase()}`}
          </Typography.Title>
        </div>

        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={buildEmptyFormValues(activeTable, items)} className={formClassName}>
          {!isGrupoMedicamento ? (
            <Form.Item name="codigo" label="Código" rules={[{ required: true, message: 'Informe o código.' }]}>
              <Input placeholder={isAppointmentReason ? 'Ex.: MA-001' : 'Ex.: TI-001'} />
            </Form.Item>
          ) : null}

          {isAppointmentReason || isAppointmentStatus ? (
            <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Informe o nome.' }]}>
              <Input placeholder={isAppointmentReason ? 'Ex.: Exame clínico' : 'Ex.: Situação de agendamento'} />
            </Form.Item>
          ) : null}

          <Form.Item
            name="descricao"
            label="Descrição"
            rules={isAppointmentReason ? [] : [{ required: true, message: 'Informe a descrição.' }]}
          >
            <Input placeholder={isGrupoMedicamento ? 'Ex.: Analgésicos' : isAppointmentReason ? 'Ex.: Classificação usada na agenda' : `Ex.: ${activeTable.label}`} />
          </Form.Item>

          {isAppointmentReason ? (
            <>
              <Form.Item
                name="tipo"
                label="Tipo"
                rules={[{ required: true, message: 'Selecione o tipo do motivo.' }]}
              >
                <Select
                  options={[
                    { label: 'Agendamento', value: 'agendamento' },
                    { label: 'Compromisso', value: 'compromisso' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="cor"
                label="Cor"
                rules={[
                  {
                    validator: (_, value) => {
                      if (String(selectedReasonType || '').trim() !== 'compromisso' || value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Selecione uma cor para o motivo do tipo compromisso.'));
                    },
                  },
                ]}
              >
                <div
                  className={`auxiliary-color-picker${String(selectedReasonType || '').trim() !== 'compromisso' ? ' is-disabled' : ''}`}
                  role="radiogroup"
                  aria-label="Cores do motivo de agendamento"
                  aria-disabled={String(selectedReasonType || '').trim() !== 'compromisso'}
                >
                  {APPOINTMENT_REASON_COLOR_OPTIONS.map((color) => {
                    const isSelected = String(selectedReasonColor || '').toUpperCase() === color.toUpperCase();
                    const isCommitmentType = String(selectedReasonType || '').trim() === 'compromisso';
                    return (
                      <button
                        key={color}
                        type="button"
                        className={`auxiliary-color-swatch${isSelected ? ' is-selected' : ''}${APPOINTMENT_REASON_LIGHT_COLORS.has(color.toUpperCase()) ? ' is-light' : ''}`}
                        aria-pressed={isSelected}
                        title={color}
                        aria-label={color}
                        style={{ backgroundColor: color }}
                        disabled={!isCommitmentType}
                        onClick={() => form.setFieldValue('cor', color)}
                      />
                    );
                  })}
                </div>
              </Form.Item>

              <Form.Item
                name="compromisso_produtivo"
                valuePropName="checked"
                className="auxiliary-status-check auxiliary-reason-check"
              >
                <Checkbox disabled={String(selectedReasonType || '').trim() !== 'compromisso'}>Compromisso produtivo</Checkbox>
              </Form.Item>
            </>
          ) : null}

          {isSpeciality ? (
            <>
              <Form.Item name="ordem" label="Ordem">
                <Input type="number" min={0} step={1} placeholder="Ex.: 1" />
              </Form.Item>

              <Form.Item name="imagem_indice" label="Imagem" rules={[{ required: true, message: 'Selecione uma imagem.' }]}>
                <select
                  className="ant-input"
                  value={String(selectedSpecialtyImage || '')}
                  onChange={(event) => form.setFieldValue('imagem_indice', Number(event.target.value || 0) || null)}
                >
                  <option value="">Selecione...</option>
                  {SPECIALTY_IMAGE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Form.Item>

              <Form.Item name="inativo" valuePropName="checked" className="auxiliary-status-check auxiliary-speciality-check">
                <Checkbox>Inativar especialidade</Checkbox>
              </Form.Item>
            </>
          ) : null}

          {isPatientStatus ? (
            <>
              <Form.Item name="mensagem_alerta" label="Mensagem / alerta">
                <Input.TextArea rows={2} placeholder="Texto para observação ou alerta." />
              </Form.Item>

              <Form.Item name="desativar_paciente_sistema" valuePropName="checked" className="auxiliary-status-check auxiliary-patient-check">
                <Checkbox>Desativar paciente no sistema</Checkbox>
              </Form.Item>
            </>
          ) : null}

          {isAppointmentStatus ? (
            <>
              <Form.Item name="mensagem_alerta" label="Histórico">
                <Input.TextArea rows={2} placeholder="Texto opcional exibido como alerta." />
              </Form.Item>

              <Form.Item name="cor_apresentacao" label="Cor de apresentação" rules={[{ required: true, message: 'Selecione uma cor de apresentação.' }]} className="auxiliary-color-field">
                <div className="auxiliary-color-picker" role="radiogroup" aria-label="Cores de apresentação">
                  {APPOINTMENT_STATUS_COLOR_OPTIONS.map((color) => {
                    const isSelected = String(selectedAppointmentColor || '').toUpperCase() === color.toUpperCase();
                    return (
                      <button
                        key={color}
                        type="button"
                        className={`auxiliary-color-swatch${isSelected ? ' is-selected' : ''}${APPOINTMENT_STATUS_LIGHT_COLORS.has(color.toUpperCase()) ? ' is-light' : ''}`}
                        aria-pressed={isSelected}
                        title={color}
                        aria-label={color}
                        style={{ backgroundColor: color }}
                        onClick={() => form.setFieldValue('cor_apresentacao', color)}
                      />
                    );
                  })}
                </div>
              </Form.Item>

              <Form.Item name="exibir_anotacao_historico" valuePropName="checked" className="auxiliary-status-check">
                <Checkbox>Exibir anotação no histórico</Checkbox>
              </Form.Item>

              <Form.Item name="desativar_paciente_sistema" valuePropName="checked" className="auxiliary-status-check">
                <Checkbox>Ocultar agendamento</Checkbox>
              </Form.Item>
            </>
          ) : null}

          {editingItem && isAppointmentReason ? (
            <div className="auxiliary-status-check auxiliary-reason-active-check">
              <Checkbox
                checked={!Boolean(selectedReasonInactive)}
                onChange={(event) => form.setFieldValue('inativo', !event.target.checked)}
              >
                Motivo de agendamento ativo
              </Checkbox>
            </div>
          ) : editingItem && !isGrupoMedicamento && !isAppointmentStatus && !isPatientStatus ? (
            <Form.Item name="inativo" valuePropName="checked">
              <Checkbox>Inativo</Checkbox>
            </Form.Item>
          ) : null}

          <div className="terra-password-modal-actions client-modal-actions">
            <Button type="primary" htmlType="submit" loading={saving}>
              Salvar
            </Button>
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </Form>
      </Modal>
    </Space>
  );
}
