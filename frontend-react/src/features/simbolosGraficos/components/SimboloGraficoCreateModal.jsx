import { useEffect, useMemo, useState } from 'react';
import { Alert, Radio, Select, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { BranaModal } from '../../../components/BranaModal.jsx';
import { SIMBOLO_GRAFICO_MARCACAO_OPTIONS } from '../model/simboloGraficoMarcacaoOptions.js';
import { mapSimboloGraficoCreatePayload } from '../model/simboloGraficoCreateMapper.js';
import { useCreateSimboloGrafico } from '../hooks/useCreateSimboloGrafico.js';
import { useUpdateSimboloGrafico } from '../hooks/useUpdateSimboloGrafico.js';
import { useSimboloGraficoCatalogs } from '../hooks/useSimboloGraficoCatalogs.js';
import { SimboloGraficoPixelEditor } from './SimboloGraficoPixelEditor.jsx';
import { SimboloGraficoEspecialidadeField } from './SimboloGraficoEspecialidadeField.jsx';
import { SimboloGraficoLibrary } from './SimboloGraficoLibrary.jsx';
import { normalizeAssetUrl } from '../model/simboloGraficoLibraryMapper.js';
import { createSimboloGraficoCreateInitialState } from '../model/simboloGraficoCreateInitialState.js';

function FieldLabel({ children }) {
  return <Typography.Text className="simbolos-graficos-create-label">{children}</Typography.Text>;
}

function FieldRow({ label, children, className = '' }) {
  return (
    <div className={`simbolos-graficos-create-field ${className}`.trim()}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

function FieldError({ message, id }) {
  return message ? <span id={id} className="simbolos-graficos-create-error" role="alert">{message}</span> : null;
}

function DrawingPreview({ item }) {
  const imageUrl = normalizeAssetUrl(item?.imageUrl || '');
  const imageAlt = String(item?.imageAlt || 'Desenho').trim();

  if (!imageUrl) {
    return <div className="simbolos-graficos-create-preview-empty">Sem desenho</div>;
  }

  return <img className="simbolos-graficos-create-preview-image" src={imageUrl} alt={imageAlt} />;
}

function resolveRecordPreviewImageUrl(record) {
  const directImage = normalizeAssetUrl(record?.imagemCustom || record?.imagem_custom || record?.imagemUrl || record?.imagem_url || '');
  if (directImage) return directImage;

  const bitmapName = String(record?.icone || record?.bitmap1 || record?.bitmap2 || record?.bitmap3 || record?.codigo || '').trim();
  if (bitmapName) {
    return normalizeAssetUrl(`/desktop-assets/Icones/${bitmapName}`);
  }

  return '';
}

function createInitialState() {
  return createSimboloGraficoCreateInitialState();
}

function resolveRecordName(record) {
  const descricao = String(record?.descricao ?? '').trim();
  if (descricao) {
    return descricao;
  }

  const nome = String(record?.nome ?? '').trim();
  if (nome) {
    return nome;
  }

  return '';
}

function createEditState(record) {
  const base = createSimboloGraficoCreateInitialState();
  const descricao = resolveRecordName(record);
  const especialidade = String(
    record?.especialidadeCodigo
    ?? record?.especialidade_codigo
    ?? record?.especialidade
    ?? record?.especial
    ?? '',
  ).trim();
  const formaMarcacao = Number.isFinite(Number(record?.formaMarcacao ?? record?.tipoMarca ?? record?.tipo_marca))
    ? Number(record?.formaMarcacao ?? record?.tipoMarca ?? record?.tipo_marca)
    : base.formaMarcacao;
  const imagemCustom = record?.imagemCustom || record?.imagem_custom || null;
  const bibliotecaSelecionada = record?.bibliotecaSelecionada
    || record?.biblioteca_selecionada
    || record?.codigo
    || record?.icone
    || record?.bitmap1
    || base.bibliotecaSelecionada;
  const bibliotecaSelecionadaId = record?.bibliotecaSelecionadaId
    ?? record?.biblioteca_selecionada_id
    ?? record?.id
    ?? base.bibliotecaSelecionadaId;
  return {
    ...base,
    nome: descricao,
    descricao,
    especialidade,
    formaMarcacao,
    tipoSimbolo: 1,
    desenho: String(record?.desenho ?? record?.imagemUrl ?? record?.imagem_url ?? imagemCustom ?? '').trim() || null,
    bibliotecaSelecionada,
    bibliotecaSelecionadaId,
    imagemCustom,
  };
}

function resolveEditorInitialValues(values, selectedLibraryItem, resolvedPreviewImageUrl) {
  const selectedName = String(
    selectedLibraryItem?.nome
    || selectedLibraryItem?.descricao
    || selectedLibraryItem?.imageAlt
    || selectedLibraryItem?.code
    || selectedLibraryItem?.codigo
    || selectedLibraryItem?.fileName
    || '',
  ).trim();
  const selectedSpecialty = String(
    selectedLibraryItem?.especialidadeCodigo
    ?? selectedLibraryItem?.especialidade_codigo
    ?? selectedLibraryItem?.especialidade
    ?? '',
  ).trim();
  const selectedMarking = Number.isFinite(Number(selectedLibraryItem?.formaMarcacao ?? selectedLibraryItem?.tipoMarca ?? selectedLibraryItem?.tipo_marca))
    ? Number(selectedLibraryItem?.formaMarcacao ?? selectedLibraryItem?.tipoMarca ?? selectedLibraryItem?.tipo_marca)
    : null;

  return {
    nome: selectedName || String(values.nome || '').trim(),
    especialidade: selectedSpecialty || String(values.especialidade || '').trim(),
    formaMarcacao: selectedMarking ?? values.formaMarcacao ?? null,
    initialImage: resolvedPreviewImageUrl || null,
    selectedLibraryItem,
  };
}

function resolveCatalogSelection(values, biblioteca) {
  const selected = Array.isArray(biblioteca)
    ? biblioteca.find((item) => {
      const candidate = values?.bibliotecaSelecionada;
      const candidateId = String(candidate?.id || values?.bibliotecaSelecionadaId || '').trim();
      const candidateCode = String(candidate?.code || candidate?.codigo || candidate?.fileName || '').trim();
      return String(item.id || '').trim() === candidateId
        || String(item.code || item.codigo || item.fileName || '').trim() === candidateCode;
    })
    : null;
  return selected || values?.bibliotecaSelecionada || null;
}

export function SimboloGraficoCreateModal({ open, mode = 'create', record = null, onCancel, onCreated, onUpdated }) {
  const {
    especialidades,
    loadingEspecialidades,
    especialidadesError,
    especialidadesEmpty,
    biblioteca,
    bibliotecaLoading,
    bibliotecaError,
    bibliotecaEmpty,
  } = useSimboloGraficoCatalogs();
  const createFlow = useCreateSimboloGrafico();
  const updateFlow = useUpdateSimboloGrafico();
  const flow = mode === 'edit' ? updateFlow : createFlow;
  const isEditMode = mode === 'edit';
  const isCreateMode = !isEditMode;
  const [values, setValues] = useState(() => (mode === 'edit' ? createEditState(record) : createInitialState()));
  const [selectedId, setSelectedId] = useState(null);
  const [nomeTouched, setNomeTouched] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    flow.reset();
    const next = mode === 'edit' ? createEditState(record) : createInitialState();
    setValues(next);
    setSelectedId(next.bibliotecaSelecionada?.id ?? null);
    setNomeTouched(false);
    setEditorOpen(false);
    setRemoveConfirmOpen(false);
  }, [mode, open, record, flow.reset]);

  useEffect(() => {
    if (!open || loadingEspecialidades) return;
    if (!values.especialidade && especialidades.some((item) => item.value === '01')) {
      setValues((current) => ({ ...current, especialidade: '01' }));
    }
  }, [open, loadingEspecialidades, especialidades, values.especialidade]);

  const selectedLibraryItem = useMemo(
    () => resolveCatalogSelection({ bibliotecaSelecionada: values.bibliotecaSelecionada, bibliotecaSelecionadaId: selectedId }, biblioteca),
    [biblioteca, selectedId, values.bibliotecaSelecionada],
  );
  const resolvedPreviewImageUrl = normalizeAssetUrl(values.imagemCustom || selectedLibraryItem?.imageUrl || resolveRecordPreviewImageUrl(record));
  const editorInitialValues = useMemo(
    () => resolveEditorInitialValues(values, selectedLibraryItem, resolvedPreviewImageUrl),
    [resolvedPreviewImageUrl, selectedLibraryItem, values],
  );
  const currentPreviewItem = resolvedPreviewImageUrl
    ? { imageUrl: resolvedPreviewImageUrl, imageAlt: values.descricao || 'Desenho' }
    : selectedLibraryItem;
  const editorInitialImage = resolvedPreviewImageUrl;
  const hasCurrentDrawing = Boolean(values.imagemCustom || selectedLibraryItem);
  const canChooseUserDefined = isCreateMode;
  const canUseLibrary = isCreateMode;
  const canEditDrawing = isCreateMode;
  const canRemoveDrawing = isCreateMode;
  const drawingFileName = values.imagemCustom
    ? ''
    : String(selectedLibraryItem?.fileName || '').trim();
  const drawingLogicalName = values.imagemCustom
    ? ''
    : String(selectedLibraryItem?.code || selectedLibraryItem?.codigo || '').trim();
  const removeDialogTitle = 'Edita símbolo gráfico';
  const removeDialogMessage = drawingFileName
    ? `Deseja eliminar o arquivo ${drawingFileName} do disco ?`
    : drawingLogicalName
      ? `Deseja eliminar o arquivo ${drawingLogicalName} do disco ?`
    : 'Deseja eliminar o arquivo associado a este símbolo do disco ?';
  const nomeNormalizado = String(values.nome || '').trim();
  const nomeError = nomeTouched && !nomeNormalizado ? 'Informe o nome do símbolo.' : '';
  const nomeValido = nomeNormalizado.length > 0 && nomeNormalizado.length <= 120;
  const especialidadeValida = Array.isArray(especialidades)
    && especialidades.some((item) => String(item?.value ?? '') === String(values.especialidade ?? ''));
  const formaValida = Number.isFinite(Number(values.formaMarcacao))
    && Number(values.formaMarcacao) >= 1
    && Number(values.formaMarcacao) <= 6;
  const isFormValid = nomeValido && especialidadeValida && formaValida;
  const modalTitle = isEditMode ? 'Altera símbolo gráfico' : 'Novo símbolo gráfico';
  const okLabel = flow.submitting ? 'Salvando...' : 'Ok';

  const handleSelectLibraryItem = (item) => {
    if (!canUseLibrary) return;
    setSelectedId(item.id);
    setValues((current) => ({ ...current, bibliotecaSelecionada: item }));
  };

  const handleRequestRemoveDrawing = () => {
    if (!isCreateMode || !hasCurrentDrawing) return;
    setRemoveConfirmOpen(true);
  };

  const handleCancelRemoveDrawing = () => {
    setRemoveConfirmOpen(false);
  };

  const handleConfirmRemoveDrawing = () => {
    if (!isCreateMode || !hasCurrentDrawing) return;
    const removeSelectedLibrary = !values.imagemCustom;
    setValues((current) => ({
      ...current,
      imagemCustom: null,
      bibliotecaSelecionada: removeSelectedLibrary ? null : current.bibliotecaSelecionada,
    }));
    if (removeSelectedLibrary) {
      setSelectedId(null);
    }
    setRemoveConfirmOpen(false);
  };

  const handleCancel = () => {
    flow.cancel();
    setValues(mode === 'edit' ? createEditState(record) : createInitialState());
    setSelectedId(null);
    setNomeTouched(false);
    setEditorOpen(false);
    setRemoveConfirmOpen(false);
    onCancel?.();
  };

  const handleEditorConfirm = (imageDataUrl) => {
    if (!isCreateMode) return;
    setValues((current) => ({ ...current, imagemCustom: imageDataUrl || null }));
    setEditorOpen(false);
  };

  const handleOkClick = async (event) => {
    event?.preventDefault?.();
    if (!isFormValid) return;

    const payload = mapSimboloGraficoCreatePayload(values, { especialidades, biblioteca });
    if (!payload) return;

    const selected = resolveCatalogSelection({ bibliotecaSelecionada: values.bibliotecaSelecionada, bibliotecaSelecionadaId: selectedId }, biblioteca);
    const customImage = String(values.imagemCustom || '').trim();
    if (selected) {
      payload.codigo = selected.fileName || selected.code || selected.codigo || payload.codigo;
      payload.imagem_custom = customImage || payload.imagem_custom || selected.imageUrl || null;
      payload.bibliotecaSelecionadaId = selected.id ?? payload.bibliotecaSelecionadaId;
      payload.bibliotecaSelecionada = selected.code ?? selected.codigo ?? payload.bibliotecaSelecionada;
    } else if (customImage) {
      payload.imagem_custom = customImage;
    }

    const result = isEditMode
      ? await flow.submit(record?.id, payload)
      : await flow.submit(payload);
    if (result?.ok) {
      if (isEditMode) {
        onUpdated?.(result.data || null);
      } else {
        onCreated?.(result.data || null);
      }
      handleCancel();
    }
  };

  return (
    <BranaModal
      open={open}
      title={modalTitle}
      centered
      width={470}
      destroyOnClose
      maskClosable
      keyboard
      onCancel={handleCancel}
      footer={null}
      className="simbolos-graficos-create-modal"
    >
      <div className="simbolos-graficos-create-shell">
        <style>{`
          .simbolos-graficos-create-modal .ant-modal-content { background: var(--brana-surface-modal); display: flex; flex-direction: column; max-height: calc(100vh - 32px); overflow: hidden; }
          .simbolos-graficos-create-modal .ant-modal-body { flex: 1 1 auto; min-height: 0; overflow: auto; }
          .simbolos-graficos-create-shell { display: flex; flex-direction: column; gap: 12px; color: var(--brana-text-primary); min-height: 0; }
          .simbolos-graficos-create-top { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(180px, 1fr); gap: 12px; align-items: start; }
          .simbolos-graficos-create-panel { border: 1px solid var(--brana-border-subtle); background: var(--brana-surface-panel); min-height: 100%; }
          .simbolos-graficos-create-left { padding: 12px 10px 10px; display: grid; gap: 10px; min-height: 0; }
          .simbolos-graficos-create-right { padding: 12px 10px 10px; display: flex; flex-direction: column; gap: 8px; min-height: 0; }
          .simbolos-graficos-create-field { display: grid; gap: 2px; }
          .simbolos-graficos-create-label { font-size: 12px; color: var(--brana-text-primary); }
          .simbolos-graficos-create-error { font-size: 11px; line-height: 1.2; color: #c0392b; }
          .simbolos-graficos-create-input, .simbolos-graficos-create-select { width: 100%; }
          .simbolos-graficos-create-preview-shell { display: flex; align-items: flex-start; gap: 10px; }
          .simbolos-graficos-create-preview { width: 72px; height: 72px; border: 1px solid var(--brana-border-default); background: var(--brana-surface-card); display: grid; place-items: center; overflow: hidden; }
          .simbolos-graficos-create-preview-image { width: 100%; height: 100%; object-fit: contain; }
          .simbolos-graficos-create-preview-empty { color: var(--brana-text-secondary); font-size: 11px; text-align: center; padding: 6px; }
          .simbolos-graficos-create-footer { display: flex; justify-content: flex-end; align-items: center; gap: 8px; width: 100%; box-sizing: border-box; margin-top: 0; padding-top: 12px; border-top: 1px solid var(--brana-divider); }
          .simbolos-graficos-create-radio { display: grid; gap: 6px; padding-top: 2px; }
          .simbolos-graficos-create-right-title { font-size: 12px; color: var(--brana-text-primary); font-weight: 400; }
          .simbolos-graficos-create-drawing-row { display: flex; align-items: flex-start; gap: 10px; }
          .simbolos-graficos-create-drawing-buttons { display: grid; gap: 8px; padding-top: 2px; }
          .simbolos-graficos-create-icon-btn { width: 38px; height: 34px; border: 1px solid var(--brana-control-border); background: var(--brana-control-background); color: var(--brana-text-primary); display: grid; place-items: center; padding: 0; border-radius: 6px; }
          .simbolos-graficos-create-icon-wrap { display: inline-flex; }
          .simbolos-graficos-create-icon-btn:disabled { opacity: 0.7; color: var(--brana-text-secondary); background: var(--brana-surface-disabled); }
          .simbolos-graficos-create-ok, .simbolos-graficos-create-cancel { width: 100%; min-width: 0; max-width: none; height: 38px; padding: 0 10px; box-sizing: border-box; border-radius: 6px; border: 1px solid var(--brana-control-border); font-size: 12px; font-weight: 600; color: var(--brana-text-primary); background: var(--brana-surface-panel); box-shadow: none; text-align: center; }
          .simbolos-graficos-create-footer .simbolos-graficos-create-ok,
          .simbolos-graficos-create-footer .simbolos-graficos-create-cancel { width: auto; min-width: 88px; padding: 0 16px; }
          .simbolos-graficos-create-ok[disabled] { opacity: 1; color: var(--brana-text-secondary); background: var(--brana-surface-disabled); border-color: var(--brana-border-subtle); cursor: not-allowed; }
          .simbolos-graficos-create-ok.is-enabled { color: var(--brana-text-inverse); background: var(--brana-brand-primary); border-color: var(--brana-brand-primary); cursor: default; }
          .simbolos-graficos-create-ok.is-enabled:focus-visible { outline: 2px solid #5b9bd5; outline-offset: 1px; }
          .simbolos-graficos-create-submit-error { margin-top: -2px; }
          .simbolos-graficos-create-cancel:not([disabled]) { background: var(--brana-surface-panel); }
          .simbolos-graficos-create-cancel:not([disabled]):hover { background: var(--brana-surface-table-row-hover); border-color: var(--brana-control-hover); }
          .simbolos-graficos-create-cancel:not([disabled]):focus-visible { outline: 2px solid #5b9bd5; outline-offset: 1px; }
          .simbolos-graficos-create-ok:disabled { box-shadow: none; }
          .simbolos-graficos-create-modal .ant-input,
          .simbolos-graficos-create-modal .ant-select-selector,
          .simbolos-graficos-create-modal .ant-radio-inner,
          .simbolos-graficos-create-modal .ant-radio-wrapper,
          .simbolos-graficos-create-modal .ant-radio-wrapper span {
            transition: none;
          }
          [data-brana-theme='dark'] .simbolos-graficos-create-modal .ant-modal-content,
          [data-brana-theme='dark'] .simbolos-graficos-create-modal .ant-modal-header,
          [data-brana-theme='dark'] .simbolos-graficos-create-modal .ant-modal-body,
          [data-brana-theme='dark'] .simbolos-graficos-create-modal .ant-modal-footer {
            background: var(--brana-surface-modal);
            color: var(--brana-text-primary);
          }
          [data-brana-theme='dark'] .simbolos-graficos-create-panel,
          [data-brana-theme='dark'] .simbolos-graficos-create-preview,
          [data-brana-theme='dark'] .simbolos-graficos-create-icon-btn,
          [data-brana-theme='dark'] .simbolos-graficos-create-ok,
          [data-brana-theme='dark'] .simbolos-graficos-create-cancel {
            background: var(--brana-surface-panel);
            color: var(--brana-text-primary);
            border-color: var(--brana-border-subtle);
          }
          [data-brana-theme='dark'] .simbolos-graficos-create-preview-empty,
          [data-brana-theme='dark'] .simbolos-graficos-create-label,
          [data-brana-theme='dark'] .simbolos-graficos-create-right-title {
            color: var(--brana-text-primary);
          }
          [data-brana-theme='dark'] .simbolos-graficos-create-ok.is-enabled {
            background: var(--brana-brand-primary-hover);
            border-color: var(--brana-brand-primary-hover);
            color: var(--brana-text-inverse);
          }
          [data-brana-theme='dark'] .simbolos-graficos-create-ok[disabled] {
            background: var(--brana-surface-disabled);
            color: var(--brana-text-secondary);
            border-color: var(--brana-border-subtle);
          }
          [data-brana-theme='dark'] .simbolos-graficos-create-cancel:not([disabled]):hover {
            background: var(--brana-surface-table-row-hover);
            border-color: var(--brana-control-hover);
          }
          @media (max-width: 520px) {
            .simbolos-graficos-create-footer { flex-wrap: wrap; justify-content: stretch; }
            .simbolos-graficos-create-footer .simbolos-graficos-create-ok,
            .simbolos-graficos-create-footer .simbolos-graficos-create-cancel { width: 100%; }
          }
          [data-brana-theme='dark'] .simbolos-graficos-create-icon-btn:disabled {
            background: var(--brana-surface-disabled);
            color: var(--brana-text-secondary);
          }
          @media (max-width: 900px) { .simbolos-graficos-create-top { grid-template-columns: 1fr; } }
        `}</style>

        <div className="simbolos-graficos-create-top">
          <div className="simbolos-graficos-create-panel simbolos-graficos-create-left">
            {flow.submitError ? (
              <Alert className="simbolos-graficos-create-submit-error" type="error" showIcon message="Não foi possível salvar o símbolo gráfico." description={flow.submitError} />
            ) : null}

            <FieldRow label="Nome do símbolo:">
              <input className="simbolos-graficos-create-input" autoFocus value={values.nome} maxLength={120} onChange={(event) => setValues((current) => ({ ...current, nome: event.target.value }))} onBlur={() => setNomeTouched(true)} aria-invalid={nomeError ? 'true' : 'false'} aria-describedby={nomeError ? 'simbolos-graficos-create-nome-error' : undefined} />
              <FieldError message={nomeError} id="simbolos-graficos-create-nome-error" />
            </FieldRow>

            <SimboloGraficoEspecialidadeField value={values.especialidade} options={especialidades} loading={loadingEspecialidades} error={especialidadesError} empty={especialidadesEmpty} onChange={(value) => setValues((current) => ({ ...current, especialidade: value }))} />

            <FieldRow label="Forma de marcação no odontograma:">
              <Select className="simbolos-graficos-create-select" value={values.formaMarcacao ?? undefined} options={SIMBOLO_GRAFICO_MARCACAO_OPTIONS} placeholder="" onChange={(value) => setValues((current) => ({ ...current, formaMarcacao: value ?? null }))} />
            </FieldRow>

            <SimboloGraficoLibrary items={biblioteca} selectedId={selectedId} loading={bibliotecaLoading} error={bibliotecaError} empty={bibliotecaEmpty} onSelect={handleSelectLibraryItem} />
          </div>

          <div className="simbolos-graficos-create-panel simbolos-graficos-create-right">
            <div className="simbolos-graficos-create-field">
              <span className="simbolos-graficos-create-right-title">Tipo do símbolo:</span>
              <Radio.Group
                className="simbolos-graficos-create-radio"
                value={values.tipoSimbolo}
                onChange={(event) => {
                  if (isEditMode && event?.target?.value !== 1) return;
                  if (isCreateMode && event?.target?.value === 1) return;
                  setValues((current) => ({ ...current, tipoSimbolo: event.target.value }));
                }}
                options={[
                  { label: 'Sistema', value: 1, disabled: !isEditMode },
                  { label: 'Definido pelo usuário', value: 2, disabled: !canChooseUserDefined },
                ]}
              />
            </div>

            <div className="simbolos-graficos-create-field">
              <span className="simbolos-graficos-create-right-title">Desenho</span>
              <div className="simbolos-graficos-create-drawing-row">
                <div className="simbolos-graficos-create-preview" aria-label="Área de desenho">
                  <DrawingPreview item={currentPreviewItem} />
                </div>
                <div className="simbolos-graficos-create-drawing-buttons">
                  <span className="simbolos-graficos-create-icon-wrap" title="Símbolos da biblioteca do sistema não podem ser excluídos" aria-label="Excluir símbolo da biblioteca — indisponível para símbolos do sistema">
                    <button type="button" className="simbolos-graficos-create-icon-btn" aria-label="Excluir desenho" onClick={handleRequestRemoveDrawing} disabled={isEditMode}><CloseOutlined /></button>
                  </span>
                  <button type="button" className="simbolos-graficos-create-icon-btn" aria-label="Editar desenho" onClick={() => { if (isCreateMode) setEditorOpen(true); }} disabled={isEditMode}>✎</button>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="simbolos-graficos-create-footer actions">
          <button type="button" className={`auxiliary-shell-button simbolos-graficos-create-ok ${isFormValid ? 'is-enabled' : ''}`.trim()} disabled={!isFormValid || flow.submitting} onClick={handleOkClick}>{okLabel}</button>
          <button type="button" className="auxiliary-shell-button simbolos-graficos-create-cancel" onClick={handleCancel}>Cancela</button>
        </div>
      </div>
      <SimboloGraficoPixelEditor
        open={editorOpen}
        initialImage={editorInitialImage}
        initialName={editorInitialValues.nome}
        onConfirm={handleEditorConfirm}
        onCancel={() => setEditorOpen(false)}
        disabled={flow.submitting}
      />
      <BranaModal
        open={removeConfirmOpen}
        title={removeDialogTitle}
        centered
        width={420}
        destroyOnClose
        maskClosable={!flow.submitting}
        keyboard={!flow.submitting}
        onCancel={handleCancelRemoveDrawing}
        footer={null}
        className="simbolos-graficos-remove-confirm-modal"
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <Typography.Text>{removeDialogMessage}</Typography.Text>
          <div className="simbolos-graficos-create-footer actions" style={{ paddingTop: 0, borderTop: 0 }}>
            <button type="button" className="auxiliary-shell-button simbolos-graficos-create-ok" onClick={handleConfirmRemoveDrawing} disabled={flow.submitting}>
              Sim
            </button>
            <button type="button" className="auxiliary-shell-button simbolos-graficos-create-cancel" onClick={handleCancelRemoveDrawing} disabled={flow.submitting}>
              Não
            </button>
          </div>
        </div>
      </BranaModal>
    </BranaModal>
  );
}
