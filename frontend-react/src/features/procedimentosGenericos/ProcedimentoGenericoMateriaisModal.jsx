import { useEffect, useMemo, useState } from 'react';
import { Modal, Table, message } from 'antd';

import {
  buildEmptyProcedimentoGenericoState,
  buildProcedimentoGenericoPayload,
  normalizeProcedimentoGenericoDetalhe,
} from './procedimentosGenericosFasesUtils.js';
import {
  listarMateriaisListas,
  listarMateriaisPorLista,
  obterProcedimentoGenericoDetalhe,
  salvarProcedimentoGenerico,
} from './procedimentosGenericosApi.js';
import { ProcedimentoGenericoMaterialEditModal } from './ProcedimentoGenericoMaterialEditModal.jsx';

function normalizeQuantidade(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return 0;
  const normalized = raw.replace(/\s+/g, '').replace(',', '.');
  const next = Number(normalized);
  return Number.isFinite(next) ? next : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function resolveMaterialCost(material) {
  return Number(material?.custo_und ?? material?.custo ?? 0) || 0;
}

function resolveMaterialLabel(material) {
  return String(material?.nome || material?.descricao || material?.codigo || '').trim();
}

export function ProcedimentoGenericoMateriaisModal({ open, procedureId, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [procedureState, setProcedureState] = useState(buildEmptyProcedimentoGenericoState());
  const [listas, setListas] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editListaId, setEditListaId] = useState('');
  const [editBusca, setEditBusca] = useState('');
  const [editMaterialId, setEditMaterialId] = useState('');
  const [editQuantidade, setEditQuantidade] = useState('0');
  const [catalogoMateriais, setCatalogoMateriais] = useState([]);
  const [catalogoLoading, setCatalogoLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteMaterial, setConfirmDeleteMaterial] = useState(null);

  const materiais = useMemo(() => {
    return Array.isArray(procedureState?.materiais) ? procedureState.materiais : [];
  }, [procedureState]);

  const selectedMaterial = useMemo(() => {
    const currentEdit = editIndex !== null && editIndex >= 0 ? materiais[editIndex] || null : null;
    const selectedId = Number(editMaterialId || 0) || Number(currentEdit?.material_id || 0) || 0;
    if (!selectedId) return null;
    const found = catalogoMateriais.find((item) => Number(item?.id || 0) === selectedId);
    if (found) return found;
    if (currentEdit && Number(currentEdit.material_id || 0) === selectedId) {
      return {
        id: Number(currentEdit.material_id || 0),
        codigo: String(currentEdit.codigo || '').trim(),
        nome: String(currentEdit.nome || '').trim(),
        custo: Number(currentEdit.custo_und || 0) || 0,
      };
    }
    return null;
  }, [catalogoMateriais, editIndex, editMaterialId, materiais]);

  const materialOptions = useMemo(() => {
    const options = catalogoMateriais.map((item) => ({
      id: Number(item?.id || 0) || 0,
      codigo: String(item?.codigo || '').trim(),
      nome: String(item?.nome || '').trim(),
      custo: Number(item?.custo || 0) || 0,
    }));

    const currentEdit = editIndex !== null && editIndex >= 0 ? materiais[editIndex] || null : null;
    if (currentEdit && Number(currentEdit.material_id || 0) > 0) {
      const alreadyIncluded = options.some((item) => Number(item.id || 0) === Number(currentEdit.material_id || 0));
      if (!alreadyIncluded) {
        options.unshift({
          id: Number(currentEdit.material_id || 0),
          codigo: String(currentEdit.codigo || '').trim(),
          nome: String(currentEdit.nome || '').trim(),
          custo: Number(currentEdit.custo_und || 0) || 0,
        });
      }
    }

    return options;
  }, [catalogoMateriais, editIndex, materiais]);

  const editQuantityValue = Number(editQuantidade || 0) || 0;
  const selectedUnitCost = resolveMaterialCost(selectedMaterial);
  const selectedTotalCost = selectedUnitCost * editQuantityValue;

  const loadMateriaDetail = async () => {
    if (!procedureId) {
      message.warning('Selecione um procedimento genérico.');
      onClose?.();
      return;
    }

    setLoading(true);
    setCatalogoMateriais([]);
    setEditListaId('');
    setEditBusca('');
    setEditMaterialId('');
    setEditQuantidade('0');
    try {
      const [detalhe, listasMateriais] = await Promise.all([
        obterProcedimentoGenericoDetalhe(procedureId),
        listarMateriaisListas(),
      ]);
      const normalized = normalizeProcedimentoGenericoDetalhe(detalhe);
      const ordered = Array.isArray(normalized.materiais) ? [...normalized.materiais] : [];
      setProcedureState({
        ...normalized,
        materiais: ordered,
      });
      setListas(Array.isArray(listasMateriais) ? listasMateriais : []);
      setSelectedIndex(ordered.length ? 0 : -1);
      setEditListaId(String(listasMateriais?.[0]?.id || ''));
    } catch (error) {
      message.error(error?.message || 'Falha ao carregar os materiais do procedimento.');
      setProcedureState(buildEmptyProcedimentoGenericoState());
      setListas([]);
      setSelectedIndex(-1);
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setProcedureState(buildEmptyProcedimentoGenericoState());
      setListas([]);
      setSelectedIndex(-1);
      setEditOpen(false);
      setEditIndex(null);
      setEditListaId('');
      setEditBusca('');
      setEditMaterialId('');
      setEditQuantidade('0');
      setCatalogoMateriais([]);
      setCatalogoLoading(false);
      setConfirmDeleteOpen(false);
      setConfirmDeleteMaterial(null);
      return;
    }

    void loadMateriaDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, procedureId]);

  useEffect(() => {
    if (!open) return;
    if (editListaId) return;
    if (!listas.length) return;
    setEditListaId(String(listas[0]?.id || ''));
  }, [editListaId, listas, open]);

  useEffect(() => {
    if (!open) return;
    if (!editListaId) {
      setCatalogoMateriais([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setCatalogoLoading(true);
      try {
        const materiaisListados = await listarMateriaisPorLista({
          listaId: editListaId,
          q: editBusca,
          classificacao: '__todos__',
        });
        if (cancelled) return;
        setCatalogoMateriais(Array.isArray(materiaisListados) ? materiaisListados : []);
      } catch (error) {
        if (cancelled) return;
        setCatalogoMateriais([]);
        message.error(error?.message || 'Falha ao carregar os materiais.');
      } finally {
        if (!cancelled) setCatalogoLoading(false);
      }
    }, 160);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [editBusca, editListaId, open]);

  const persistState = async (nextState) => {
    const id = Number(procedureId || nextState?.id || 0);
    if (!id) {
      throw new Error('Procedimento genérico não selecionado.');
    }
    const saved = await salvarProcedimentoGenerico({
      id,
      payload: buildProcedimentoGenericoPayload(nextState),
    });
    const normalized = normalizeProcedimentoGenericoDetalhe(saved);
    setProcedureState({
      ...normalized,
      materiais: Array.isArray(normalized.materiais) ? [...normalized.materiais] : [],
    });
    return normalized;
  };

  const openEditor = (index = null) => {
    if (!listas.length) {
      message.warning('Nenhuma classificação de materiais está disponível.');
      return;
    }

    if (index !== null && (index < 0 || index >= materiais.length)) {
      message.warning('Selecione um material.');
      return;
    }

    const materialAtual = index !== null ? materiais[index] || null : null;
    setEditIndex(index);
    setEditListaId((current) => current || String(listas[0]?.id || ''));
    setEditBusca('');
    setEditMaterialId(materialAtual ? String(materialAtual.material_id || '') : '');
    setEditQuantidade(materialAtual ? String(Number(materialAtual.quantidade || 0)) : '0');
    setEditOpen(true);
  };

  const handleSaveMaterial = async () => {
    const selectedId = Number(editMaterialId || 0);
    if (!(selectedId > 0)) {
      message.warning('Selecione um material.');
      return;
    }

    const selectedOption = materialOptions.find((item) => Number(item.id || 0) === selectedId) || null;
    if (!selectedOption) {
      message.warning('Selecione um material.');
      return;
    }

    const quantidade = Math.max(0, normalizeQuantidade(editQuantidade));
    if (!(quantidade > 0)) {
      message.warning('Informe uma quantidade válida.');
      return;
    }

    const nextMaterial = {
      material_id: Number(selectedOption.id || 0),
      codigo: String(selectedOption.codigo || '').trim(),
      nome: String(selectedOption.nome || '').trim(),
      quantidade,
      custo_und: Number(selectedOption.custo || 0) || 0,
    };

    const nextMateriais = [...materiais];
    const duplicated = nextMateriais.some((item, idx) => Number(item?.material_id || 0) === nextMaterial.material_id && idx !== editIndex);
    if (duplicated) {
      message.warning('Este material já está vinculado ao procedimento.');
      return;
    }

    if (editIndex !== null && editIndex >= 0 && editIndex < nextMateriais.length) {
      nextMateriais[editIndex] = { ...nextMateriais[editIndex], ...nextMaterial };
    } else {
      nextMateriais.push(nextMaterial);
    }

    const nextState = {
      ...procedureState,
      materiais: nextMateriais,
    };

    setSaving(true);
    try {
      const saved = await persistState(nextState);
      const nextSelected = saved.materiais.length
        ? editIndex !== null && editIndex >= 0
          ? Math.min(editIndex, saved.materiais.length - 1)
          : Math.max(saved.materiais.length - 1, 0)
        : -1;
      setSelectedIndex(nextSelected);
      setEditOpen(false);
      setEditIndex(null);
      message.success('Material salvo com sucesso.');
      onSaved?.(saved);
    } catch (error) {
      message.error(error?.message || 'Falha ao gravar o material.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMaterial = async () => {
    if (!(selectedIndex >= 0)) {
      message.warning('Selecione um material.');
      return;
    }

    const materialAtual = materiais[selectedIndex];
    if (!materialAtual) return;
    setConfirmDeleteMaterial(materialAtual);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteSelectedMaterial = async () => {
    const materialAtual = confirmDeleteMaterial || materiais[selectedIndex];
    if (!materialAtual) {
      setConfirmDeleteOpen(false);
      setConfirmDeleteMaterial(null);
      return;
    }

    const nextMateriais = materiais.filter((_, idx) => idx !== selectedIndex);
    const nextState = {
      ...procedureState,
      materiais: nextMateriais,
    };

    setSaving(true);
    try {
      const saved = await persistState(nextState);
      const nextSelected = saved.materiais.length ? Math.min(selectedIndex, saved.materiais.length - 1) : -1;
      setSelectedIndex(nextSelected);
      setEditOpen(false);
      setEditIndex(null);
      message.success('Material eliminado com sucesso.');
      onSaved?.(saved);
    } catch (error) {
      message.error(error?.message || 'Falha ao excluir o material.');
    } finally {
      setSaving(false);
      setConfirmDeleteOpen(false);
      setConfirmDeleteMaterial(null);
    }
  };

  const columns = [
    {
      title: 'Material',
      dataIndex: 'nome',
      key: 'nome',
      width: 250,
      render: (value) => value || '-',
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
      key: 'quantidade',
      width: 74,
      align: 'center',
      render: (value) => Number(value || 0),
    },
    {
      title: 'Custo total',
      key: 'custo_total',
      width: 86,
      align: 'center',
      render: (_, record) => formatMoney(Number(record?.custo_und || 0) * Number(record?.quantidade || 0)),
    },
  ];

  return (
    <Modal
      open={open}
      centered
      destroyOnClose
      width={440}
      footer={null}
      onCancel={onClose}
      title="Configura materiais do procedimento"
      confirmLoading={saving}
      className="procedimento-generico-materiais-modal"
      closeIcon={<span aria-hidden="true">X</span>}
    >
      <div className="procedimento-generico-materiais-toolbar">
        <button type="button" className="procedimento-generico-materiais-button is-primary" onClick={() => openEditor(null)} disabled={loading || saving}>
          <img src="/assets/easy/cmd_novo.bmp" alt="" aria-hidden="true" />
          <span>Novo material...</span>
        </button>
        <button type="button" className="procedimento-generico-materiais-button" onClick={() => openEditor(selectedIndex)} disabled={loading || saving || selectedIndex < 0}>
          <img src="/assets/easy/cmd_altera.bmp" alt="" aria-hidden="true" />
          <span>Altera...</span>
        </button>
        <button type="button" className="procedimento-generico-materiais-button is-danger" onClick={handleDeleteMaterial} disabled={loading || saving || selectedIndex < 0}>
          <img src="/assets/easy/cmd_lixo.bmp" alt="" aria-hidden="true" />
          <span>Elimina</span>
        </button>
        <button type="button" className="procedimento-generico-materiais-button" onClick={onClose} disabled={loading || saving}>
          <img src="/assets/easy/cmd_cancela.bmp" alt="" aria-hidden="true" />
          <span>Fecha</span>
        </button>
      </div>

      <div className="procedimento-generico-materiais-grid">
        <div className="procedimento-generico-materiais-head-row">
          <span>Material</span>
          <span>Quantidade</span>
          <span>Custo total</span>
        </div>

        <div className="procedimento-generico-materiais-table-wrap">
          <Table
            rowKey={(record, index) => `${record?.material_id || 0}-${index}`}
            loading={loading}
            showHeader={false}
            pagination={false}
            size="small"
            tableLayout="fixed"
            scroll={{ y: 195 }}
            dataSource={materiais}
            columns={columns}
            className="procedimento-generico-materiais-table"
            rowClassName={(_, index) => (index === selectedIndex ? 'is-selected' : '')}
            onRow={(_, index) => ({
              onClick: () => setSelectedIndex(index ?? -1),
              onDoubleClick: () => openEditor(index ?? -1),
            })}
            locale={{ emptyText: '' }}
          />
        </div>

        <div className="procedimento-generico-materiais-footer">
          <span>{`${materiais.length} materiais`}</span>
          <span>Duplo-clique para alterar o material associado ao procedimento</span>
        </div>
      </div>

      <ProcedimentoGenericoMaterialEditModal
        open={editOpen}
        title={editIndex !== null && editIndex >= 0 ? 'Altera material de procedimento' : 'Novo material de procedimento'}
        loading={catalogoLoading || saving}
        listas={listas}
        listaId={editListaId}
        busca={editBusca}
        materiais={materialOptions}
        materialId={editMaterialId}
        quantidade={editQuantidade}
        custoUnitario={selectedUnitCost}
        custoTotal={selectedTotalCost}
        onChangeListaId={(value) => setEditListaId(value)}
        onChangeBusca={(value) => setEditBusca(value)}
        onChangeMaterialId={(value) => setEditMaterialId(value)}
        onChangeQuantidade={(value) => setEditQuantidade(value)}
        onCancel={() => {
          setEditOpen(false);
          setEditIndex(null);
        }}
        onConfirm={() => void handleSaveMaterial()}
      />

      <Modal
        open={confirmDeleteOpen}
        centered
        destroyOnClose
        width={360}
        footer={null}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setConfirmDeleteMaterial(null);
        }}
        title="Excluir material"
        className="procedimento-generico-material-confirm-modal"
        closeIcon={<span aria-hidden="true">X</span>}
      >
        <div className="procedimento-generico-material-confirm-body">
          <p>Confirma a exclusão do material {confirmDeleteMaterial?.nome || 'selecionado'}?</p>
          <div className="procedimento-generico-material-confirm-actions">
            <button
              type="button"
              className="procedimento-generico-material-confirm-button is-primary"
              onClick={() => void confirmDeleteSelectedMaterial()}
              disabled={saving}
            >
              Ok
            </button>
            <button
              type="button"
              className="procedimento-generico-material-confirm-button"
              onClick={() => {
                setConfirmDeleteOpen(false);
                setConfirmDeleteMaterial(null);
              }}
              disabled={saving}
            >
              Cancela
            </button>
          </div>
        </div>
      </Modal>
    </Modal>
  );
}
