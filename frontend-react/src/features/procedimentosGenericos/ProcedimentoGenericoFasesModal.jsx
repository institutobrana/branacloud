import { useEffect, useMemo, useState } from 'react';
import { Modal, Table, message } from 'antd';

import {
  listarAuxiliaresPorTipo,
  obterProcedimentoGenericoDetalhe,
  salvarProcedimentoGenerico,
} from './procedimentosGenericosApi.js';
import {
  buildEmptyProcedimentoGenericoState,
  buildProcedimentoGenericoPayload,
  normalizeProcedimentoGenericoDetalhe,
} from './procedimentosGenericosFasesUtils.js';
import { ProcedimentoGenericoFaseEditModal } from './ProcedimentoGenericoFaseEditModal.jsx';

function toFaseOptions(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      if (typeof item === 'string') {
        const value = String(item || '').trim();
        return value ? { label: value, value } : null;
      }
      const value = String(item?.codigo || '').trim();
      const label = String(item?.nome || item?.descricao || item?.label || value).trim();
      if (!value) return null;
      return { label: label || value, value };
    })
    .filter(Boolean);
}

function comparePhases(a, b) {
  const seqA = Number(a?.sequencia || 0) || 0;
  const seqB = Number(b?.sequencia || 0) || 0;
  if (seqA !== seqB) return seqA - seqB;
  return String(a?.descricao || '').localeCompare(String(b?.descricao || ''), 'pt-BR', { sensitivity: 'base' });
}

function normalizePhaseSequence(value, fallback = 1) {
  return Math.max(1, Number(value || fallback || 1));
}

