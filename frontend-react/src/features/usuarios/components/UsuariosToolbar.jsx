import { useEffect, useState } from 'react';
import { isProtectedBaseAccount } from '../usuariosProtection.js';

export function UsuariosToolbar({ hasSelection, selectedUser, loading }) {
  const [selectionState, setSelectionState] = useState({ hasSelection, selectedUser, loading });
  useEffect(() => { const onState = (event) => setSelectionState((current) => ({ ...current, ...(event.detail || {}) })); window.addEventListener('brana-usuarios-toolbar-state', onState); return () => window.removeEventListener('brana-usuarios-toolbar-state', onState); }, []);
  const activeUser = selectionState.selectedUser || selectedUser;
  const hasActiveSelection = Boolean(selectionState.hasSelection || (typeof document !== 'undefined' && document.querySelector('.usuarios-page input[type="radio"]:checked')));
  const protectedBase = isProtectedBaseAccount(activeUser);
  const canEdit = hasActiveSelection && !protectedBase;
  const canManage = canEdit;
  const dispatch = (action) => window.dispatchEvent(new CustomEvent('brana-usuarios-toolbar-action', { detail: { action, selectedUser: selectionState.selectedUser || selectedUser } }));
  return <div className="auxiliary-action-toolbar usuarios-toolbar" role="toolbar" aria-label="Ações do módulo Usuários">
    <button type="button" className="auxiliary-shell-button primary" onClick={() => dispatch('novo')}>Novo usuário...</button>
    <button type="button" className="auxiliary-shell-button" disabled={!canEdit} onClick={() => dispatch('editar')}>Altera...</button>
    <button type="button" className="auxiliary-shell-button danger" disabled={!canManage} onClick={() => dispatch('excluir')}>Excluir</button>
    <span className="indices-financeiros-toolbar-divider" aria-hidden="true" />
    <button type="button" className="auxiliary-shell-button" disabled={!hasActiveSelection} onClick={() => dispatch('impressos')}>Impressos...</button>
    <button type="button" className="auxiliary-shell-button" disabled={!canManage} onClick={() => dispatch('preferencias')}>Preferências...</button>
    <button type="button" className="auxiliary-shell-button" disabled={!canManage} onClick={() => dispatch('permissoes')}>Permissões...</button>
  </div>;
}
