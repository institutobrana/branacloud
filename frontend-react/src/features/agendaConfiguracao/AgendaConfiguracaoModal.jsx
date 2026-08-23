import { Alert, Button, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { BranaModal } from '../../components/BranaModal.jsx';
import { AGENDA_CONFIGURACAO_TABS, AGENDA_CONFIGURACAO_TITLE } from './agendaConfiguracaoConstants.js';
import './agendaConfiguracao.css';
import { AgendaApresentacaoTab } from './components/tabs/AgendaApresentacaoTab.jsx';
import { AgendaBloqueiosTab } from './components/tabs/AgendaBloqueiosTab.jsx';
import { AgendaEscalaTab } from './components/tabs/AgendaEscalaTab.jsx';
import { AgendaVisualizacaoTab } from './components/tabs/AgendaVisualizacaoTab.jsx';
import { useAgendaConfiguracao } from './hooks/useAgendaConfiguracao.js';

function TabLabel({ children }) {
  return <span className="agenda-configuracao-tab-label">{children}</span>;
}

function buildTabItems({ draft, updateDraft, prestadorId, reloadBloqueios, bloqueios, bloqueiosLoading, bloqueiosError }) {
  const tabComponents = {
    escala: AgendaEscalaTab,
    bloqueios: AgendaBloqueiosTab,
    apresentacao: AgendaApresentacaoTab,
    visualizacao: AgendaVisualizacaoTab,
  };
  return AGENDA_CONFIGURACAO_TABS.map((tab) => {
    const TabComponent = tabComponents[tab.key] || AgendaEscalaTab;
    const tabProps = tab.key === 'escala' || tab.key === 'bloqueios' || tab.key === 'apresentacao' || tab.key === 'visualizacao'
      ? {
          draft,
          updateDraft,
          prestadorId,
          reloadBloqueios,
          bloqueios,
          bloqueiosLoading,
          bloqueiosError,
        }
      : {};
    return {
      key: tab.key,
      label: <TabLabel>{tab.label}</TabLabel>,
      children: <TabComponent {...tabProps} />,
    };
  });
}

export function AgendaConfiguracaoModal({
  open,
  context = null,
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState('escala');
  const {
    prestadorId,
    draft,
    setDraft,
    loading,
    saving,
    error,
    canSave,
    save,
    resetFromBase,
    bloqueios,
    bloqueiosLoading,
    bloqueiosError,
    reloadBloqueios,
  } = useAgendaConfiguracao(context, open);
  const tabItems = useMemo(
    () => buildTabItems({ draft, updateDraft: setDraft, prestadorId, reloadBloqueios, bloqueios, bloqueiosLoading, bloqueiosError }),
    [bloqueios, bloqueiosError, bloqueiosLoading, draft, prestadorId, reloadBloqueios, setDraft],
  );
  const prestadorNome = String(context?.selectedPrestadorSnapshot?.nome || '').trim();
  const prestadorCodigo = String(context?.selectedPrestadorSnapshot?.codigo || '').trim();

  useEffect(() => {
    if (!open) return;
    setActiveTab('escala');
  }, [open, context?.prestadorId]);

  const handleCancel = () => {
    resetFromBase();
    onCancel?.();
  };

  const handleFooterCancel = () => {
    resetFromBase();
  };

  const handleSave = async () => {
    await save();
  };

  return (
    <BranaModal
      open={open}
      title={AGENDA_CONFIGURACAO_TITLE}
      onCancel={handleCancel}
      footer={null}
      width={740}
      centered
      destroyOnClose
      maskClosable={false}
      keyboard
      className="agenda-configuracao-modal"
      styles={{ body: { padding: '8px 10px 10px' } }}
    >
      <div className="agenda-configuracao-shell">
        {prestadorNome ? (
          <div className="agenda-configuracao-context">
            <span>
              <strong>Prestador:</strong> {prestadorCodigo ? `${prestadorCodigo} - ` : ''}
              {prestadorNome}
            </span>
          </div>
        ) : null}
        {error ? (
          <Alert type="error" showIcon message={error} className="agenda-configuracao-alert" />
        ) : null}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={tabItems}
          className="agenda-configuracao-tabs"
          animated={false}
          destroyInactiveTabPane={false}
        />
        <div className="agenda-configuracao-footer">
          <Button onClick={handleFooterCancel}>Cancela</Button>
          <Button type="primary" onClick={handleSave} loading={saving} disabled={!canSave}>
            Ok
          </Button>
        </div>
      </div>
    </BranaModal>
  );
}
