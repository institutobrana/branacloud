import { useEffect, useState } from 'react';
import { Button, message, Modal, Tabs } from 'antd';
import { AgendaContatosPrincipalTab, EMPTY_FORM } from './AgendaContatosPrincipalTab.jsx';
import { AgendaContatosDetalhesTab } from './AgendaContatosDetalhesTab.jsx';
import { useAgendaContatosLookups } from '../hooks/useAgendaContatosLookups.js';
import { validateAgendaContatoForm } from '../utils/agendaContatosValidation.js';
import { buildAgendaContatoPayload } from '../utils/agendaContatosPayload.js';
import { createAgendaContato, updateAgendaContato } from '../api/agendaContatosApi.js';
import { agendaContatoToFormState } from '../utils/agendaContatosNormalizers.js';

export function AgendaContatosModal({ open, onClose, onCreated, onUpdated, onDelete, mode = 'new', contact = null, isDeleting = false }) {
  const [activeTab, setActiveTab] = useState('principal');
  const [form, setForm] = useState(EMPTY_FORM);
  const [validationErrors, setValidationErrors] = useState({});
  const [preparedPayload, setPreparedPayload] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const lookups = useAgendaContatosLookups(open);
  useEffect(() => {
    if (open) setActiveTab('principal');
    if (open) {
      setForm(mode === 'edit' ? agendaContatoToFormState(contact) : EMPTY_FORM);
      setValidationErrors({});
      setPreparedPayload(null);
      setIsSaving(false);
    }
  }, [open, mode, contact]);
  const updateForm = (changes) => setForm((current) => ({ ...current, ...changes }));
  const handlePrepare = async () => {
    if (isSaving) return;
    const result = validateAgendaContatoForm(form);
    setValidationErrors(result.errors);
    if (!result.valid) {
      setPreparedPayload(null);
      message.error(result.errors.nome);
      return;
    }
    const payload = buildAgendaContatoPayload(form);
    setPreparedPayload(payload);
    setIsSaving(true);
    try {
      const saved = mode === 'edit' ? await updateAgendaContato(contact.id, payload) : await createAgendaContato(payload);
      onClose();
      if (mode === 'edit') await onUpdated?.(saved);
      else await onCreated?.(saved);
    } catch (error) {
      message.error(error?.message || 'Falha ao salvar contato.');
    } finally {
      setIsSaving(false);
    }
  };
  const footer = (
    <div className="agenda-contatos-modal-footer">
      <Button danger disabled={mode !== 'edit' || isSaving || isDeleting} loading={isDeleting} onClick={() => onDelete?.(contact)}>Elimina</Button>
      <Button disabled>Imprime</Button>
      <Button type="primary" loading={isSaving} disabled={isSaving} onClick={handlePrepare}>Ok</Button>
      <Button disabled={isSaving || isDeleting} onClick={onClose}>Cancela</Button>
    </div>
  );

  return (
    <Modal
      className="agenda-contatos-modal"
      open={open}
      title={mode === 'edit' ? 'Alterar contato' : 'Novo contato'}
      width={560}
      keyboard={false}
      maskClosable
      destroyOnHidden={false}
      onCancel={isSaving ? undefined : onClose}
      footer={footer}
    >
      <Tabs
        key={`${mode}-${open ? 'open' : 'closed'}-${contact?.id || 'new'}`}
        type="card"
        animated={false}
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'principal', label: 'Principal', children: <AgendaContatosPrincipalTab form={form} lookups={lookups} onChange={updateForm} validationErrors={validationErrors} /> },
          { key: 'detalhes', label: 'Detalhes', children: <AgendaContatosDetalhesTab form={form} lookups={lookups} onChange={updateForm} /> },
        ]}
      />
    </Modal>
  );
}
