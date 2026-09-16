const FONT_OPTIONS = ['Tahoma'];
const FONT_SIZE_OPTIONS = ['11', '12', '14'];
const COLOR_OPTIONS = ['Preto', 'Azul', 'Vermelho'];

export function EditorTextosFormatToolbar() {
  const [activeFormats, setActiveFormats] = useState({ textStyle: {} });
  useEffect(() => {
    const onState = (event) => setActiveFormats(event.detail || { textStyle: {} });
    window.addEventListener('brana-editor-textos-format-state', onState);
    return () => window.removeEventListener('brana-editor-textos-format-state', onState);
  }, []);
  const execute = (command, attrs) => window.dispatchEvent(new CustomEvent('brana-editor-textos-format-command', { detail: { command, attrs } }));
  return (
    <div className="editor-textos-format-toolbar" role="toolbar" aria-label="Formatação do editor">
      <label className="editor-textos-format-control">
        <span>Fonte:</span>
        <select aria-label="Fonte" value={activeFormats.textStyle?.fontFamily || 'Tahoma'} onChange={(event) => execute('setFontFamily', event.target.value)}>
          {FONT_OPTIONS.map((font) => <option key={font} value={font}>{font}</option>)}
        </select>
      </label>

      <label className="editor-textos-format-control">
        <span>Tamanho:</span>
        <select aria-label="Tamanho" value={activeFormats.textStyle?.fontSize || '11pt'} onChange={(event) => execute('setFontSize', event.target.value)}>
          {FONT_SIZE_OPTIONS.map((size) => <option key={size} value={`${size}pt`}>{size}</option>)}
        </select>
      </label>

      <label className="editor-textos-format-control editor-textos-color-control">
        <span>Cor:</span>
        <span className="editor-textos-color-swatch" aria-hidden="true" />
        <select aria-label="Cor" value={activeFormats.textStyle?.color || '#000000'} onChange={(event) => execute('setColor', event.target.value)}>
          <option value="#000000">Preto</option><option value="#0000ff">Azul</option><option value="#ff0000">Vermelho</option>
        </select>
      </label>

      <label className="editor-textos-format-control">
        <span>Campo de mesclagem:</span>
        <select aria-label="Campo de mesclagem" defaultValue="" disabled>
          <option value="">Campo de mesclagem</option>
        </select>
      </label>
    </div>
  );
}
import { useEffect, useState } from 'react';
