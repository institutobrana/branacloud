import { Alert, Button, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { BranaModal } from '../../../components/BranaModal.jsx';
import { ProtectedModulePasswordModal } from '../../../components/ProtectedModulePasswordModal.jsx';
import { OPCOES_SISTEMA_TABS } from '../constants/opcoesSistemaConstants.js';
import { useOpcoesSistema } from '../hooks/useOpcoesSistema.js';
import { ClinicaTab } from './tabs/ClinicaTab.jsx';
import { FinanceiroTab } from './tabs/FinanceiroTab.jsx';
import { SegurancaTab } from './tabs/SegurancaTab.jsx';
import { DataTab } from './tabs/DataTab.jsx';
import { AvancadoTab } from './tabs/AvancadoTab.jsx';
import '../styles/opcoesSistema.css';

export function OpcoesSistemaModal({ open, onClose, onOpenPermissions }) {
  const [activeTab, setActiveTab] = useState('clinica');
  const [cancelled, setCancelled] = useState(false);
  const { values, options, loading, error, saveError, isDirty, save, resetEdits, protectedRequired, update, protectedPassword, setProtectedPassword, retry } = useOpcoesSistema(open);
  useEffect(() => { if (open) { setActiveTab('clinica'); setCancelled(false); } }, [open]);
  const items = useMemo(() => OPCOES_SISTEMA_TABS.map((tab) => ({ key: tab.key, label: tab.label, children: tab.key === 'clinica' ? <ClinicaTab values={values.clinica} update={(p) => update('clinica', p)} /> : tab.key === 'financeiro' ? <FinanceiroTab values={values.financeiro} options={options} update={update} /> : tab.key === 'seguranca' ? <SegurancaTab values={values.seguranca} update={(p) => update('seguranca', p)} onOpenPermissions={onOpenPermissions} /> : tab.key === 'data' ? <DataTab values={values.data} update={(p) => update('data', p)} /> : <AvancadoTab values={values.avancado} options={options} update={update} /> })), [onOpenPermissions, options, update, values]);
  const closeWithoutUnlock = () => { setCancelled(true); setProtectedPassword(''); onClose(); };
  const cancelEdits = () => { if (!loading) resetEdits(); };
  const visibleOpen = open && !cancelled;
  const unlocked = visibleOpen && !error && !protectedRequired;
  const handleOk = async () => { if (!isDirty) return; try { await save(); } catch { /* saveError remains visible */ } };
  return <><BranaModal open={unlocked} onCancel={onClose} footer={null} width={690} centered destroyOnClose maskClosable={false} keyboard title="Opções do sistema" className="opcoes-sistema-modal" styles={{ body: { padding: '8px 10px 10px' } }}>{error ? <div className="opcoes-sistema-error"><Alert type="error" showIcon message={error} /></div> : null}{unlocked ? <><Tabs activeKey={activeTab} onChange={setActiveTab} type="card" items={items} animated={false} destroyInactiveTabPane={false} className="opcoes-sistema-tabs" />{saveError ? <div className="opcoes-sistema-error"><Alert type="error" showIcon message={saveError} /></div> : null}<div className="opcoes-sistema-footer"><Button onClick={cancelEdits} disabled={loading}>Cancela</Button><Button type="primary" loading={loading} onClick={handleOk}>Ok</Button></div></> : null}</BranaModal><ProtectedModulePasswordModal open={visibleOpen && protectedRequired} loading={loading} error={Boolean(protectedPassword && error)} onSubmit={async (value) => { setProtectedPassword(value); await retry(value); }} onCancel={closeWithoutUnlock} /></>;
}
