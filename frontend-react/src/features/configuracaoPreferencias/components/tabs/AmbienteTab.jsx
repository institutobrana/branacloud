import { Button } from 'antd';
import { useState } from 'react';
import { AmbienteFontDialog } from '../ambiente/AmbienteFontDialog.jsx';
import { AmbientePreview } from '../ambiente/AmbientePreview.jsx';
import { AmbienteSectionList } from '../ambiente/AmbienteSectionList.jsx';

export function AmbienteTab({ values, options, selectSection, updateSectionStyle, restoreSection }) {
  const [fontOpen, setFontOpen] = useState(false);
  const active = values.secao_ativa || 'enunciados';
  const style = values.secoes?.[active] || {};
  const sections = options.secoes || [];
  return <fieldset className="config-preferencias-ambiente-frame"><legend>Apresentação (letras e cores)</legend><div className="config-preferencias-ambiente-layout"><div><span className="config-preferencias-ambiente-label">Seção:</span><AmbienteSectionList sections={sections} active={active} onSelect={selectSection} /></div><div className="config-preferencias-ambiente-main"><div className="config-preferencias-ambiente-heading"><span>Exemplo:</span><Button type="link" onClick={() => setFontOpen(true)}>Altera letra...</Button></div><AmbientePreview section={active} style={style} /><div className="config-preferencias-ambiente-actions"><Button onClick={() => restoreSection(active)}>Restaura padrões</Button></div></div></div><AmbienteFontDialog open={fontOpen} initialStyle={style} options={options} onCancel={() => setFontOpen(false)} onConfirm={(next) => { updateSectionStyle(active, next); setFontOpen(false); }} /></fieldset>;
}
