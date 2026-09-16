import { useState } from 'react';
import { calculateInitialSize, readFileAsDataUrl, readImageDimensions } from '../adapters/EditorImageAdapter.js';

export function EditorTextosImageDialog({ onClose, onInsert, contentWidth = 700 }) {
  const [fitPage, setFitPage] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const confirm = async () => {
    if (!file) { setError('Selecione uma imagem.'); return; }
    try {
      const src = await readFileAsDataUrl(file);
      const natural = await readImageDimensions(src);
      const size = calculateInitialSize({ ...natural, contentWidth, fitPage });
      onInsert({ src, ...size, fitPage });
    } catch (cause) { setError(cause.message); }
  };
  return <div className="editor-textos-dialog-backdrop" role="presentation"><section className="editor-textos-dialog editor-textos-image-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-textos-image-title">
    <h2 id="editor-textos-image-title">Inserir imagem</h2>
    <label>Arquivo<input type="file" accept="image/bmp,image/jpeg,image/png,image/gif,image/webp" onChange={(event) => { setFile(event.target.files?.[0] || null); setError(''); }} /></label>
    <label className="editor-textos-image-fit"><input type="checkbox" checked={fitPage} onChange={(event) => setFitPage(event.target.checked)} />Ajustar à largura da página</label>
    {error && <div role="alert" className="editor-textos-dialog-error">{error}</div>}
    <div className="editor-textos-dialog-actions"><button type="button" onClick={onClose}>Cancelar</button><button type="button" onClick={confirm}>Ok</button></div>
  </section></div>;
}
