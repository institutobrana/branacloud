import { useState } from 'react';
import { AnotacoesEditor } from './AnotacoesEditor.jsx';
import { AnotacoesToolbar } from './AnotacoesToolbar.jsx';
import { isLegacyRtf, serializeAnotacoesHtml } from './anotacoesContent.js';

export function AnotacoesTab({ content = '', onChange }) {
  const [editor, setEditor] = useState(null);
  const legacyRtf = isLegacyRtf(content);

  return (
    <section className="ficha-anotacoes-tab" aria-label="Ficha de anotações">
      <AnotacoesToolbar editor={editor} />
      <AnotacoesEditor content={content} editable={!legacyRtf} onChange={(html) => onChange?.(serializeAnotacoesHtml(html))} onEditorReady={setEditor} />
      <div className="ficha-anotacoes-footer">{legacyRtf ? 'Anotação legada pendente de migração.' : 'Ficha de anotações'}</div>
    </section>
  );
}
