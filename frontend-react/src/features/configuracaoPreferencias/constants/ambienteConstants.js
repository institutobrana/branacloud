export const AMBIENTE_SECTION_KEYS = ['enunciados', 'campos_edicao', 'botoes_funcao', 'outros_botoes', 'itens_lista'];
export const AMBIENTE_DEFAULT_STYLE = { fonte_nome: 'Tahoma', fonte_tamanho: 12, fonte_estilo: 'normal', cor_texto: '#000000', riscado: false, sublinhado: false, script: 'Ocidental' };
export const AMBIENTE_FALLBACK_SECTIONS = AMBIENTE_SECTION_KEYS.reduce((out, key) => ({ ...out, [key]: { ...AMBIENTE_DEFAULT_STYLE } }), {});
export const AMBIENTE_PREVIEW_TEXT = { enunciados: 'Enunciado', campos_edicao: 'Campo', botoes_funcao: 'Botão de função', outros_botoes: 'Botão "Radio"', itens_lista: 'Item 1' };
