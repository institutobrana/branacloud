import { useState } from 'react';
import { Button, Input } from 'antd';
import { BranaModal } from '../../../components/BranaModal.jsx';

export function EditorTextosSignPdfDialog({ open, loading = false, error = '', success = '', devTrace = [], localEnabled = false, legacyMode = false, localConfirmation = false, showDevDiagnostics = false, devFakeEnabled = false, devWpfApprovalEnabled = false, availableCertificates = [], certificatesLoading = false, certificateError = '', authorizationEndpointsAvailable = false, localPairingAttempted = false, onCancel, onSign, onPrepareLocal, onConfirmLocal, onConsultIdentities, onDevPrepare, onDevGeometryExport, onDevBridgeCheck, onDevFake, onDevWpfApproval }) {
  const [certificate, setCertificate] = useState(null);
  const [password, setPassword] = useState('');
  const selectedCertificate = certificate;
  const unavailable = !authorizationEndpointsAvailable && !certificatesLoading && !legacyMode;
  const userError = unavailable ? '' : error;

  const submit = (event) => {
    event.preventDefault();
    if (certificate && password) onSign?.({ certificate, password });
  };

  return <BranaModal open={open} title="Assinar PDF" onCancel={onCancel} footer={null} width={460} centered maskClosable={false} destroyOnHidden>
    <form className="editor-textos-sign-pdf-form" onSubmit={submit}>
      <p>{legacyMode ? 'O PDF será enviado ao serviço Brana para assinatura PAdES com o certificado selecionado. O documento-fonte não será alterado.' : 'O PDF será preparado a partir do conteúdo atual do Oasis e assinado com o certificado instalado no Windows. O documento-fonte não será alterado.'}</p>
      {legacyMode && <>
        <label>Certificado digital (.pfx ou .p12)
          <input type="file" accept=".pfx,.p12,application/x-pkcs12" onChange={(event) => setCertificate(event.target.files?.[0] || null)} required />
        </label>
        <label>Senha do certificado
          <Input.Password autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
      </>}
      {userError && <div role="alert" className="editor-textos-dialog-error">{userError}</div>}
      {success && !userError && <div role="status" className="editor-textos-dialog-success">{success}</div>}
      {showDevDiagnostics && devTrace.length > 0 && <details><summary>Trace sanitizado da simulação</summary><pre data-testid="dev-homologation-trace">{JSON.stringify(devTrace, null, 2)}</pre></details>}
      {!legacyMode && localEnabled && <section aria-label="Escolha a identidade digital" className="editor-textos-sign-certificate">
        <strong>Escolha a identidade digital</strong>
        {!authorizationEndpointsAvailable && !certificatesLoading && <div role="alert">Assinatura digital indisponível no momento. Nenhum pareamento ou operação será iniciado.</div>}
        {authorizationEndpointsAvailable && availableCertificates.length === 0 && !certificatesLoading && !certificateError && <Button htmlType="button" onClick={onConsultIdentities} disabled={loading}>Consultar identidades deste computador</Button>}
        {certificatesLoading && <div role="status">Consultando certificados autorizados…</div>}
        {!certificatesLoading && certificateError && authorizationEndpointsAvailable && <div role="alert">{certificateError}</div>}
        {!certificatesLoading && !certificateError && authorizationEndpointsAvailable && availableCertificates.length === 0 && localPairingAttempted && <div role="status">Nenhuma identidade autorizada está disponível neste computador.</div>}
        {!certificatesLoading && !certificateError && availableCertificates.length > 0 && <>
          <div>Escolha explicitamente uma identidade antes de continuar.</div>
          <div className="editor-textos-identity-options">
            {availableCertificates.map((item) => <label key={`${item.source}:${item.bindingId}`} className="editor-textos-identity-option"><input type="radio" name="signature-identity" checked={selectedCertificate?.bindingId === item.bindingId && selectedCertificate?.source === item.source} onChange={() => setCertificate(item)} disabled={loading} /><span><strong>{item.source === 'FILE_PKCS12' ? 'Identidade em arquivo PFX/P12' : 'Certificado do Windows'}</strong><br />{item.label}{item.public?.issuer ? ` — ${item.public.issuer}` : ''}{item.public?.valid_to ? ` — válido até ${item.public.valid_to}` : ''}<br /><small>DER: {item.certificateDerSha256.slice(0, 12)}…</small>{item.source === 'FILE_PKCS12' && <><br /><small>O arquivo e sua senha, se necessária, serão solicitados na janela local depois das aprovações.</small></>}</span></label>)}
          </div>
        </>}
      </section>}
      <div className="editor-textos-dialog-actions">
        <Button htmlType="button" onClick={onCancel} disabled={loading}>Cancelar</Button>
        {!legacyMode && localEnabled && <>
          {!localConfirmation && <Button htmlType="button" data-testid="sign-with-windows-certificate" type="primary" onClick={() => onPrepareLocal?.(selectedCertificate)} disabled={loading || !authorizationEndpointsAvailable || !selectedCertificate}>Assinar PDF</Button>}
          {localConfirmation && <>
            <label>Senha individual Brana
              <Input.Password autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} />
            </label>
            <Button htmlType="button" type="primary" onClick={() => { const value = password; setPassword(''); onConfirmLocal?.({ password: value }); }} disabled={loading || !password}>Confirmar assinatura</Button>
          </>}
        </>}
        {showDevDiagnostics && devWpfApprovalEnabled && <Button htmlType="button" onClick={onDevBridgeCheck} disabled={loading}>Testar conexão com bridge (dev)</Button>}
        {showDevDiagnostics && devWpfApprovalEnabled && <Button htmlType="button" onClick={onDevGeometryExport} disabled={loading}>Exportar diagnóstico de geometria (sem preparar)</Button>}
        {showDevDiagnostics && devWpfApprovalEnabled && <Button htmlType="button" onClick={onDevPrepare} disabled={loading}>Preparar PDF + geometria (dev, sem pairing)</Button>}
        {showDevDiagnostics && devFakeEnabled && <Button htmlType="button" onClick={onDevFake} disabled={loading}>Homologar bridge fake (dev)</Button>}
        {showDevDiagnostics && devWpfApprovalEnabled && <Button htmlType="button" onClick={onDevWpfApproval} disabled={loading}>Aprovar via WPF (dev, sem assinar)</Button>}
        {legacyMode && <Button htmlType="submit" type="primary" loading={loading} disabled={!certificate || !password}>Gerar e assinar PDF</Button>}
      </div>
    </form>
  </BranaModal>;
}
