import { useEffect } from 'react';
import { Tabs } from 'antd';

const tabs = [
  { key: 'dados', label: 'Dados pessoais' },
  { key: 'complementares', label: 'Dados complementares' },
  { key: 'anotacoes', label: 'Anotacoes' },
  { key: 'anamnese', label: 'Anamnese', locked: true },
  { key: 'historico', label: 'Histórico', locked: true },
];

export function FichaPessoalTabs({ activeTab, onChange, hasPersistedPaciente }) {
  return (
    <Tabs
      activeKey={activeTab}
      onChange={onChange}
      type="card"
      className="ficha-pessoal-tabs"
      items={tabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        disabled: tab.locked && !hasPersistedPaciente,
        children: null,
      }))}
    />
  );
}
