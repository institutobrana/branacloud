import { Alert, Spin, Tabs } from 'antd';
import { useEffect } from 'react';
import { BranaModal } from '../../../components/BranaModal.jsx';
import { useUserPermissions } from '../hooks/useUserPermissions.js';
import { PermissionMatrix } from './PermissionMatrix.jsx';
import { AccessProfilesTab } from './AccessProfilesTab.jsx';
import '../styles/usuarios.css';

export function UserPermissionsModal({ open, user, password, onCancel }) {
  const state = useUserPermissions(password);
  const isAdmin = Boolean(user?.is_admin);
  useEffect(() => {
    if (open && user?.id) void state.load(user.id, !isAdmin);
    else state.clear();
  }, [isAdmin, open, user?.id, state.load, state.clear]);
  const permissionUser = state.data?.user;
  const titleName = permissionUser?.nome || user?.nome || 'Usuário';
  const items = [{ key: 'access', label: 'Permissões de Acesso', children: <PermissionMatrix schema={state.data?.schema} permissions={permissionUser} saving={state.saving} onModuleLevelChange={(moduleCode, level) => state.patchModuleLevel(user?.id, moduleCode, level)} onFunctionLevelChange={(moduleCode, functionCode, level) => state.patchFunctionLevel(user?.id, moduleCode, functionCode, level)} /> }];
  if (!isAdmin) items.push({ key: 'profiles', label: 'Perfis de acesso', children: <AccessProfilesTab profiles={state.data?.profiles} userId={user?.id} saving={state.saving} onAssignmentsChange={state.patchProfileAssignments} /> });
  return <BranaModal open={open} title={`Permissões de acesso para ${titleName}`} footer={null} onCancel={() => { state.cancelPendingWrites(); onCancel?.(); }} destroyOnClose width={620} centered className="config-preferencias-modal usuarios-permission-modal" styles={{ body: { padding: '3px 5px 4px' } }}>
    {state.loading ? <div className="usuarios-permission-loading"><Spin tip="Carregando permissões..." /></div> : null}
    {state.error ? <Alert type="error" showIcon message={state.error} /> : null}
    {!state.loading && !state.error && state.data ? <Tabs defaultActiveKey="access" type="card" className="config-preferencias-tabs" items={items} animated={false} destroyInactiveTabPane={false} /> : null}
  </BranaModal>;
}
