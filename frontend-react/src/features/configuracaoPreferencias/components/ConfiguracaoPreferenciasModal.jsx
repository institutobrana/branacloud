import { Alert, Button, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { BranaModal } from '../../../components/BranaModal.jsx';
import { CONFIGURACAO_PREFERENCIAS_TABS } from '../constants/configuracaoPreferenciasConstants.js';
import { useConfiguracaoPreferenciasGeral } from '../hooks/useConfiguracaoPreferenciasGeral.js';
import { useConfiguracaoPreferenciasModelos } from '../hooks/useConfiguracaoPreferenciasModelos.js';
import { useConfiguracaoPreferenciasAmbiente } from '../hooks/useConfiguracaoPreferenciasAmbiente.js';
import { useConfiguracaoPreferenciasDadosUsuario } from '../hooks/useConfiguracaoPreferenciasDadosUsuario.js';
import { useConfiguracaoPreferenciasOdontograma } from '../hooks/useConfiguracaoPreferenciasOdontograma.js';
import { GeralTab } from './tabs/GeralTab.jsx';
import { ModelosTab } from './tabs/ModelosTab.jsx';
import { AmbienteTab } from './tabs/AmbienteTab.jsx';
import { PlaceholderTab } from './tabs/PlaceholderTab.jsx';
import { DadosUsuarioTab } from './tabs/DadosUsuarioTab.jsx';
import { OdontogramaTab } from './tabs/OdontogramaTab.jsx';
import '../styles/configuracaoPreferencias.css';

export function ConfiguracaoPreferenciasModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('geral');
  const { values, options, user, loading, saving, error, update, save } = useConfiguracaoPreferenciasGeral(open);
  const modelos = useConfiguracaoPreferenciasModelos(open);
  const ambiente = useConfiguracaoPreferenciasAmbiente(open);
  const dados = useConfiguracaoPreferenciasDadosUsuario(open);
  const odontograma = useConfiguracaoPreferenciasOdontograma(open);
  useEffect(() => { if (open) setActiveTab('geral'); }, [open]);
  const items = useMemo(() => CONFIGURACAO_PREFERENCIAS_TABS.map((tab) => ({
    key: tab.key,
    label: tab.label,
    children: tab.key === 'geral' ? <GeralTab values={values} options={options} update={update} /> : tab.key === 'modelos' ? <ModelosTab values={modelos.values} options={modelos.options} update={modelos.update} loading={modelos.loading} /> : tab.key === 'ambiente' ? <AmbienteTab values={ambiente.values} options={ambiente.options} selectSection={ambiente.selectSection} updateSectionStyle={ambiente.updateSectionStyle} restoreSection={ambiente.restoreSection} /> : tab.key === 'dados' ? <DadosUsuarioTab values={dados.values} update={dados.update} /> : <OdontogramaTab values={odontograma.values} options={odontograma.options} update={odontograma.update} />,
  })), [ambiente.options, ambiente.restoreSection, ambiente.selectSection, ambiente.updateSectionStyle, ambiente.values, dados.update, dados.values, modelos.loading, modelos.options, modelos.update, modelos.values, odontograma.options, odontograma.update, odontograma.values, options, update, values]);
  const handleSave = async () => { if (activeTab === 'geral') { try { await save(); onClose?.(); } catch { /* error remains visible */ } } else if (activeTab === 'modelos') { try { await modelos.save(); onClose?.(); } catch { /* error remains visible */ } } else if (activeTab === 'ambiente') { try { await ambiente.save(); onClose?.(); } catch { /* error remains visible */ } } else if (activeTab === 'dados') { try { await dados.save(); onClose?.(); } catch { /* error remains visible */ } } else if (activeTab === 'odontograma') { try { await odontograma.save(); onClose?.(); } catch { /* error remains visible */ } } };
  const titleName = user?.apelido || user?.nome || modelos.user?.apelido || modelos.user?.nome || 'usuário';
  const activeError = activeTab === 'modelos' ? modelos.error : activeTab === 'ambiente' ? ambiente.error : activeTab === 'dados' ? dados.error : activeTab === 'odontograma' ? odontograma.error : error;
  return <BranaModal open={open} onCancel={onClose} footer={null} width={690} centered destroyOnClose maskClosable={false} keyboard title={`Configura preferências do usuário (${titleName})`} className="config-preferencias-modal" styles={{ body: { padding: '8px 10px 10px' } }}>
    {activeError ? <Alert type="error" showIcon message={activeError} className="config-preferencias-error" /> : null}
    <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" items={items} animated={false} destroyInactiveTabPane={false} className="config-preferencias-tabs" />
    <div className="config-preferencias-footer"><Button onClick={onClose}>Cancela</Button><Button type="primary" loading={saving || modelos.saving || ambiente.saving || dados.saving || odontograma.saving} disabled={loading || modelos.loading || ambiente.loading || dados.loading || odontograma.loading || !['geral', 'modelos', 'ambiente', 'dados', 'odontograma'].includes(activeTab)} onClick={handleSave}>Ok</Button></div>
  </BranaModal>;
}
