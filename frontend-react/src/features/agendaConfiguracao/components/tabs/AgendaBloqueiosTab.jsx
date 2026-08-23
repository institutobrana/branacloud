import { Button, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { BranaModal } from '../../../../components/BranaModal.jsx';
import { listarUnidadesAtendimentoCombos } from '../../../unidadesAtendimento/services/unidadesAtendimentoApi.js';
import {
  agendaBloqueioDiaLabel,
  agendaBloqueioFormatDateForDisplay,
  agendaBloqueioFormatTimeForDisplay,
  agendaBloqueioNormalizeDateInput,
  agendaBloqueioNormalizeTimeInput,
  agendaBloqueioTimeToLegacyInt,
  buildAgendaBloqueioPayload,
} from '../../agendaConfiguracaoBloqueios.js';
import { createAgendaBloqueio, deleteAgendaBloqueio, updateAgendaBloqueio } from '../../agendaConfiguracaoApi.js';
import { AgendaBloqueioModal } from '../bloqueios/AgendaBloqueioModal.jsx';

function normalizeBlockItem(item = {}) {
  return {
    id: Number(item?.id || 0) || Date.now(),
    unidade: String(item?.unidade || '').trim(),
    unidade_id: Number(item?.unidade_id || 0) || null,
    unidade_row_id: Number(item?.unidade_row_id || 0) || null,
    dia_sem: Number(item?.dia_sem || item?.dia || 1) || 1,
    dia: String(item?.dia || '').trim() || agendaBloqueioDiaLabel(item?.dia_sem || item?.dia || 1),
    vigencia_inicio: agendaBloqueioNormalizeDateInput(item?.vigencia_inicio || item?.data_ini || '') || String(item?.vigencia_inicio || item?.data_ini || '').trim(),
    vigencia_fim: agendaBloqueioNormalizeDateInput(item?.vigencia_fim || item?.data_fin || '') || String(item?.vigencia_fim || item?.data_fin || '').trim(),
    data_ini: String(item?.data_ini || item?.vigencia_inicio || '').trim(),
    data_fin: String(item?.data_fin || item?.vigencia_fim || '').trim(),
    hora_ini: agendaBloqueioNormalizeTimeInput(item?.hora_ini || item?.inicio || '') || String(item?.hora_ini || item?.inicio || '').trim(),
    hora_fin: agendaBloqueioNormalizeTimeInput(item?.hora_fin || item?.final || '') || String(item?.hora_fin || item?.final || '').trim(),
    hora_ini_ms: Number(item?.hora_ini_ms || 0) || null,
    hora_fin_ms: Number(item?.hora_fin_ms || 0) || null,
    msg_agenda: String(item?.msg_agenda || item?.mensagem || '').trim(),
    mensagem: String(item?.mensagem || item?.msg_agenda || '').trim(),
  };
}

function formatVigencia(item) {
  const ini = String(item?.vigencia_inicio || item?.data_ini || '').trim();
  const fim = String(item?.vigencia_fim || item?.data_fin || '').trim();
  const iniDisplay = agendaBloqueioFormatDateForDisplay(ini);
  const fimDisplay = agendaBloqueioFormatDateForDisplay(fim);
  if (iniDisplay && fimDisplay) return `${iniDisplay} a ${fimDisplay}`;
  return iniDisplay || fimDisplay || '';
}

export function AgendaBloqueiosTab({
  draft,
  updateDraft,
  prestadorId,
  reloadBloqueios,
  bloqueios = [],
  bloqueiosLoading = false,
  bloqueiosError = '',
}) {
  const bloqueiosItens = Array.isArray(bloqueios) ? bloqueios : [];
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [modalRecord, setModalRecord] = useState(null);
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const selectedItem = useMemo(
    () => bloqueiosItens.find((item) => Number(item?.id || 0) === Number(selectedId || 0)) || null,
    [bloqueiosItens, selectedId],
  );

  useEffect(() => {
    if (!bloqueiosItens.length) {
      setSelectedId(null);
      return;
    }
    setSelectedId((current) => {
      if (bloqueiosItens.some((item) => Number(item?.id || 0) === Number(current || 0))) {
        return current;
      }
      return Number(bloqueiosItens[0]?.id || 0) || null;
    });
  }, [bloqueiosItens]);

  useEffect(() => {
    let alive = true;

    async function loadUnidades() {
      setLoadingUnidades(true);
      try {
        const itens = await listarUnidadesAtendimentoCombos();
        if (!alive) return;
        const normalized = (Array.isArray(itens) ? itens : [])
          .map((item) => ({
            row_id: Number(item?.row_id || item?.id || 0) || null,
            source_id: Number(item?.id || item?.source_id || 0) || null,
            nome: String(item?.nome || item?.descricao || '').trim(),
          }))
          .filter((item) => item.nome);
        setUnidadeOptions(normalized);
      } catch {
        if (!alive) return;
        setUnidadeOptions([{ row_id: null, source_id: null, nome: 'Instituto Brana - Odontologia' }]);
      } finally {
        if (alive) setLoadingUnidades(false);
      }
    }

    loadUnidades();
    return () => {
      alive = false;
    };
  }, []);

  const openCreate = () => {
    setModalMode('create');
    setModalRecord(null);
    setModalOpen(true);
  };

  const openEdit = (item = selectedItem) => {
    if (!item) {
      message.warning('Selecione um bloqueio.');
      return;
    }
    setModalMode('edit');
    setModalRecord(item);
    setModalOpen(true);
  };

  const handleConfirmBlock = async (payload, selectedUnitRecord) => {
    if (!prestadorId) {
      message.error('Prestador nao informado para os bloqueios da agenda.');
      return;
    }
    const nextItem = normalizeBlockItem(payload);
    const requestPayload = buildAgendaBloqueioPayload(nextItem, selectedUnitRecord || {});
    const bloqueioId = Number(modalRecord?.id || 0) || null;
    try {
      const saved = modalMode === 'edit'
        ? await updateAgendaBloqueio(prestadorId, bloqueioId, {
          id_unidade: Number(requestPayload.unidade_row_id || requestPayload.unidade_id || 0) || null,
          dia_sem: Number(requestPayload.dia_sem || 1) || 1,
          data_ini: requestPayload.data_ini || null,
          data_fin: requestPayload.data_fin || null,
          hora_ini: agendaBloqueioTimeToLegacyInt(requestPayload.hora_ini) || 0,
          hora_fin: agendaBloqueioTimeToLegacyInt(requestPayload.hora_fin) || 0,
          msg_agenda: requestPayload.msg_agenda == null ? null : String(requestPayload.msg_agenda || '').trim(),
        })
        : await createAgendaBloqueio(prestadorId, {
          id_unidade: Number(requestPayload.unidade_row_id || requestPayload.unidade_id || 0) || null,
          dia_sem: Number(requestPayload.dia_sem || 1) || 1,
          data_ini: requestPayload.data_ini || null,
          data_fin: requestPayload.data_fin || null,
          hora_ini: agendaBloqueioTimeToLegacyInt(requestPayload.hora_ini) || 0,
          hora_fin: agendaBloqueioTimeToLegacyInt(requestPayload.hora_fin) || 0,
          msg_agenda: requestPayload.msg_agenda == null ? null : String(requestPayload.msg_agenda || '').trim(),
        });
      const rows = await reloadBloqueios?.();
      const nextId = Number(saved?.id || 0) || Number(saved?.id_bloqueio || 0) || null;
      if (nextId) {
        setSelectedId(nextId);
      } else if (Array.isArray(rows) && rows.length) {
        setSelectedId(Number(rows[0]?.id || 0) || null);
      }
      setModalOpen(false);
      setModalRecord(null);
      setModalMode('create');
    } catch (error) {
      message.error(error?.message || 'Falha ao salvar bloqueio.');
    }
  };

  const handleDelete = () => {
    if (!selectedItem) {
      message.warning('Selecione um bloqueio.');
      return;
    }
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleting || !selectedItem) return;
    const bloqueioId = Number(selectedItem?.id || 0) || Number(selectedItem?.id_bloqueio || 0) || null;
    if (!bloqueioId) {
      message.error('Bloqueio nao informado para exclusao.');
      return;
    }
    try {
      setDeleting(true);
      await deleteAgendaBloqueio(prestadorId, bloqueioId);
      await reloadBloqueios?.();
      setSelectedId(null);
      setDeleteConfirmOpen(false);
    } catch (error) {
      message.error(error?.message || 'Falha ao eliminar bloqueio.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalRecord(null);
    setModalMode('create');
  };

  return (
    <div className="agenda-configuracao-pane agenda-configuracao-pane--bloqueios" aria-label="Aba Bloqueios">
      <div className="agenda-bloqueios-toolbar" role="toolbar" aria-label="Ações de bloqueios">
        <Button type="primary" onClick={openCreate}>
          Novo bloqueio
        </Button>
        <Button onClick={() => openEdit(selectedItem)} disabled={!selectedItem}>
          Altera
        </Button>
        <Button danger onClick={handleDelete} disabled={!selectedItem}>
          Elimina
        </Button>
      </div>

      <div className="agenda-bloqueios-table-wrap">
        <table className="agenda-bloqueios-table">
          <colgroup>
            <col />
            <col style={{ width: 100 }} />
            <col style={{ width: 170 }} />
            <col style={{ width: 92 }} />
            <col style={{ width: 92 }} />
          </colgroup>
          <thead>
            <tr>
              <th>Unidade</th>
              <th>Dia</th>
              <th>Vigência</th>
              <th>Início</th>
              <th>Final</th>
            </tr>
          </thead>
          <tbody>
            {bloqueiosLoading ? (
              <tr>
                <td colSpan={5} className="agenda-bloqueios-empty">
                  Carregando bloqueios...
                </td>
              </tr>
            ) : null}
            {!bloqueiosLoading && bloqueiosError ? (
              <tr>
                <td colSpan={5} className="agenda-bloqueios-empty">
                  {bloqueiosError}
                </td>
              </tr>
            ) : null}
            {!bloqueiosLoading && !bloqueiosError && bloqueiosItens.length ? bloqueiosItens.map((item) => {
              const isSelected = Number(item?.id || 0) === Number(selectedId || 0);
              return (
                <tr
                  key={item.id}
                  data-id={item.id}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => setSelectedId(Number(item.id || 0) || null)}
                  onDoubleClick={() => openEdit(item)}
                >
                  <td>{String(item?.unidade || '')}</td>
                  <td>{agendaBloqueioDiaLabel(item?.dia_sem || item?.dia || 1)}</td>
                  <td>{formatVigencia(item)}</td>
                  <td>{agendaBloqueioFormatTimeForDisplay(item?.hora_ini ?? item?.inicio)}</td>
                  <td>{agendaBloqueioFormatTimeForDisplay(item?.hora_fin ?? item?.final)}</td>
                </tr>
              );
            }) : null}
            {!bloqueiosLoading && !bloqueiosError && !bloqueiosItens.length ? (
              <tr>
                <td colSpan={5} className="agenda-bloqueios-empty">
                  Nenhum bloqueio cadastrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="agenda-bloqueios-hint">
        <Typography.Text type="secondary">A lista da aba Bloqueios vem do cadastro operacional da Agenda.</Typography.Text>
      </div>

      <AgendaBloqueioModal
        open={modalOpen}
        mode={modalMode}
        record={modalRecord}
        unidadeOptions={unidadeOptions}
        loadingUnidades={loadingUnidades}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmBlock}
      />

      <BranaModal
        open={deleteConfirmOpen}
        title="Elimina bloqueio"
        centered
        width={420}
        destroyOnClose
        maskClosable={false}
        keyboard
        onCancel={() => setDeleteConfirmOpen(false)}
        footer={null}
        className="agenda-bloqueio-delete-modal"
      >
        <div className="agenda-bloqueio-delete-confirm">
          <Typography.Text>
            Deseja eliminar este bloqueio?
          </Typography.Text>
        <div className="agenda-bloqueio-delete-footer">
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancela</Button>
            <Button danger type="primary" loading={deleting} disabled={deleting} onClick={confirmDelete}>
              Elimina
            </Button>
          </div>
        </div>
      </BranaModal>
    </div>
  );
}
