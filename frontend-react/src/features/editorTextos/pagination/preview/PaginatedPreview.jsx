import { useEffect, useRef } from 'react';

export function PaginatedPreview({ layout, open, onClose }) {
  const currentRef = useRef(null);
  useEffect(() => { if (open) currentRef.current?.scrollIntoView({ block: 'nearest' }); }, [open, layout.currentPage, layout.layoutVersion]);
  if (!open) return null;
  const cfg = layout.pageConfig || {};
  return <aside className="editor-textos-paginated-preview" contentEditable={false} aria-label="Visualização de páginas" data-testid="paginated-preview">
    <div className="editor-textos-paginated-preview__header"><strong>Visualização de páginas</strong><button type="button" onClick={onClose} aria-label="Fechar visualização de páginas">Fechar</button></div>
    <div className="editor-textos-paginated-preview__pages">
      {layout.pages.map((page) => <section key={page.index} ref={page.index === layout.currentPage ? currentRef : null} className={`editor-textos-preview-page${page.index === layout.currentPage ? ' is-current' : ''}`} style={{ width: cfg.width, height: cfg.height, marginBottom: cfg.gap, padding: `${cfg.contentTop}px ${cfg.marginRight}px ${cfg.height - cfg.contentBottom}px ${cfg.marginLeft}px` }} aria-label={`Página ${page.index}`}>
        {page.lines.map((line) => <div key={`${page.index}-${line.fromPmPos}-${line.toPmPos}`} className="editor-textos-preview-line" style={{ minHeight: `${line.height}px`, textAlign: line.textAlign || 'left' }}>{line.text || '\u00a0'}</div>)}
      </section>)}
    </div>
  </aside>;
}
