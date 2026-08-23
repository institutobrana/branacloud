import { Button, Tabs, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { BranaModal } from '../../../components/BranaModal.jsx';
import { PrestadorContatoTab } from './prestadorForm/PrestadorContatoTab.jsx';
import { PrestadorDetalhesTab } from './prestadorForm/PrestadorDetalhesTab.jsx';
import { PrestadorPrincipalTab } from './prestadorForm/PrestadorPrincipalTab.jsx';
import { PrestadorObservacoesTab } from './prestadorForm/PrestadorObservacoesTab.jsx';
import {
  buildPrestadorModalDraft,
  buildPrestadorModalPayload,
  validatePrestadorModalDraft,
} from './prestadorForm/prestadorModalState.js';
import { createPrestador, updatePrestador } from '../prestadoresApi.js';

function TabLabel({ children }) {
  return <span className="prestadores-modal-tab-label">{children}</span>;
}

export function PrestadorModal({ open, mode = 'create', record = null, rowId = null, onCancel, onSuccess }) {
  const [draft, setDraft] = useState(() => buildPrestadorModalDraft([], null));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const validation = useMemo(() => validatePrestadorModalDraft(draft), [draft]);
  const payload = useMemo(() => buildPrestadorModalPayload(draft, { mode }), [draft, mode]);
  const canSubmit = validation.isValid && !submitting;

  useEffect(() => {
    if (!open) return;
    setDraft(buildPrestadorModalDraft([], record));
    setSubmitting(false);
    setSubmitError('');
  }, [open, record, mode]);

  const updateDraft = (patch) => {
    setDraft((current) => ({
      ...current,
      ...(typeof patch === 'function' ? patch(current) : patch),
    }));
  };

  const handleCancel = () => {
    if (submitting) return;
    setDraft(buildPrestadorModalDraft([], record));
    setSubmitting(false);
    setSubmitError('');
    onCancel?.();
  };

  const handleSubmit = async () => {
    if (!validation.isValid || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const submitPayload = mode === 'edit'
        ? { ...payload, alteracao: new Date().toLocaleDateString('pt-BR') }
        : { ...payload };
      if (mode === 'edit') {
        await updatePrestador(rowId ?? record?.row_id ?? record?.id, submitPayload);
      } else {
        const { codigo: _ignoredCodigo, ...createPayload } = submitPayload;
        await createPrestador(createPayload);
      }
      await onSuccess?.(submitPayload);
      setDraft(buildPrestadorModalDraft([], mode === 'edit' ? record : null));
      onCancel?.();
      message.success(mode === 'edit' ? 'Prestador alterado com sucesso.' : 'Prestador criado com sucesso.');
    } catch (error) {
      const nextError = error?.message || 'Falha ao criar prestador.';
      setSubmitError(nextError);
      message.error(nextError);
    } finally {
      setSubmitting(false);
    }
  };

  const tabItems = [
    {
      key: 'principal',
      label: <TabLabel>Principal</TabLabel>,
      children: <PrestadorPrincipalTab draft={draft} updateDraft={updateDraft} />,
    },
    {
      key: 'contato',
      label: <TabLabel>Contato</TabLabel>,
      children: <PrestadorContatoTab draft={draft} updateDraft={updateDraft} />,
    },
    {
      key: 'detalhes',
      label: <TabLabel>Detalhes</TabLabel>,
      children: <PrestadorDetalhesTab draft={draft} updateDraft={updateDraft} />,
    },
    {
      key: 'observacoes',
      label: <TabLabel>Observações</TabLabel>,
      children: <PrestadorObservacoesTab draft={draft} updateDraft={updateDraft} />,
    },
  ];

  return (
    <BranaModal
      open={open}
      title={mode === 'edit' ? 'Altera prestador' : 'Novo prestador'}
      onCancel={handleCancel}
      footer={null}
      width={668}
      centered
      destroyOnClose
      maskClosable={false}
      keyboard
      className="prestadores-modal"
      styles={{ body: { padding: '6px 8px 8px' } }}
    >
      <div className="prestadores-modal-shell">
        <Tabs defaultActiveKey="principal" type="card" items={tabItems} className="prestadores-modal-tabs" />
        {submitError ? <div className="prestadores-modal-error" role="alert">{submitError}</div> : null}
        <input
          type="hidden"
          data-prestadores-payload={JSON.stringify(payload)}
          data-prestadores-valid={validation.isValid ? 'true' : 'false'}
          data-prestadores-submitting={submitting ? 'true' : 'false'}
        />
        <div className="prestadores-modal-footer">
        <Button onClick={handleCancel}>Cancela</Button>
        <Button type="primary" loading={submitting} disabled={!canSubmit} onClick={handleSubmit}>
          Ok
        </Button>
        </div>
      </div>
    </BranaModal>
  );
}
