import { Button, Input, Radio } from 'antd';
import { useState } from 'react';
import { BranaModal } from '../../../components/BranaModal.jsx';

export function PrintTestModal({ open, config, onCancel, onConfigure }) {
  const [copies, setCopies] = useState(1); const [pages, setPages] = useState(false); const [from, setFrom] = useState(1); const [to, setTo] = useState(1);
  const print = () => { if (copies < 1 || (pages && (from < 1 || to < from))) return; onCancel(); window.print(); };
  return <BranaModal open={open} title="Imprimir" width={380} footer={null} onCancel={onCancel} className="print-test-modal"><div className="print-test-fieldset"><div>Impressora selecionada: {config.printerName}</div><label>Número de cópias:<Input type="number" min={1} value={copies} onChange={(e) => setCopies(Number(e.target.value) || 1)} /></label><div>Intervalo de páginas</div><Radio checked={!pages} onChange={() => setPages(false)}>Todas</Radio><div className="print-test-pages"><Radio checked={pages} onChange={() => setPages(true)}>Páginas:</Radio><Input type="number" min={1} disabled={!pages} value={from} onChange={(e) => setFrom(Number(e.target.value) || 1)} /><span>a</span><Input type="number" min={1} disabled={!pages} value={to} onChange={(e) => setTo(Number(e.target.value) || 1)} /></div></div><div className="print-test-footer"><Button onClick={onConfigure}>Configura</Button><Button type="primary" onClick={print}>Ok</Button><Button onClick={onCancel}>Cancelar</Button></div></BranaModal>;
}
