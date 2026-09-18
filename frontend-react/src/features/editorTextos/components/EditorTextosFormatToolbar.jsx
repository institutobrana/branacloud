import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LEGACY_FONT_FAMILIES, loadLocalFontFamilies } from '../../relatoriosConfiguracao/constants/localFontCandidates';
import { EDITOR_TEXTOS_COLOR_PALETTE } from '../constants/editorTextosColorPalette';
import { EditorTextosMergeFieldDialog } from './EditorTextosMergeFieldDialog.jsx';

const FONT_OPTIONS = LEGACY_FONT_FAMILIES;
const FONT_SIZE_OPTIONS = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36'];
const COLOR_OPTIONS = EDITOR_TEXTOS_COLOR_PALETTE;

function normalizeFontSizeValue(value) {
  return typeof value === 'string' && /^\d+(?:\.\d+)?pt$/.test(value) ? value : '11pt';
}

function normalizeColorValue(value) {
  const normalized = String(value || '').trim().toLowerCase();
  const rgb = normalized.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (!rgb) return normalized;
  return `#${[rgb[1], rgb[2], rgb[3]].map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
}

function ColorCombo({ value, mixed = false, onChange }) {
  const [open, setOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState(null);
  const triggerRef = useRef(null);
  const currentValue = mixed ? '' : (normalizeColorValue(value) || '#000000');
  const current = mixed ? { label: 'Misto', value: '' } : (COLOR_OPTIONS.find((item) => item.value === currentValue) || { label: `Cor personalizada (${currentValue})`, value: currentValue });
  const options = mixed || COLOR_OPTIONS.some((item) => item.value === currentValue) ? COLOR_OPTIONS : [current, ...COLOR_OPTIONS];
  useEffect(() => {
    if (!open || !triggerRef.current) return undefined;
    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopupPosition({ left: rect.left, top: rect.bottom + 2 });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => { window.removeEventListener('resize', updatePosition); window.removeEventListener('scroll', updatePosition, true); };
  }, [open]);
  return <div className="editor-textos-color-combo">
    <button ref={triggerRef} type="button" className="editor-textos-color-trigger" aria-haspopup="listbox" aria-expanded={open} aria-label="Cor" onClick={() => setOpen((old) => !old)}>
      <i className="editor-textos-color-swatch" style={{ backgroundColor: current.value }} aria-hidden="true" /><span>{current.label}</span><span aria-hidden="true">▾</span>
    </button>
    {open && popupPosition && createPortal(<div className="editor-textos-color-options" role="listbox" aria-label="Cores" style={{ left: popupPosition.left, top: popupPosition.top }}>
      {options.map((item) => <button type="button" role="option" aria-selected={item.value === currentValue} key={item.value} onClick={() => { onChange(item.value); setOpen(false); }}>
        <i className="editor-textos-color-swatch" style={{ backgroundColor: item.value }} aria-hidden="true" />{item.label}
      </button>)}
    </div>, document.body)}
  </div>;
}

export function EditorTextosFormatToolbar({ editor }) {
  const [activeFormats, setActiveFormats] = useState({ textStyle: {} });
  const [fontOptions, setFontOptions] = useState(FONT_OPTIONS);
  const [fontSource, setFontSource] = useState('fallback');
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const mergeSelectionRef = useRef(null);
  const fontLoadStarted = useRef(false);
  const activeFontSize = normalizeFontSizeValue(activeFormats.textStyle?.fontSize);
  const mixed = activeFormats.mixedTextStyle || {};
  const activeFontFamily = mixed.fontFamily ? '' : (activeFormats.textStyle?.fontFamily || 'Tahoma');
  const activeSizeValue = mixed.fontSize ? '' : activeFontSize;
  const activeColorValue = mixed.color ? null : (activeFormats.textStyle?.color || '#000000');
  const fontSizeOptions = FONT_SIZE_OPTIONS.includes(activeFontSize.replace('pt', ''))
    ? FONT_SIZE_OPTIONS
    : [activeFontSize.replace('pt', ''), ...FONT_SIZE_OPTIONS];
  useEffect(() => {
    const onState = (event) => setActiveFormats(event.detail || { textStyle: {} });
    window.addEventListener('brana-editor-textos-format-state', onState);
    return () => window.removeEventListener('brana-editor-textos-format-state', onState);
  }, []);
  const ensureFontsLoaded = async () => {
    if (fontLoadStarted.current) return;
    fontLoadStarted.current = true;
    const result = await loadLocalFontFamilies();
    setFontOptions((current) => {
      const active = activeFormats.textStyle?.fontFamily;
      return active && !result.families.includes(active) ? [active, ...result.families] : result.families;
    });
    setFontSource(result.source);
  };
  const execute = (command, attrs) => window.dispatchEvent(new CustomEvent('brana-editor-textos-format-command', { detail: { command, attrs } }));
  const openMergeDialog = () => {
    const selection = editor?.state?.selection;
    mergeSelectionRef.current = selection ? {
      from: selection.from,
      to: selection.to,
      isNodeSelection: selection.constructor?.name === 'NodeSelection',
    } : null;
    setMergeDialogOpen(true);
  };
  const insertMergeToken = ({ category, field }) => {
    const selection = mergeSelectionRef.current;
    const fieldName = field?.campo || field?.field || field?.nome;
    if (!editor || !selection || selection.isNodeSelection || !fieldName) return;
    const token = `<<${category}.${fieldName}>>`;
    const maxPosition = editor.state.doc.content.size;
    const from = Math.max(1, Math.min(selection.from, maxPosition));
    const to = Math.max(from, Math.min(selection.to, maxPosition));
    editor.chain().focus().setTextSelection({ from, to }).insertContent(token).run();
    setMergeDialogOpen(false);
    requestAnimationFrame(() => editor.commands.focus());
  };
  return (
    <div className="editor-textos-format-toolbar" role="toolbar" aria-label="Formatação do editor">
      <label className="editor-textos-format-control">
        <span>Fonte:</span>
        <select aria-label="Fonte" value={activeFontFamily} onFocus={ensureFontsLoaded} onChange={(event) => execute('setFontFamily', event.target.value)} data-font-source={fontSource}>
          {mixed.fontFamily && <option value="">Misto</option>}
          {fontOptions.map((font) => <option key={font} value={font}>{font}</option>)}
        </select>
      </label>

      <label className="editor-textos-format-control">
        <span>Tamanho:</span>
        <select aria-label="Tamanho" value={activeSizeValue} onChange={(event) => execute('setFontSize', event.target.value)}>
          {mixed.fontSize && <option value="">Misto</option>}
          {fontSizeOptions.map((size) => <option key={size} value={`${size}pt`}>{size}</option>)}
        </select>
      </label>

      <label className="editor-textos-format-control editor-textos-color-control">
        <span>Cor:</span>
        <ColorCombo value={activeColorValue} mixed={mixed.color} onChange={(color) => execute('setColor', color)} />
      </label>

      <button type="button" className="editor-textos-merge-button" onClick={openMergeDialog}>Campo de mesclagem</button>
      <EditorTextosMergeFieldDialog open={mergeDialogOpen} onCancel={() => setMergeDialogOpen(false)} onConfirm={insertMergeToken} />
    </div>
  );
}
