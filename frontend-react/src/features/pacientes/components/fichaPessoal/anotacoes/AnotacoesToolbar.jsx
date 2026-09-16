import { message, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BgColorsOutlined,
  CopyOutlined,
  DeleteOutlined,
  FontSizeOutlined,
  MenuOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { AGENDA_APRESENTACAO_COLORS } from '../../../../agendaConfiguracao/agendaConfiguracaoColors.js';
import { AgendaColorDropdown } from '../../../../agendaConfiguracao/components/AgendaColorDropdown.jsx';
import { resolveAgendaFontFamilies } from '../../../../agendaConfiguracao/utils/agendaFontResolver.js';
import { copySelection, cutSelection, pasteClipboard } from './anotacoesClipboard.js';

const groups = [
  [
    { label: 'B', title: 'Negrito', mark: 'bold', className: 'ficha-anotacoes-mark ficha-anotacoes-bold' },
    { label: 'I', title: 'Itálico', mark: 'italic', className: 'ficha-anotacoes-mark ficha-anotacoes-italic' },
    { label: 'U', title: 'Sublinhado', mark: 'underline', className: 'ficha-anotacoes-mark ficha-anotacoes-underline' },
  ],
  [
    { icon: ScissorOutlined, title: 'Recortar', action: 'cut' },
    { icon: CopyOutlined, title: 'Copiar', action: 'copy' },
    { icon: SnippetsOutlined, title: 'Colar', action: 'paste' },
  ],
  [
    { icon: AlignLeftOutlined, title: 'Alinhar à esquerda', align: 'left' },
    { icon: AlignCenterOutlined, title: 'Centralizar', align: 'center' },
    { icon: AlignRightOutlined, title: 'Alinhar à direita', align: 'right' },
    { icon: MenuOutlined, title: 'Justificar', align: 'justify' },
  ],
  [
    { icon: UnorderedListOutlined, title: 'Marcadores', action: 'bulletList' },
    { icon: TableOutlined, title: 'Tabela', action: 'table' },
  ],
  [
    { icon: FontSizeOutlined, label: 'A', title: 'Fonte', className: 'ficha-anotacoes-font-control' },
    { label: '11', title: 'Tamanho da fonte', className: 'ficha-anotacoes-size-control' },
    { icon: BgColorsOutlined, title: 'Cor da fonte', className: 'ficha-anotacoes-color-control' },
  ],
];

const FONT_SIZES = Array.from({ length: 33 }, (_, index) => index + 8);

export function AnotacoesToolbar({ editor }) {
  const [fontFamilies, setFontFamilies] = useState(['Arial']);
  const [fontColor, setFontColor] = useState('#000000');
  const [tableOpen, setTableOpen] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableColumns, setTableColumns] = useState(2);
  const [, refreshSelection] = useState(0);

  useEffect(() => {
    if (!editor) return undefined;
    const refresh = () => refreshSelection((value) => value + 1);
    editor.on('selectionUpdate', refresh);
    editor.on('transaction', refresh);
    return () => {
      editor.off('selectionUpdate', refresh);
      editor.off('transaction', refresh);
    };
  }, [editor]);

  useEffect(() => {
    let active = true;
    resolveAgendaFontFamilies().then((families) => {
      if (active) setFontFamilies(families);
    });
    return () => { active = false; };
  }, []);

  const applyFont = (event) => editor?.chain().focus().setFontFamily(event.target.value).run();
  const applySize = (event) => editor?.chain().focus().setMark('textStyle', { fontSize: `${event.target.value}pt` }).run();
  const applyFontColor = (value) => {
    setFontColor(value);
    editor?.chain().focus().setColor(value).run();
  };
  const toggleMark = (mark) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (mark === 'bold') chain.toggleBold().run();
    if (mark === 'italic') chain.toggleItalic().run();
    if (mark === 'underline') chain.toggleUnderline().run();
  };
  const applyAlignment = (align) => editor?.chain().focus().setTextAlign(align).run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const isActive = (button) => button.mark
    ? editor?.isActive(button.mark)
    : button.align
      ? editor?.isActive({ textAlign: button.align })
      : button.action === 'bulletList' && editor?.isActive('bulletList');
  const activate = (button) => {
    if (button.mark) return toggleMark(button.mark);
    if (button.align) return applyAlignment(button.align);
    if (button.action === 'bulletList') return toggleBulletList();
    if (button.action === 'table') return setTableOpen((open) => !open);
    if (button.action === 'copy') return runClipboard(copySelection);
    if (button.action === 'cut') return runClipboard(cutSelection);
    if (button.action === 'paste') return runClipboard(pasteClipboard);
    return undefined;
  };
  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: tableRows, cols: tableColumns, withHeaderRow: false }).run();
    setTableOpen(false);
  };
  const runClipboard = async (action) => {
    try {
      const succeeded = await action(editor);
      if (!succeeded && action === pasteClipboard) message.info('Use Ctrl+V para colar');
      if (!succeeded && action === copySelection) message.info('Use Ctrl+C para copiar');
      if (!succeeded && action === cutSelection) message.info('Use Ctrl+X para recortar');
    } catch {
      if (action === pasteClipboard) message.info('Use Ctrl+V para colar');
      if (action === copySelection) message.info('Use Ctrl+C para copiar');
      if (action === cutSelection) message.info('Use Ctrl+X para recortar');
    }
  };
  const canDeleteTable = Boolean(editor?.can().deleteTable());
  const deleteTable = () => {
    if (!canDeleteTable) return;
    editor.chain().focus().deleteTable().run();
    setTableOpen(false);
  };

  return (
    <>
    <div className="ficha-anotacoes-toolbar" role="toolbar" aria-label="Ferramentas de anotação">
      {groups.map((group, groupIndex) => (
        <div className="ficha-anotacoes-toolbar-group" key={groupIndex}>
          {group.filter((button) => groupIndex !== 4 || !button.className?.includes('control')).map((button) => (
            <Tooltip key={button.title} title={button.title} placement="top">
              <span className="ficha-anotacoes-toolbar-tooltip-target">
                <button
                  aria-label={button.title}
                  aria-pressed={button.mark || button.align || button.action ? isActive(button) : undefined}
                  className={`ficha-anotacoes-toolbar-button ${button.className || ''}`}
                  disabled={!button.mark && !button.align && !button.action}
                  onClick={button.mark || button.align || button.action ? () => activate(button) : undefined}
                  onMouseDown={(event) => {
                    if (button.action === 'copy' || button.action === 'cut' || button.action === 'paste') event.preventDefault();
                  }}
                  type="button"
                >
                  {button.icon ? <button.icon aria-hidden="true" /> : null}
                  {button.label || null}
                </button>
              </span>
            </Tooltip>
          ))}
          {groupIndex === 3 && tableOpen && (
            <div className="ficha-anotacoes-table-popover" role="dialog" aria-label="Inserir tabela">
              <label>Linhas <input type="number" min="1" max="20" value={tableRows} onChange={(event) => setTableRows(Math.min(20, Math.max(1, Number(event.target.value) || 1)))} /></label>
              <label>Colunas <input type="number" min="1" max="10" value={tableColumns} onChange={(event) => setTableColumns(Math.min(10, Math.max(1, Number(event.target.value) || 1)))} /></label>
              <button type="button" onClick={insertTable}>Inserir</button>
              <div className="ficha-anotacoes-table-popover-divider" />
              <button type="button" aria-label="Excluir tabela" disabled={!canDeleteTable} onClick={deleteTable}>
                <DeleteOutlined aria-hidden="true" /> Excluir tabela
              </button>
            </div>
          )}
          {groupIndex === 4 && (
            <>
              <select className="ficha-anotacoes-toolbar-select ficha-anotacoes-font-select" aria-label="Fonte" defaultValue="Arial" onChange={applyFont}>
                {fontFamilies.map((family) => <option key={family} value={family}>{family}</option>)}
              </select>
              <select className="ficha-anotacoes-toolbar-select ficha-anotacoes-size-select" aria-label="Tamanho da fonte" defaultValue="11" onChange={applySize}>
                {FONT_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
              <AgendaColorDropdown
                aria-label="Cor da fonte"
                className="ficha-anotacoes-font-color-dropdown"
                onChange={applyFontColor}
                options={AGENDA_APRESENTACAO_COLORS}
                value={fontColor}
              />
            </>
          )}
        </div>
      ))}
    </div>
    </>
  );
}
