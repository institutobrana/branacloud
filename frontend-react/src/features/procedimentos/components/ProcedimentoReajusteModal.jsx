import { useEffect, useState } from 'react';
import { Alert, Button, Form, Input, Select, Space, Table, Typography } from 'antd';
import { BranaModal } from '../../../components/BranaModal.jsx';

export function reajustePreviewKey(form) {
  return `${form.tabela_id}|${form.modo}|${String(form.percentual).trim()}`;
}

export function ProcedimentoReajusteModal({ open, form, tabelas, preview, loading, saving, error, onChange, onPreview, onApply, onClose }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const validPreview = Boolean(preview && preview.key === reajustePreviewKey(form));
  useEffect(() => { setConfirmOpen(false); }, [open, form.tabela_id, form.modo, form.percentual, preview]);
  const busy = loading || saving;
  const money = (value) => value == null ? '—' : Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const columns = [
    { title: 'Código', dataIndex: 'codigo', width: 70 }, { title: 'Nome', dataIndex: 'nome', width: 230 },
    { title: 'Preço antes', dataIndex: 'preco_before', render: money, align: 'right', width: 105 }, { title: 'Preço depois', dataIndex: 'preco_after', render: money, align: 'right', width: 105 },
    { title: 'Repasse antes', dataIndex: 'valor_repasse_before', render: money, align: 'right', width: 105 }, { title: 'Repasse depois', dataIndex: 'valor_repasse_after', render: money, align: 'right', width: 105 },
  ];
  const tabela = tabelas.find((item) => item.id === form.tabela_id);
  return (
    <>
      <BranaModal open={open} title="Reajustar tabela" onCancel={onClose} closable={!busy} maskClosable={false} footer={null} width={validPreview ? 800 : 480} centered
        className="procedimento-operacao-modal procedimento-reajuste-modal">
        {error ? <Alert type="error" message={error} showIcon /> : null}
        <Form layout="vertical" disabled={busy} size="small">
          <div className="procedimento-reajuste-inline-fields">
            <Form.Item label="Tabela"><Select aria-label="Tabela do reajuste" value={form.tabela_id} onChange={(value) => onChange('tabela_id', value)}
              options={tabelas.map((item) => ({ value: item.id, label: item.nome, disabled: item.inativo }))} /></Form.Item>
            <Form.Item label="Percentual"><Input aria-label="Percentual" value={form.percentual} onChange={(event) => onChange('percentual', event.target.value)} /></Form.Item>
          </div>
          <Form.Item label="Modo" className="procedimento-reajuste-mode"><Select aria-label="Modo" value={form.modo} onChange={(value) => onChange('modo', value)}
            options={[{ value: 'aumentar', label: 'Aumentar preços em' }, { value: 'diminuir', label: 'Diminuir preços em' }]} /></Form.Item>
        </Form>
        {validPreview ? <>
          <Typography.Paragraph className="procedimento-reajuste-summary">Total: {preview.data.total} — amostra: {preview.data.amostra.length}</Typography.Paragraph>
          <Table className="procedimento-reajuste-preview" rowKey="id" columns={columns} dataSource={preview.data.amostra} pagination={false} size="small" scroll={{ y: 240, x: 720 }} />
        </> : <Typography.Paragraph className="procedimento-reajuste-summary">Informe o percentual e clique em Preview.</Typography.Paragraph>}
        <Space className="procedimento-operacao-actions" wrap>
          <Button loading={loading} disabled={busy} onClick={onPreview}>Preview</Button>
          <Button type="primary" disabled={!validPreview || !tabela || tabela.inativo || busy || !preview.data.total} onClick={() => setConfirmOpen(true)}>Aplicar</Button>
          <Button disabled={busy} onClick={onClose}>Cancela</Button>
        </Space>
      </BranaModal>
      <BranaModal open={open && confirmOpen && validPreview} title="Confirmar reajuste" maskClosable={false} closable={!saving}
        onCancel={() => setConfirmOpen(false)} onOk={() => { if (validPreview && !busy) void onApply(); }} confirmLoading={saving}
        okText="Sim, aplicar" cancelText="Não" cancelButtonProps={{ disabled: saving }}>
        <Typography.Paragraph>Esta ação altera preços e repasses da tabela “{tabela?.nome}”. Deseja continuar?</Typography.Paragraph>
      </BranaModal>
    </>
  );
}
