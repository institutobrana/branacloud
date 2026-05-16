# Símbolos Gráficos — Subetapa 7 — Consolidação pós-integrações de helpers

## 1. Escopo da etapa

Esta etapa é somente documental. Nenhum código funcional foi alterado.

## 2. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/simbolos-graficos.js`
- `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md`
- `docs/simbolos_graficos_subetapa_1_namespace_passivo.md`
- `docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md`
- `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md`
- `docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md`
- `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md`
- `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Resumo do mini ciclo concluído

Subetapa 0:
Mapeamento monolítico documental.

Subetapa 1:
Criação do namespace passivo `window.BranaSimbolosGraficosModule`.

Subetapa 2:
Mapeamento de fronteiras, contratos e riscos.

Subetapa 3:
Criação/exportação passiva de helpers puros.

Subetapa 4:
Integração mínima de `normalizarTextoSimbolo` em `simbolosNormalizarTexto`, com fallback.

Subetapa 5:
Integração mínima de `ehSimboloSistema` em `simbolosEhSistema`, com fallback.

Subetapa 6:
Integração mínima de `urlImagemSimbolo` em `simbolosImagemUrl`, com fallback.

## 4. Helpers integrados

### 4.1 `normalizarTextoSimbolo`

- Função local alterada: `simbolosNormalizarTexto`
- Tipo de integração: delegação para helper passivo com fallback local
- Fallback preservado: sim
- Baixo risco: a função é puramente interna e só afeta normalização textual para comparação
- Impacto indireto: comparação, busca ou filtro textual interno
- Testes recomendados: abrir Símbolos Gráficos e conferir que filtros, buscas e seleções textuais continuam iguais

### 4.2 `ehSimboloSistema`

- Função local alterada: `simbolosEhSistema`
- Tipo de integração: delegação para helper passivo com fallback local
- Fallback preservado: sim
- Baixo risco: a função é booleana, defensiva e isolada
- Impacto indireto: bloqueio/permite ações sobre itens de sistema
- Testes recomendados: abrir a tela e confirmar que itens de sistema continuam bloqueando/permitindo ações como antes

### 4.3 `urlImagemSimbolo`

- Função local alterada: `simbolosImagemUrl`
- Tipo de integração: delegação para helper passivo com fallback local
- Fallback preservado: sim
- Observação: a lógica antiga foi preservada com `imagem_url` e o caso especial `sim_modelo.bmp`
- Baixo risco: a função apenas resolve URL de imagem de forma defensiva
- Impacto indireto: preview, biblioteca e exibição visual de ícones/imagens
- Testes recomendados: abrir a tela e conferir que imagens, preview e biblioteca continuam iguais, incluindo o caso `sim_modelo.bmp` se houver

## 5. Confirmação de que o app.js continua como fonte funcional da verdade

`frontend/app.js` continua controlando:
- abertura da tela;
- UI;
- renderização;
- listagem;
- seleção;
- modal;
- salvar;
- excluir;
- biblioteca;
- preview;
- editor visual;
- iframe;
- `postMessage`/`message`;
- `bindStandardGridActivation`;
- eventos de clique/duplo clique/segundo clique rápido;
- integração com backend.

## 6. Confirmação de passividade do módulo

O módulo continua com:
- `ativo: false`
- `controlaFluxo: false`
- `usaDOM: false`
- `usaFetch: false`
- `usaRequestJson: false`
- `usaEventos: false`
- `usaModal: false`
- `usaEditorVisual: false`
- `usaIframe: false`
- `usaCanvas: false`
- `usaPostMessage: false`
- `moveuLogicaDoApp: false`

Também permanece verdadeiro que:
- o módulo ainda não controla fluxo;
- o módulo ainda não substitui o `app.js`;
- os helpers são auxiliares defensivos;
- o `app.js` tem fallback e não depende obrigatoriamente do módulo externo para funcionar.

## 7. Áreas não tocadas no mini ciclo

Permaneceram fora do escopo:
- modal;
- salvar;
- excluir;
- payload;
- endpoints;
- `requestJson`;
- `fetch`;
- renderização direta;
- seleção direta;
- `bindStandardGridActivation`;
- clique;
- duplo clique;
- segundo clique rápido;
- editor visual;
- iframe;
- canvas;
- `postMessage`/`message`;
- `window.addEventListener("message", ...)`;
- ordenação visual;
- comparação visual de biblioteca;
- ocultação de biblioteca;
- backend;
- banco;
- correção textual/mojibake.

## 8. Riscos principais ainda preservados

Continuam presentes:
- tela preta no editor;
- iframe;
- ponte `postMessage`/`message`;
- `window.addEventListener("message", ...)`;
- rerender de `tbody`;
- `bindStandardGridActivation`;
- duplo clique;
- segundo clique rápido;
- modais/backdrops;
- payload de salvar/excluir;
- consumidores externos;
- biblioteca/preview;
- visibilidade de itens;
- ordenação visual;
- comportamento de exclusão;
- símbolos usados por outros fluxos.

## 9. Checklist obrigatório de teste manual no navegador

1. Fazer `Ctrl+F5`.
2. Abrir o sistema normalmente.
3. Abrir `Cadastro > Símbolos Gráficos`.
4. Confirmar que a tela abre sem erro.
5. Confirmar que a lista carrega.
6. Confirmar que itens de sistema aparecem como antes.
7. Confirmar que itens personalizados aparecem como antes.
8. Confirmar que ícones/imagens aparecem como antes.
9. Confirmar que o item `sim_modelo.bmp`, se existir, continua funcionando como antes.
10. Confirmar que preview continua visualmente igual.
11. Confirmar que biblioteca continua visualmente igual.
12. Confirmar que `Novo` abre o modal.
13. Confirmar que `Alterar` abre o modal correto.
14. Confirmar que `Excluir` funciona como antes, se aplicável.
15. Confirmar que clique simples seleciona como antes.
16. Confirmar que duplo clique funciona como antes, se houver esse comportamento.
17. Confirmar que segundo clique rápido funciona como antes, se houver esse comportamento.
18. Confirmar que o editor visual abre corretamente.
19. Confirmar que o editor visual não abre tela preta.
20. Confirmar que o retorno do editor para o cadastro continua funcionando.
21. Confirmar que preview pós-editor continua funcionando.
22. Confirmar que não há erro no console.
23. Confirmar que nenhum texto visível mudou.
24. Confirmar que não houve alteração visual inesperada em biblioteca/preview.

## 10. Próximos helpers candidatos e decisão conservadora

Helpers ainda candidatos:
- `ocultarItemDaBiblioteca`;
- `compararBibliotecaPorCodigo`;
- `validarTipoMarcaSimbolo`.

Decisão conservadora:
- `ocultarItemDaBiblioteca` pode alterar visibilidade de itens da biblioteca, portanto não deve ser integrado sem teste visual específico;
- `compararBibliotecaPorCodigo` pode alterar ordenação visual, portanto deve ser evitado por enquanto;
- `validarTipoMarcaSimbolo` pode tocar em regra de modal/payload se mal integrado, portanto deve ser evitado por enquanto.

Conclusão:
Não se recomenda nova integração imediatamente sem teste manual completo das Subetapas 4, 5 e 6.

## 11. Recomendação para próxima etapa

Opção A, preferencial:
Encerrar o mini ciclo de Símbolos Gráficos após validação manual, mantendo:
- namespace passivo;
- três helpers integrados com fallback;
- documentação completa;
- sem mover fluxo sensível.

Opção B, somente se todos os testes manuais passarem:
Fazer uma Subetapa 8 documental de recomendação do próximo módulo mais seguro, sem alterar código.

Opção C, somente se houver necessidade real:
Planejar integração futura de `ocultarItemDaBiblioteca`, mas apenas com teste visual específico e sem tocar em editor, modal, eventos ou payload.

## 12. Blindagem textual aplicada

Foi respeitado o documento:

`D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`

Confirma-se que:
- nenhum texto foi corrigido;
- nenhum acento foi corrigido;
- nenhum mojibake foi corrigido;
- nenhuma string visível foi alterada;
- nenhum label, mensagem ou placeholder foi alterado.

## 13. Conclusão

O mini ciclo está tecnicamente consolidado.

Os próximos passos dependem de validação manual no navegador.

Não é recomendado acumular novas integrações antes dos testes.

O módulo Símbolos Gráficos continua com riscos críticos ligados a editor visual, iframe e `postMessage`/`message`.
