import { Tabs } from 'antd';

export function CenarioAnualTabs({ activeKey, items, onChange }) {
  return <Tabs activeKey={activeKey} items={items} onChange={onChange} className="cenario-anual-tabs" />;
}
