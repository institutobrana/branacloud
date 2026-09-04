import { useEffect, useState } from 'react';

export function EtiquetasToolbar({ hasSelection = false, onNew }) {
  const [localHasSelection, setLocalHasSelection] = useState(Boolean(hasSelection));
  useEffect(() => {
    const onSelectionChange = (event) => setLocalHasSelection(Boolean(event.detail?.hasSelection));
    window.addEventListener('brana-etiquetas-selection-change', onSelectionChange);
    return () => window.removeEventListener('brana-etiquetas-selection-change', onSelectionChange);
  }, []);
  const requestEdit = () => window.dispatchEvent(new CustomEvent('brana-etiquetas-edit-request'));
  const requestTest = () => window.dispatchEvent(new CustomEvent('brana-etiquetas-test-request'));
  const requestDelete = () => window.dispatchEvent(new CustomEvent('brana-etiquetas-delete-request'));
  return (
    <div className="etiquetas-toolbar-row" role="toolbar" aria-label="Ações do módulo Etiquetas">
      <div className="etiquetas-toolbar-actions">
        <button type="button" className="auxiliary-shell-button primary" onClick={onNew}>Novo modelo</button>
        <button type="button" className="auxiliary-shell-button" disabled={!localHasSelection} onClick={requestEdit}>Altera</button>
        <button type="button" className="auxiliary-shell-button danger" disabled={!localHasSelection} onClick={requestDelete}>Elimina</button>
        <button type="button" className="auxiliary-shell-button" disabled={!localHasSelection} onClick={requestTest}>Teste</button>
      </div>
    </div>
  );
}
