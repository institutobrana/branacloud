import { Alert, Button, Checkbox, Form, Input, Select, Space } from 'antd';
import { BranaModal } from '../../../components/BranaModal.jsx';

export function createTabelaForm(tabela = null, indices = [], tiposTiss = []) {
  return {
    nome: tabela?.nome || '',
    nro_indice: tabela?.nro_indice ?? indices.find((item) => item.sigla === 'R$')?.id ?? 255,
    fonte_pagadora: tabela?.fonte_pagadora || 'particular',
    nro_credenciamento: tabela?.nro_credenciamento || '',
    tipo_tiss_id: tabela?.tipo_tiss_id ?? tiposTiss.find((item) => item.codigo === '00')?.id ?? 1,
    inativo: Boolean(tabela?.inativo),
    copiar: false,
    copiar_de_tabela_id: null,
  };
}

export function validateTabelaForm(form, mode, tabelas) {
  if (!String(form.nome || '').trim()) return 'Informe o nome da tabela.';
  if (form.nro_indice === '' || form.nro_indice == null) return 'Informe o índice.';
  if (mode === 'new' && form.copiar && !tabelas.some((item) => item.id === form.copiar_de_tabela_id)) {
    return 'Selecione a tabela de origem para cópia.';
  }
  return '';
}

export function buildTabelaPayload(form, mode) {
  return {
    nome: String(form.nome || '').trim(),
    nro_indice: form.nro_indice,
    fonte_pagadora: form.fonte_pagadora,
    nro_credenciamento: form.fonte_pagadora === 'convenio' ? String(form.nro_credenciamento || '').trim() || null : null,
    tipo_tiss_id: form.tipo_tiss_id,
    inativo: Boolean(form.inativo),
    ...(mode === 'new' ? { copiar_de_tabela_id: form.copiar ? String(form.copiar_de_tabela_id) : null } : {}),
  };
}

export function ProcedimentoTabelaModal({ open, mode, form, indices, tiposTiss, tabelas, saving, error, onChange, onSave, onClose }) {
  const convenio = form.fonte_pagadora === 'convenio';
  return (
    <BranaModal open={open} title={mode === 'edit' ? 'Altera dados da tabela' : 'Insere nova tabela'}
      onCancel={onClose} closable={!saving} maskClosable={false} footer={null} width={400} centered
      className="procedimento-operacao-modal procedimento-tabela-modal">
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Form layout="vertical" autoComplete="off" disabled={saving} size="small">
        <Form.Item label="Nome" required><Input aria-label="Nome da tabela" value={form.nome} onChange={(event) => onChange('nome', event.target.value)} /></Form.Item>
        <div className="procedimento-tabela-inline-fields">
          <Form.Item label="Índice" required><Select aria-label="Índice" value={form.nro_indice} onChange={(value) => onChange('nro_indice', value)}
            options={indices.map((item) => ({ value: item.id, label: `${item.sigla} - ${item.nome}` }))} /></Form.Item>
          <Form.Item label="Fonte pagadora"><Select aria-label="Fonte pagadora" value={form.fonte_pagadora} onChange={(value) => onChange('fonte_pagadora', value)}
            options={[{ value: 'particular', label: 'Particular' }, { value: 'convenio', label: 'Convênio' }]} /></Form.Item>
        </div>
        <Form.Item label="Credenciamento"><Input aria-label="Credenciamento" disabled={!convenio || saving} value={form.nro_credenciamento} onChange={(event) => onChange('nro_credenciamento', event.target.value)} /></Form.Item>
        <Form.Item label="Tipo TISS"><Select aria-label="Tipo TISS" value={form.tipo_tiss_id} onChange={(value) => onChange('tipo_tiss_id', value)}
          options={tiposTiss.map((item) => ({ value: item.id, label: `${item.codigo} - ${item.nome}` }))} /></Form.Item>
        <Form.Item className="procedimento-operacao-check"><Checkbox checked={form.inativo} onChange={(event) => onChange('inativo', event.target.checked)}>Inativar tabela</Checkbox></Form.Item>
        {mode === 'new' ? <>
          <Form.Item className="procedimento-operacao-check"><Checkbox checked={form.copiar} onChange={(event) => onChange('copiar', event.target.checked)}>Copiar procedimentos de outra tabela</Checkbox></Form.Item>
          <Form.Item label="Tabela de origem"><Select aria-label="Tabela de origem" disabled={!form.copiar || saving} value={form.copiar_de_tabela_id} onChange={(value) => onChange('copiar_de_tabela_id', value)}
            options={tabelas.map((item) => ({ value: item.id, label: item.nome }))} /></Form.Item>
        </> : null}
        <Space className="procedimento-operacao-actions" wrap><Button type="primary" loading={saving} onClick={onSave}>Ok</Button><Button disabled={saving} onClick={onClose}>Cancela</Button></Space>
      </Form>
    </BranaModal>
  );
}
