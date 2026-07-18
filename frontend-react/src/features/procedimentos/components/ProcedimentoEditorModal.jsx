import { Button, Modal, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { ProcedimentoEditorActions } from './ProcedimentoEditorActions.jsx';
import { ProcedimentoCadastroPanel } from './ProcedimentoCadastroPanel.jsx';
import { ProcedimentoFinanceiroPanel } from './ProcedimentoFinanceiroPanel.jsx';
import { ProcedimentoMateriaisTable } from './ProcedimentoMateriaisTable.jsx';
import { ProcedimentoMaterialModal } from './ProcedimentoMaterialModal.jsx';
import { useProcedimentoFinanceiro } from '../hooks/useProcedimentoFinanceiro.js';
import { useProcedimentoMateriais } from '../hooks/useProcedimentoMateriais.js';
import { parseMoneyInput } from '../procedimentosEditorMappers.js';
import { PROCEDIMENTO_EDITOR_MODE } from '../procedimentosEditorConstants.js';

export function ProcedimentoEditorModal({
  open,
  mode,
  loading,
  saving,
  error,
  form,
  especialidadeOptions,
  procedimentoGenericoOptions,
  simboloOptions,
  onChangeField,
  onSave,
  onClose,
  onMaterialsMutated,
}) {
  const [materialsRefreshKey, setMaterialsRefreshKey] = useState(0);
  const [unlinkConfirmOpen, setUnlinkConfirmOpen] = useState(false);
  const [unlinkConfirmItem, setUnlinkConfirmItem] = useState(null);
  const materiaisHook = useProcedimentoMateriais({
    procedimentoId: form?.id || null,
    open,
    onMutate: () => {
      setMaterialsRefreshKey((current) => current + 1);
      onMaterialsMutated?.();
    },
  });
  const financePreviewPayload = useMemo(
    () => ({
      procedimento_id: form?.id || null,
      tabela_id: form?.tabela_id || null,
      procedimento_generico_id: form?.procedimento_generico_id || null,
      preco: parseMoneyInput(form?.valor_paciente),
      tempo: Number(form?.tempo || 0) || 0,
      custo_lab: parseMoneyInput(form?.custo_lab),
      custo: 0,
      materiais: (materiaisHook.state.items || []).map((item) => ({
        material_id: Number(item?.material_id || 0) || 0,
        quantidade: Number(item?.quantidade || 0) || 0,
        custo_und: Number(item?.custo_und || 0) || 0,
      })),
    }),
    [
      form?.custo_lab,
      form?.id,
      form?.procedimento_generico_id,
      form?.tabela_id,
      form?.tempo,
      form?.valor_paciente,
      materiaisHook.state.items,
    ],
  );
  const [financeiroState] = useProcedimentoFinanceiro({
    procedimentoId: form?.id || null,
    open,
    refreshKey: materialsRefreshKey,
    previewPayload: financePreviewPayload,
  });
  const title = mode === PROCEDIMENTO_EDITOR_MODE.EDIT ? 'Altera intervenção' : 'Nova intervenção';

  useEffect(() => {
    if (!open) {
      materiaisHook.actions.closeEditor();
      setUnlinkConfirmOpen(false);
      setUnlinkConfirmItem(null);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      title={title}
      width={1120}
      centered
      onCancel={onClose}
      footer={null}
      className="procedimento-editor-modal"
      destroyOnClose={false}
      maskClosable={false}
    >
      <div className="procedimento-editor-shell">
        {error ? (
          <div className="procedimento-editor-header">
            <Typography.Text type="danger">{error}</Typography.Text>
          </div>
        ) : null}

        <ProcedimentoEditorActions
          canClose={!saving}
          canSave={!loading && !saving}
          canLink={!!form?.id && !loading && !saving}
          canUnlink={!!form?.id && !!materiaisHook.state.selectedItem && !loading && !saving}
          onClose={onClose}
          onSave={onSave}
          onLink={() => materiaisHook.actions.openEditor({ mode: 'new' })}
          onUnlink={() => {
            const selectedItem = materiaisHook.state.selectedItem;
            if (!selectedItem) return;
            setUnlinkConfirmItem(selectedItem);
            setUnlinkConfirmOpen(true);
          }}
        />

        <div className="procedimento-editor-panels">
          <ProcedimentoCadastroPanel
            form={form}
            loading={loading}
            especialidadeOptions={especialidadeOptions}
            procedimentoGenericoOptions={procedimentoGenericoOptions}
            simboloOptions={simboloOptions}
            onChange={onChangeField}
          />
          <ProcedimentoFinanceiroPanel
            loading={financeiroState.loading}
            error={financeiroState.error}
            item={financeiroState.item}
            empty={!financeiroState.item}
          />
        </div>

        <ProcedimentoMateriaisTable
          loading={materiaisHook.state.loading}
          error={materiaisHook.state.error}
          items={materiaisHook.state.items}
          selectedCodigo={materiaisHook.state.selectedCodigo}
          totalMateriais={materiaisHook.state.total_materiais}
          totalCustoUnd={materiaisHook.state.total_custo_und}
          totalCusto={materiaisHook.state.total_custo}
          onSelect={materiaisHook.actions.selectItem}
          onDoubleClick={(item) => {
            if (!item) return;
            materiaisHook.actions.openEditor({ mode: 'edit', vinculo: item });
          }}
        />
      </div>

      <ProcedimentoMaterialModal
        open={materiaisHook.state.editor.open}
        loading={materiaisHook.state.editor.loading}
        saving={materiaisHook.state.editor.saving}
        error={materiaisHook.state.editor.error}
        mode={materiaisHook.state.editor.mode}
        listas={materiaisHook.state.catalog.listas}
        materiais={materiaisHook.materiaisFiltrados}
        form={materiaisHook.state.editor}
        onClose={materiaisHook.actions.closeEditor}
        onSave={() => void materiaisHook.actions.saveEditor()}
        onChangeField={(field, value) => {
          if (field === 'listaId') {
            materiaisHook.actions.updateEditorField('listaId', value || null);
            void materiaisHook.actions.reloadMaterialList(value || null);
            return;
          }

          if (field === 'busca') {
            materiaisHook.actions.updateEditorField(field, value);
            return;
          }

          materiaisHook.actions.updateEditorField(field, value);
        }}
        onMaterialChange={(value) => {
          const material = (materiaisHook.state.catalog.materiais || []).find((item) => Number(item.id || 0) === Number(value || 0)) || null;
          materiaisHook.actions.updateEditorField('materialId', value || null);
          materiaisHook.actions.syncEditorWithMaterial(material);
        }}
      />

      <Modal
        open={unlinkConfirmOpen}
        title="Desvincular material"
        centered
        onCancel={() => {
          setUnlinkConfirmOpen(false);
          setUnlinkConfirmItem(null);
        }}
        footer={[
          <Button
            key="no"
            onClick={() => {
              setUnlinkConfirmOpen(false);
              setUnlinkConfirmItem(null);
            }}
          >
            Não
          </Button>,
          <Button
            key="yes"
            type="primary"
            danger
            autoFocus
            onClick={async () => {
              const ok = await materiaisHook.actions.deleteSelected();
              setUnlinkConfirmOpen(false);
              setUnlinkConfirmItem(null);
              if (ok) {
                message.success('Material desvinculado com sucesso.');
              } else {
                message.error(materiaisHook.state.error || 'Falha ao desvincular material.');
              }
            }}
          >
            Sim
          </Button>,
        ]}
        width={520}
        destroyOnClose={false}
        maskClosable={false}
        className="procedimento-unlink-confirm-modal"
      >
        <Typography.Text>
          {`Tem certeza que deseja desvincular “${String(unlinkConfirmItem?.nome || unlinkConfirmItem?.codigo || '').trim()}” do procedimento?`}
        </Typography.Text>
      </Modal>
    </Modal>
  );
}
