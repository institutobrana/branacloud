import { createPortal } from 'react-dom';

export function AnamnesePendingChangesDialog({ open, saving = false, error = '', onSave, onDiscard, onCancel }) {
  if (!open) return null;
  const dialog = <div className="ficha-anamnese-pending" role="dialog" aria-modal="true" aria-label="Alteracoes pendentes">
    <div className="ficha-anamnese-pending-box">
      <strong>Existem alterações pendentes na anamnese.</strong>
      <p>Deseja gravar as alterações?</p>
      {error ? <p role="alert">{error}</p> : null}
      <div className="ficha-anamnese-pending-actions">
        <button type="button" disabled={saving} onClick={onSave}>{saving ? 'Gravando...' : 'Sim'}</button>
        <button type="button" onClick={onDiscard}>Não</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  </div>;
  return typeof document === 'undefined' ? dialog : createPortal(dialog, document.body);
}