export function ProcedimentoGenericoFasesModal({ open, procedureId, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [procedureState, setProcedureState] = useState(buildEmptyProcedimentoGenericoState());
  const [auxOptions, setAuxOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeletePhase, setConfirmDeletePhase] = useState(null);

  const phases = useMemo(() => {
    return Array.isArray(procedureState?.fases) ? procedureState.fases : [];
  }, [procedureState]);

  const orderedPhases = useMemo(() => {
    return [...phases].sort(comparePhases);
  }, [phases]);

  const nextSequence = useMemo(() => {
    const maxSeq = orderedPhases.reduce((max, item) => Math.max(max, Number(item?.sequencia || 0) || 0), 0);
    return maxSeq + 1;
  }, [orderedPhases]);

  useEffect(() => {
    if (!open) {
      setProcedureState(buildEmptyProcedimentoGenericoState());
      setAuxOptions([]);
      setSelectedIndex(-1);
      setEditOpen(false);
      setEditIndex(null);
      setConfirmDeleteOpen(false);
      setConfirmDeletePhase(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      if (!procedureId) {
        message.warning('Selecione um procedimento genérico.');
        onClose?.();
        return;
      }

      setLoading(true);
      try {
        const [detalhe, auxiliares] = await Promise.all([
          obterProcedimentoGenericoDetalhe(procedureId),
          listarAuxiliaresPorTipo('Fase procedimento'),
        ]);
        if (cancelled) return;
        const nextState = normalizeProcedimentoGenericoDetalhe(detalhe);
        setProcedureState({
          ...nextState,
          fases: Array.isArray(nextState.fases)
            ? [...nextState.fases]
                .map((fase) => ({
                  ...fase,
                  sequencia: normalizePhaseSequence(fase?.sequencia, 1),
                }))
                .sort(comparePhases)
            : [],
        });
        setAuxOptions(toFaseOptions(auxiliares));
        setSelectedIndex(Array.isArray(nextState.fases) && nextState.fases.length ? 0 : -1);
      } catch (error) {
        if (cancelled) return;
        message.error(error?.message || 'Falha ao carregar as fases do procedimento.');
        setProcedureState(buildEmptyProcedimentoGenericoState());
        setAuxOptions([]);
        setSelectedIndex(-1);
        onClose?.();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [open, onClose, procedureId]);

  const persistCurrentState = async (nextState) => {
    if (!procedureId && !nextState?.id) {
      throw new Error('Procedimento genérico não selecionado.');
    }
    const saved = await salvarProcedimentoGenerico({
      id: procedureId || nextState.id,
      payload: buildProcedimentoGenericoPayload(nextState),
    });
    const normalized = normalizeProcedimentoGenericoDetalhe(saved);
    setProcedureState({
      ...normalized,
      fases: Array.isArray(normalized.fases)
        ? [...normalized.fases]
            .map((fase) => ({
              ...fase,
              sequencia: normalizePhaseSequence(fase?.sequencia, 1),
            }))
            .sort(comparePhases)
        : [],
    });
    return normalized;
  };

  const openEditor = (index = null) => {
    if (!orderedPhases.length && index !== null) {
      message.warning('Nenhuma fase cadastrada para alterar.');
      return;
    }
    if (index !== null && index < 0) {
      message.warning('Selecione uma fase.');
      return;
    }
    setEditIndex(index);
    setEditOpen(true);
  };

  const handleSavePhase = async ({ codigo, sequencia, tempo }) => {
    const nextCodigo = String(codigo || '').trim();
    if (!nextCodigo) {
      message.warning('Selecione a fase do procedimento.');
      return;
    }
    const faseAux = auxOptions.find((item) => String(item.value || '').trim() === nextCodigo) || null;
    const descricao = String(faseAux?.label || faseAux?.descricao || faseAux?.nome || nextCodigo).trim();
    const nextFases = [...orderedPhases];
    const duplicated = nextFases.some((item, idx) => String(item.codigo || '').trim() === nextCodigo && idx !== editIndex);
    if (duplicated) {
      message.warning('Esta fase já está vinculada ao procedimento.');
      return;
    }

    const nextPhase = {
      codigo: nextCodigo,
      descricao,
      sequencia: normalizePhaseSequence(sequencia, nextSequence),
      tempo: Math.max(0, Number(tempo || 0)),
    };

    if (editIndex !== null && editIndex >= 0 && editIndex < nextFases.length) {
      nextFases[editIndex] = { ...nextFases[editIndex], ...nextPhase };
    } else {
      nextFases.push(nextPhase);
    }

    const normalizedNextState = {
      ...procedureState,
      fases: [...nextFases]
        .map((item) => ({
          ...item,
          sequencia: normalizePhaseSequence(item?.sequencia, 1),
        }))
        .sort(comparePhases),
    };

    setSaving(true);
    try {
      const saved = await persistCurrentState(normalizedNextState);
      const nextSelected = editIndex !== null && editIndex >= 0
        ? Math.min(editIndex, Math.max(saved.fases.length - 1, 0))
        : Math.max(saved.fases.length - 1, 0);
      setSelectedIndex(saved.fases.length ? nextSelected : -1);
      setEditOpen(false);
      setEditIndex(null);
      message.success('Fase salva com sucesso.');
      onSaved?.(saved);
    } catch (error) {
      message.error(error?.message || 'Falha ao gravar a fase.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhase = async () => {
    if (selectedIndex < 0) {
      message.warning('Selecione uma fase.');
      return;
    }
    const phase = orderedPhases[selectedIndex];
    if (!phase) return;
    setConfirmDeletePhase(phase);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteSelectedPhase = async () => {
    const phase = confirmDeletePhase || orderedPhases[selectedIndex];
    if (!phase) {
      setConfirmDeleteOpen(false);
      setConfirmDeletePhase(null);
      return;
    }

    const nextFases = orderedPhases
      .filter((_, idx) => idx !== selectedIndex)
      .map((item) => ({
        ...item,
        sequencia: normalizePhaseSequence(item?.sequencia, 1),
      }))
      .sort(comparePhases);

    const normalizedNextState = {
      ...procedureState,
      fases: nextFases,
    };

    setSaving(true);
    try {
      const saved = await persistCurrentState(normalizedNextState);
      const nextSelected = saved.fases.length ? Math.min(selectedIndex, saved.fases.length - 1) : -1;
      setSelectedIndex(nextSelected);
      setEditOpen(false);
      setEditIndex(null);
      message.success('Fase eliminada com sucesso.');
      onSaved?.(saved);
    } catch (error) {
      message.error(error?.message || 'Falha ao excluir a fase.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Seq',
      dataIndex: 'sequencia',
      key: 'sequencia',
      width: 70,
      render: (value, record, index) => Number(value || index + 1),
    },
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
      width: 88,
      render: (value) => value || '-',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      width: 190,
      render: (value) => value || '-',
    },
    {
      title: 'Duração',
      dataIndex: 'tempo',
      key: 'tempo',
      width: 60,
      render: (value) => Number(value || 0),
    },
  ];

  return (
    <Modal
      open={open}
      centered
      destroyOnClose
      width={480}
      footer={null}
      onCancel={onClose}
      title="Configura fases do procedimento"
      confirmLoading={saving}
      className="procedimento-generico-fases-modal"
      closeIcon={<span aria-hidden="true">X</span>}
    >
      <div className="procedimento-generico-fases-toolbar">
        <button type="button" className="procedimento-generico-fases-button is-primary" onClick={() => openEditor(null)} disabled={loading || saving}>
          Nova fase...
        </button>
        <button type="button" className="procedimento-generico-fases-button" onClick={() => openEditor(selectedIndex)} disabled={loading || saving}>
          Altera...
        </button>
        <button type="button" className="procedimento-generico-fases-button is-danger" onClick={handleDeletePhase} disabled={loading || saving}>
          Elimina
        </button>
      </div>

      <div className="procedimento-generico-fases-grid">
        <Table
          rowKey={(record) => `${record.sequencia}-${record.codigo}-${record.descricao}`}
          loading={loading}
          pagination={false}
          size="small"
          tableLayout="fixed"
          scroll={{ y: 132 }}
          dataSource={orderedPhases}
          columns={columns}
          className="procedimento-generico-fases-table"
          rowClassName={(_, index) => (index === selectedIndex ? 'is-selected' : '')}
          onRow={(_, index) => ({
            onClick: () => setSelectedIndex(index ?? -1),
            onDoubleClick: () => openEditor(index ?? -1),
          })}
          locale={{ emptyText: 'Nenhuma fase cadastrada.' }}
        />

        <div className="procedimento-generico-fases-footer">
          <span>{`${orderedPhases.length} fases`}</span>
          <span>Duplo-clique para alterar a fase associada ao procedimento</span>
        </div>
      </div>

      <ProcedimentoGenericoFaseEditModal
        open={editOpen}
        title={editIndex !== null && editIndex >= 0 ? 'Altera fase' : 'Nova fase'}
        options={auxOptions}
        initialValue={editIndex !== null && editIndex >= 0 ? orderedPhases[editIndex] : null}
        nextSequence={nextSequence}
        onCancel={() => {
          setEditOpen(false);
          setEditIndex(null);
        }}
        onConfirm={handleSavePhase}
      />

      <Modal
        open={confirmDeleteOpen}
        centered
        destroyOnClose
        width={360}
        footer={null}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setConfirmDeletePhase(null);
        }}
        title="Excluir fase"
        className="procedimento-generico-fases-confirm-modal"
        closeIcon={<span aria-hidden="true">X</span>}
      >
        <div className="procedimento-generico-fases-confirm-body">
          <p>Confirma a exclusão da fase {confirmDeletePhase?.descricao || 'selecionada'}?</p>
          <div className="procedimento-generico-fases-confirm-actions">
            <button
              type="button"
              className="procedimento-generico-fases-confirm-button is-primary"
              onClick={() => void confirmDeleteSelectedPhase()}
              disabled={saving}
            >
              Ok
            </button>
            <button
              type="button"
              className="procedimento-generico-fases-confirm-button"
              onClick={() => {
                setConfirmDeleteOpen(false);
                setConfirmDeletePhase(null);
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
