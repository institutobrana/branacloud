import { Input, Radio, Select } from 'antd';
import { ReportPagePreview } from './ReportPagePreview.jsx';

export function PaperDimensionsTab({ config, update }) {
  const number = (key, disabled = false) => (
    <Input className="report-paper-number" type="number" min={0} disabled={disabled} value={config[key]} onChange={(e) => update({ [key]: Number(e.target.value) || 0 })} />
  );

  return <div className="report-paper-layout">
    <div className="report-paper-left">
      <fieldset className="report-paper-fieldset">
        <legend>Dimensões do papel na impressora</legend>
        <div className="report-printer-name">{config.printerName || 'Impressora padrão'}</div>
        <Radio checked={config.usePrinterPaper} onChange={() => update({ usePrinterPaper: true })}>Utilizar configuração da impressora:</Radio>
        <div className="report-paper-readonly-grid"><span>Altura:</span><span>{config.paperHeightCm}</span><span>cm</span><span>Largura:</span><span>{config.paperWidthCm}</span><span>cm</span></div>
        <Radio checked={!config.usePrinterPaper} onChange={() => update({ usePrinterPaper: false })}>Fixar tamanho em:</Radio>
        <div className="report-paper-value-row"><span>Altura:</span>{number('paperHeightCm', config.usePrinterPaper)}<span>cm</span></div>
        <div className="report-paper-value-row"><span>Largura:</span>{number('paperWidthCm', config.usePrinterPaper)}<span>cm</span></div>
      </fieldset>
      <fieldset className="report-paper-fieldset report-margins-fieldset">
        <legend>Margens</legend>
        <div className="report-margins-row"><label>Esquerda{number('marginLeftCm')}<span>cm</span></label><label>Direita{number('marginRightCm')}<span>cm</span></label><label>Superior{number('marginTopCm')}<span>cm</span></label><label>Inferior{number('marginBottomCm')}<span>cm</span></label></div>
      </fieldset>
    </div>
    <div className="report-paper-preview-column"><ReportPagePreview config={config} /></div>
  </div>;
}
