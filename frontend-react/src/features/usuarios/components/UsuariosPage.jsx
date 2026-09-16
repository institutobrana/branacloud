import { Alert, Button, Empty, Input, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { AdminModuleShell } from '../../admin/shared/AdminModuleShell.jsx';
import { UsuariosTable } from './UsuariosTable.jsx';
import { useUsuarios } from '../hooks/useUsuarios.js';
import { UserFormModal } from './UserFormModal.jsx';
import { UserPermissionsModal } from './UserPermissionsModal.jsx';
import { ProtectedModulePasswordModal } from './ProtectedModulePasswordModal.jsx';
import { atualizarAtivoUsuario, excluirUsuario } from '../services/usuariosApi.js';
import '../styles/usuarios.css';
import { isProtectedBaseAccount } from '../usuariosProtection.js';

export function UsuariosPage({ onOpenPreferences, onOpenReports }) {
  const state = useUsuarios();
  const [formMode, setFormMode] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const selected = state.rows.find((row) => Number(row.id) === Number(state.selectedUserId)) || null;
  useEffect(() => { window.dispatchEvent(new CustomEvent('brana-usuarios-toolbar-state', { detail: { hasSelection: Boolean(selected), selectedUser: selected, loading: state.loading } })); }, [selected, state.loading]);
  useEffect(() => {
    const onAction = async (event) => {
      const action = event.detail?.action;
      const target = event.detail?.selectedUser || selected;
      if (action === 'novo') setFormMode('novo');
      if (target && isProtectedBaseAccount(target) && ['editar', 'excluir', 'preferencias', 'permissoes'].includes(action)) return;
      if (action === 'editar' && target) { setEditingUser(target); setFormMode('editar'); }
      if (action === 'permissoes' && target) setPermissionsOpen(true);
      if (action === 'preferencias' && target) onOpenPreferences?.(target);
      if (action === 'impressos' && target) onOpenReports?.(target);
      if (action === 'toggle-active' && target) {
        try { await atualizarAtivoUsuario(target.id, target.ativo === false, state.password); await state.refresh(); } catch (err) { Modal.error({ title: 'Não foi possível alterar o estado', content: err?.message || 'Falha ao alterar usuário.' }); }
      }
      if (action === 'excluir' && target) {
        setDeleteTarget(target);
      }
    };
    window.addEventListener('brana-usuarios-toolbar-action', onAction);
    return () => window.removeEventListener('brana-usuarios-toolbar-action', onAction);
  }, [selected, state.password, state.refresh]);
  return <AdminModuleShell title="Usuários do sistema" className="usuarios-page">
    {state.error ? <Alert type="error" showIcon message={state.error} /> : null}
    {!state.loading && !state.error && !state.rows.length ? <Empty description="Nenhum usuário encontrado" /> : <UsuariosTable rows={state.rows} loading={state.loading} selectedUserId={state.selectedUserId} onSelect={(id) => { const next = state.rows.find((row) => Number(row.id) === Number(id)) || null; state.setSelectedUserId(id); window.dispatchEvent(new CustomEvent('brana-usuarios-toolbar-state', { detail: { hasSelection: Boolean(id), selectedUser: next, loading: state.loading } })); }} onDoubleClick={(row) => { state.setSelectedUserId(row.id); setEditingUser(row); setFormMode('editar'); window.dispatchEvent(new CustomEvent('brana-usuarios-toolbar-state', { detail: { hasSelection: true, selectedUser: row, loading: state.loading } })); }} />}
    <UserFormModal open={Boolean(formMode)} mode={formMode} user={formMode === 'editar' ? editingUser : selected} password={state.password} onCancel={() => { setFormMode(null); setEditingUser(null); }} onSaved={async () => { setFormMode(null); setEditingUser(null); await state.refresh(); }} />
    <UserPermissionsModal open={permissionsOpen} user={selected} password={state.password} onCancel={() => setPermissionsOpen(false)} />
    <Modal open={Boolean(deleteTarget)} title="Excluir usuário" okText="Excluir" okType="danger" cancelText="Cancelar" confirmLoading={deleteLoading} onCancel={() => setDeleteTarget(null)} onOk={async () => { if (!deleteTarget) return; setDeleteLoading(true); try { await excluirUsuario(deleteTarget.id, state.password); setDeleteTarget(null); await state.refresh(); } catch (err) { Modal.error({ title: 'Não foi possível excluir', content: err?.message || 'Este usuário não pode ser excluído.' }); } finally { setDeleteLoading(false); } }} destroyOnClose>
      <p>Excluir o usuário “{deleteTarget?.nome || ''}”?</p>
    </Modal>
    <ProtectedModulePasswordModal open={state.protectedRequired} loading={state.loading} error={Boolean(state.error)} onSubmit={async (value) => { state.setPassword(value); await state.refresh(value); }} onCancel={() => { state.setProtectedRequired(false); state.setPassword(''); }} />
  </AdminModuleShell>;
}
