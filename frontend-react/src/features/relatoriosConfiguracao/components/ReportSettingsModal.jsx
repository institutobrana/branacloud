import { Alert, Button, Input, Modal, Tabs } from 'antd';
import { useState } from 'react';
import { useReportSettings } from '../hooks/useReportSettings.js';
import { ReportsAndFormsTab } from './ReportsAndFormsTab.jsx';
import { PaperDimensionsTab } from './PaperDimensionsTab.jsx';
import { PrinterSettingsModal } from './PrinterSettingsModal.jsx';
import { PrintTestModal } from './PrintTestModal.jsx';
import { BranaModal } from '../../../components/BranaModal.jsx';

export function ReportSettingsModal({ open, onClose, targetUser = null, origin = 'configuracao' }) {
  const h = useReportSettings(open, targetUser);
  const [tab, setTab] = useState('reports');
  const [test, setTest] = useState(false);
  const [printer, setPrinter] = useState(false);
  const title = h.user?.apelido || targetUser?.apelido || h.user?.nome || targetUser?.nome || 'usuário';
  const save = async () => { try { await h.save(); onClose?.(); } catch { /* error rendered */ } };
  return <BranaModal open={open} onCancel={onClose} footer={null} width={760} centered destroyOnClose maskClosable={false} title={`Configura impressos - ${title}`} className="report-settings-modal" data-origin={origin}>
    {h.error && <Alert type="error" showIcon message={h.error} />}
    <Tabs type="card" activeKey={tab} onChange={setTab} items={[{ key: 'reports', label: 'Relatórios e fichas', children: <ReportsAndFormsTab config={h.config} update={h.update} updateSection={h.updateSection} /> }, { key: 'paper', label: 'Dimensões do papel', children: <PaperDimensionsTab config={h.config} update={h.update} /> }]} />
    <div className="report-settings-footer"><Button onClick={h.reset}>Padrão</Button><Button onClick={() => setPrinter(true)}>Impressora...</Button><Button onClick={() => setTest(true)}>Teste</Button><Button type="primary" loading={h.saving} disabled={h.loading} onClick={save}>Ok</Button><Button onClick={onClose}>Cancela</Button></div>
    <PrinterSettingsModal open={printer} config={h.config} onCancel={() => setPrinter(false)} onConfirm={(next) => { h.update(next); setPrinter(false); }} />
    <PrintTestModal open={test} config={h.config} onCancel={() => setTest(false)} onConfigure={() => { setTest(false); setPrinter(true); }} />
  </BranaModal>;
}
