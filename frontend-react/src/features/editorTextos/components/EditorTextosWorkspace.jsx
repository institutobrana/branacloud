import { EditorContent } from '@tiptap/react';
import { EditorTextosRuler } from './EditorTextosRuler.jsx';

const MM_TO_PX = 96 / 25.4;

export function EditorTextosWorkspace({ editor, pageConfig }) {
  const config = pageConfig || { largura_mm: 215.9, altura_mm: 279.4, margem_superior_mm: 25.4 };
  const style = { width: `max(360px, ${config.largura_mm * MM_TO_PX}px)`, minHeight: `max(480px, ${config.altura_mm * MM_TO_PX}px)`, paddingTop: `${config.margem_superior_mm * MM_TO_PX}px`, paddingBottom: `${config.margem_superior_mm * MM_TO_PX}px`, paddingLeft: `${config.margem_esquerda_mm * MM_TO_PX}px`, paddingRight: `${config.margem_direita_mm * MM_TO_PX}px` };
  return (
    <div className="editor-textos-workspace" data-testid="editor-textos-workspace">
      <EditorTextosRuler pageConfig={pageConfig} editor={editor} />
      <div className="editor-textos-page" data-testid="editor-textos-page" style={style}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
