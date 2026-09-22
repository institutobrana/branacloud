import { EditorContent } from '@tiptap/react';
import { EditorTextosRuler } from './EditorTextosRuler.jsx';
import { usePaginationAwareness } from '../pagination/hooks/usePaginationAwareness.js';
import { PaginatedPreview } from '../pagination/preview/PaginatedPreview.jsx';
import { useState } from 'react';

const MM_TO_PX = 96 / 25.4;

export function EditorTextosWorkspace({ editor, pageConfig }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const config = pageConfig || { largura_mm: 215.9, altura_mm: 279.4, margem_superior_mm: 25.4 };
  const pageHeightPx = Math.max(480, config.altura_mm * MM_TO_PX);
  const style = { width: `max(360px, ${config.largura_mm * MM_TO_PX}px)`, minHeight: `${pageHeightPx}px`, paddingTop: `${config.margem_superior_mm * MM_TO_PX}px`, paddingBottom: `${config.margem_superior_mm * MM_TO_PX}px`, paddingLeft: `${config.margem_esquerda_mm * MM_TO_PX}px`, paddingRight: `${config.margem_direita_mm * MM_TO_PX}px`, '--editor-textos-page-height': `${pageHeightPx}px` };
  const { enabled, layout } = usePaginationAwareness(editor, pageConfig);
  const [selectionStart, selectionEnd] = layout.selectionPageRange || [layout.currentPage, layout.currentPage];
  const pageLabel = selectionStart === selectionEnd ? `Página ${layout.currentPage} de ${layout.pageCount || 1}` : `Páginas ${selectionStart}–${selectionEnd} de ${layout.pageCount || 1}`;
  return (
    <div className={`editor-textos-workspace${previewOpen ? ' has-preview' : ''}`} data-testid="editor-textos-workspace">
      <EditorTextosRuler pageConfig={pageConfig} editor={editor} />
      <div className="editor-textos-pagination-actions"><button type="button" onClick={() => setPreviewOpen((value) => !value)} aria-expanded={previewOpen}>{previewOpen ? 'Fechar páginas' : 'Visualizar páginas'}</button></div>
      {enabled && <div className="editor-textos-pagination-indicator" role="status" aria-live="polite">{pageLabel}</div>}
      <div className="editor-textos-page-shell">
      <div className="editor-textos-page" data-testid="editor-textos-page" style={style}>
        <EditorContent editor={editor} />
      </div>
      {enabled && <div className="editor-textos-page-gutter" aria-hidden="true">{layout.breaks.map((item) => <span key={`${item.afterPage}-${item.lastPmPos}`} style={{ top: `${item.editorY}px` }}>Fim da página {item.afterPage}</span>)}</div>}
      </div>
      <PaginatedPreview layout={layout} open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}
