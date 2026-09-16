import { Input, Radio, Select } from 'antd';
import { useEffect, useState } from 'react';
import { BranaModal } from '../../../components/BranaModal.jsx';

const DESTINATIONS = [
  { value: 'browser', label: 'Escolher no navegador', type: 'Destino do navegador', where: 'Definido pelo sistema', status: 'Disponível ao imprimir', comment: 'A impressora física é escolhida no diálogo final do navegador.' },
  { value: 'pdf', label: 'Salvar em PDF', type: 'PDF do navegador', where: 'Download local', status: 'Disponível ao imprimir', comment: 'O navegador permitirá salvar em PDF na etapa final.' },
  { value: 'preview', label: 'Prévia no navegador', type: 'Prévia do navegador', where: 'Tela', status: 'Disponível', comment: 'A impressão física será escolhida depois, no navegador.' },
];

function destinationFor(config) {
  return DESTINATIONS.find((item) => item.label === config.printerName) || DESTINATIONS.find((item) => item.type === config.printerType) || DESTINATIONS[0];
}

export function PrinterSettingsModal({ open, config, onCancel, onConfirm }) {
  const [draft, setDraft] = useState(config);
  useEffect(() => { if (open) setDraft(config); }, [open, config]);
  const destination = destinationFor(draft);
  const updateDestination = (value) => { const next = DESTINATIONS.find((item) => item.value === value) || DESTINATIONS[0]; setDraft((current) => ({ ...current, printerName: next.label, printerStatus: next.status, printerType: next.type, printerWhere: next.where, printerComment: next.comment })); };
  const update = (part) => setDraft((current) => ({ ...current, ...part }));
  return <BranaModal open={open} title="Configurar Impressão" width={520} footer={null} onCancel={onCancel} className="printer-settings-modal">
    <fieldset className="printer-settings-fieldset"><legend>Configuração de impressão</legend>
      <div className="printer-setting-row"><span>Destino:</span><Select value={destination.value} options={DESTINATIONS.map(({ value, label }) => ({ value, label }))} onChange={updateDestination} /></div>
      <div className="printer-setting-row"><span>Status:</span><span>{destination.status}</span></div>
      <div className="printer-setting-row"><span>Tipo:</span><span>{destination.type}</span></div>
      <div className="printer-setting-row"><span>Onde:</span><span>{destination.where}</span></div>
      <div className="printer-comment-field"><span>Comentário:</span><span className="printer-comment-text">{destination.comment}</span></div>
    </fieldset>
    <div className="printer-settings-lower-grid"><fieldset className="printer-settings-fieldset"><legend>Papel</legend><label>Tamanho:<Select value={draft.paperSize} options={['A4', 'Letter', 'A5', 'A3'].map((value) => ({ value, label: value }))} onChange={(value) => update({ paperSize: value })} /></label><label>Origem:<Select value={draft.paperSource} disabled options={[{ value: 'Origem padrão', label: 'Origem padrão' }]} /></label></fieldset><fieldset className="printer-settings-fieldset printer-orientation-fieldset"><legend>Orientação</legend><div className={draft.printerOrientation === 'paisagem' ? 'printer-sheet landscape' : 'printer-sheet'}>A</div><Radio checked={draft.printerOrientation !== 'paisagem'} onChange={() => update({ printerOrientation: 'retrato' })}>Retrato</Radio><Radio checked={draft.printerOrientation === 'paisagem'} onChange={() => update({ printerOrientation: 'paisagem' })}>Paisagem</Radio></fieldset></div>
    <div className="printer-settings-footer"><button type="button" onClick={onCancel}>Cancelar</button><button type="button" className="ant-btn ant-btn-primary" onClick={() => onConfirm(draft)}>Ok</button></div>
  </BranaModal>;
}
