import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  CopyOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  FilePdfOutlined,
  FolderOpenOutlined,
  FormOutlined,
  PictureOutlined,
  PrinterOutlined,
  SaveOutlined,
  ScissorOutlined,
  SignatureOutlined,
  SnippetsOutlined,
  SettingOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

const PRIMARY_ACTIONS = [
  { key: 'novo', label: 'Novo', enabled: true, icon: FileAddOutlined },
  { key: 'abrir', label: 'Abre', icon: FolderOpenOutlined },
  { key: 'salvar', label: 'Salvar', icon: SaveOutlined },
  { key: 'salvar-como', label: 'Salvar como', icon: FileDoneOutlined },
  { key: 'exportar-pdf', label: 'Exportar PDF', icon: FilePdfOutlined },
  { key: 'imprimir', label: 'Imprime', icon: PrinterOutlined },
  { key: 'pagina', label: 'Configura página', icon: FormOutlined },
  { key: 'impressora', label: 'Configura impressora', icon: SettingOutlined },
  { key: 'assinar', label: 'Assinar PDF', icon: SignatureOutlined },
];

const FORMAT_ACTIONS = [
  { key: 'negrito', label: 'Negrito', content: <strong aria-hidden="true">B</strong> },
  { key: 'italico', label: 'Itálico', content: <em aria-hidden="true">I</em> },
  { key: 'sublinhado', label: 'Sublinhado', content: <u aria-hidden="true">U</u> },
  { key: 'recortar', label: 'Recortar', icon: ScissorOutlined },
  { key: 'copiar', label: 'Copiar', icon: CopyOutlined },
  { key: 'colar', label: 'Colar', icon: SnippetsOutlined },
];

const LAYOUT_ACTIONS = [
  { key: 'align-left', label: 'Alinhar à esquerda', icon: AlignLeftOutlined },
  { key: 'align-center', label: 'Centralizar', icon: AlignCenterOutlined },
  { key: 'align-right', label: 'Alinhar à direita', icon: AlignRightOutlined },
  { key: 'justify', label: 'Justificar', icon: AlignCenterOutlined },
  { key: 'list', label: 'Lista', icon: UnorderedListOutlined },
  { key: 'image', label: 'Imagem', icon: PictureOutlined },
  { key: 'table', label: 'Tabela', icon: TableOutlined },
];

export function EditorTextosPrimaryToolbar({ onAction, enabledActions = {} }) {
  const [activeFormats, setActiveFormats] = useState({});
  useEffect(() => {
    const onState = (event) => setActiveFormats(event.detail || {});
    window.addEventListener('brana-editor-textos-format-state', onState);
    return () => window.removeEventListener('brana-editor-textos-format-state', onState);
  }, []);
  const formatCommand = (key) => {
    if (['recortar', 'copiar', 'colar'].includes(key)) {
      window.dispatchEvent(new CustomEvent('brana-editor-textos-clipboard-command', { detail: { command: key } }));
      return;
    }
    const commands = { negrito: 'toggleBold', italico: 'toggleItalic', sublinhado: 'toggleUnderline', 'align-left': 'setTextAlign', 'align-center': 'setTextAlign', 'align-right': 'setTextAlign', justify: 'setTextAlign', list: 'toggleBulletList' };
    const attrs = { 'align-left': 'left', 'align-center': 'center', 'align-right': 'right', justify: 'justify' };
    window.dispatchEvent(new CustomEvent('brana-editor-textos-format-command', { detail: { command: commands[key], attrs: attrs[key] } }));
  };
  return (
    <div className="editor-textos-primary-toolbar" role="toolbar" aria-label="Comandos principais do Editor de Textos">
      {PRIMARY_ACTIONS.map((action, index) => (
        <Tooltip key={action.key} title={action.label}>
        <button
          type="button"
          className={`auxiliary-shell-button${index === 0 ? ' primary' : ''}`}
          disabled={!action.enabled && !enabledActions[action.key]}
          aria-label={action.label}
          title={action.label}
          onClick={() => onAction?.(action.key)}
        >
          <action.icon aria-hidden="true" />
          <span className="sr-only">{action.label}</span>
        </button>
        </Tooltip>
      ))}
      <span className="editor-textos-toolbar-separator" aria-hidden="true" />
      {FORMAT_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Tooltip key={action.key} title={action.label}>
            <button type="button" className={`auxiliary-shell-button${activeFormats[{ negrito: 'bold', italico: 'italic', sublinhado: 'underline' }[action.key]] ? ' is-active' : ''}`} aria-label={action.label} title={action.label} onClick={() => formatCommand(action.key)}>
              {Icon ? <Icon aria-hidden="true" /> : action.content}
              <span className="sr-only">{action.label}</span>
            </button>
          </Tooltip>
        );
      })}
      <span className="editor-textos-toolbar-separator" aria-hidden="true" />
      {LAYOUT_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Tooltip key={action.key} title={action.label}>
            <button type="button" disabled={action.key === 'table' && activeFormats.inTable} className={`auxiliary-shell-button${((action.key === 'list' && activeFormats.list) || (action.key === 'align-left' && (activeFormats.textAlign || 'left') === 'left') || (action.key === 'align-center' && activeFormats.textAlign === 'center') || (action.key === 'align-right' && activeFormats.textAlign === 'right') || (action.key === 'justify' && activeFormats.textAlign === 'justify')) ? ' is-active' : ''}`} aria-label={action.label} title={action.label} onClick={() => action.key === 'image' ? onAction?.('imagem') : action.key === 'table' ? onAction?.('table') : ['align-left', 'align-center', 'align-right', 'justify', 'list'].includes(action.key) && formatCommand(action.key)}>
              <Icon aria-hidden="true" />
              <span className="sr-only">{action.label}</span>
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
