import { AMBIENTE_PREVIEW_TEXT } from '../../constants/ambienteConstants.js';

export function AmbientePreview({ section, style }) {
  const previewStyle = { fontFamily: style.fonte_nome, fontSize: `${style.fonte_tamanho}px`, fontWeight: style.fonte_estilo.includes('negrito') ? 700 : 400, fontStyle: style.fonte_estilo.includes('italico') ? 'italic' : 'normal', color: style.cor_texto, textDecoration: `${style.riscado ? 'line-through ' : ''}${style.sublinhado ? 'underline' : ''}`.trim() || 'none' };
  return <div className="config-preferencias-ambiente-preview" style={previewStyle}>
    <div className="config-preferencias-ambiente-preview-left">
      <span>{AMBIENTE_PREVIEW_TEXT.enunciados}:</span>
      <input value={AMBIENTE_PREVIEW_TEXT.campos_edicao} readOnly aria-label="Exemplo de campo" />
      <button type="button">{AMBIENTE_PREVIEW_TEXT.botoes_funcao}</button>
      <label><input type="radio" checked={section === 'outros_botoes'} readOnly /> Botão "Radio"</label>
      <label><input type="checkbox" checked={section === 'campos_edicao'} readOnly /> Caixa de checagem</label>
    </div>
    <div className="config-preferencias-ambiente-preview-list" aria-label="Exemplo de lista">
      <div className={section === 'itens_lista' ? 'is-selected' : ''}>Item 1</div><div>Item 2</div><div>Item 3</div><div>...</div>
    </div>
  </div>;
}
