import { useState } from 'react';
import { Button, Input } from 'antd';
import { BranaModal } from '../../../components/BranaModal.jsx';

export function EditorTextosSignPdfDialog({ open, loading = false, error = '', onCancel, onSign }) {
  const [certificate, setCertificate] = useState(null);
  const [password, setPassword] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (certificate && password) onSign?.({ certificate, password });
  };

  return <BranaModal open={open} title="Assinar PDF" onCancel={onCancel} footer={null} width={460} centered maskClosable={false} destroyOnHidden>
    <form className="editor-textos-sign-pdf-form" onSubmit={submit}>
      <p>O PDF será gerado a partir do conteúdo atual do Oasis e enviado ao serviço Brana para assinatura PAdES. O documento-fonte não será alterado.</p>
      <label>Certificado digital (.pfx ou .p12)
        <input type="file" accept=".pfx,.p12,application/x-pkcs12" onChange={(event) => setCertificate(event.target.files?.[0] || null)} required />
      </label>
      <label>Senha do certificado
        <Input.Password autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {error && <div role="alert" className="editor-textos-dialog-error">{error}</div>}
      <div className="editor-textos-dialog-actions">
        <Button htmlType="button" onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button htmlType="submit" type="primary" loading={loading} disabled={!certificate || !password}>Gerar e assinar PDF</Button>
      </div>
    </form>
  </BranaModal>;
}
