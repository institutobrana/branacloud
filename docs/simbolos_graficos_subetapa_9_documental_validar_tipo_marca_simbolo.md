# Símbolos Gráficos — Subetapa 9 — Análise documental do helper validarTipoMarcaSimbolo

## Objetivo

Analisar de forma estreita e conservadora o helper `validarTipoMarcaSimbolo(valor)` para registrar seu contrato real, sua pureza prática e o risco de uma futura integração funcional mínima, sem reabrir editor, modal, preview, biblioteca, `postMessage`, salvar ou excluir.

## Confirmação de que Símbolos Gráficos é módulo parcial retomado, não módulo novo

`Símbolos Gráficos` já é um módulo parcial retomado. Ele possui módulo JS próprio, namespace passivo e documentação anterior extensa. Esta etapa não trata o módulo como novo; ela existe apenas porque a reavaliação rígida encontrou uma justificativa excepcional e estreita para olhar um helper puro específico ainda não tratado por integração funcional.

## Por que esta retomada é excepcional e estreita

A exceção não é "porque já existe módulo JS" nem "porque já existe documentação". A exceção existe porque há um helper puro específico e inédito no recorte funcional atual:

- `validarTipoMarcaSimbolo(valor)`

Esse helper:

- tem entrada e saída pequenas;
- não depende do editor, do modal, do preview ou da biblioteca visual;
- não toca `postMessage`;
- não toca salvar/excluir;
- não toca DOM, cache, estado ou payload;
- permite uma análise objetiva com risco muito menor do que reabrir o bloco sensível do módulo.

## Arquivos inspecionados

- `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md`
- `docs/simbolos_graficos_subetapa_8_documental_helpers_remanescentes.md`
- `docs/simbolos_graficos_retomada_pos_preferencias_estado_atual.md`
- `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md`
- `docs/simbolos_graficos_subetapa_1_namespace_passivo.md`
- `docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md`
- `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md`
- `docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md`
- `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md`
- `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md`
- `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md`
- `docs/simbolos_graficos_subetapa_8_biblioteca_helpers_remanescentes.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/simbolos-graficos.js`

## Checks iniciais

- Branch atual: `modularizacao-segura-fase-1`
- `git status --short` inicial mostrou apenas pendências `??` preexistentes no worktree, sem diffs rastreados novos.
- `git diff --stat` inicial veio vazio.
- `git log --oneline -12` confirmou a linha recente de commits documentais.

## Onde `validarTipoMarcaSimbolo(valor)` está definido

O helper está definido em:

- `frontend/js/modules/simbolos-graficos.js`

## Se está no módulo passivo, em `frontend/app.js`, ou em ambos

Ele está no módulo passivo.

Não foi encontrado em `frontend/app.js` como definição própria, nem como wrapper/fallback local.

## Assinatura atual da função

- `function validarTipoMarcaSimbolo(valor)`

## Lógica atual da função

A lógica observada é simples e determinística:

- converte o valor para string;
- faz `trim()` e `toLowerCase()`;
- se vazio, retorna vazio;
- se for `1` ou `"sistema"`, retorna `"sistema"`;
- se for `2` ou `"usuario"`, retorna `"usuario"`;
- caso contrário, retorna vazio.

## Entradas esperadas

- `valor` bruto vindo do fluxo de tipo/marca.

Pode receber:

- nulo;
- indefinido;
- vazio;
- numérico;
- string;
- qualquer outro valor coerçível para string.

## Saídas retornadas

- string normalizada: `"sistema"`, `"usuario"` ou `""`.

## Tipo de retorno

Retorna string normalizada, não booleano, não objeto.

## Tratamento de nulos, vazios, indefinidos, numéricos ou não-string

- nulo/indefinido: vira string vazia e retorna `""`;
- vazio: retorna `""`;
- numérico `1` ou `2`: retorna o rótulo correspondente;
- outros valores não-string: são convertidos para string antes da comparação;
- qualquer valor fora dos mapeamentos conhecidos retorna `""`.

## Se altera DOM

Não.

## Se altera estado global

Não.

## Se lê ou altera cache global

Não.

## Se chama API/requestJson

Não.

## Se monta payload

Não.

## Se salva dados

Não.

## Se exclui dados

Não.

## Se depende de evento, clique ou duplo clique

Não.

## Se depende de seleção

Não.

## Se depende de renderização

Não.

## Se depende da biblioteca visual

Não.

## Se depende da ordenação da biblioteca

Não.

## Se depende de visibilidade de itens

Não.

## Se depende de editor

Não.

## Se depende de preview

Não.

## Se depende de postMessage

Não.

## Se depende de modal

Não.

## Se altera HTML

Não.

## Se altera SVG

Não.

## Se altera ícones

Não.

## Se altera cores

Não.

## Se altera classes CSS

Não.

## Se altera texto visível

Não.

## Se há risco textual/mojibake

Não há risco textual direto no helper em si, porque ele apenas normaliza um rótulo de tipo interno. O risco textual do módulo continua existindo no bloco maior de `Símbolos Gráficos`, mas não foi observado aqui como efeito do helper.

## Relação com pacientes

Não há relação direta.

## Relação com procedimentos

Não há relação direta no helper. O helper participa do domínio de símbolo gráfico, que pode aparecer no contexto de procedimento, mas ele não mexe com procedimento em si.

## Relação com materiais

Não há relação direta.

## Relação com tabelas, preços, custos, repasses, comissões, reajustes ou financeiro

Não há relação direta.

## Relação com backend/API/banco

Não há relação direta.

## Se frontend/app.js chama diretamente `validarTipoMarcaSimbolo(valor)`

Não foi encontrado consumo direto por nome em `frontend/app.js`.

O uso observável no `app.js` é indireto: o fluxo de símbolos manipula `tipoMarca` no modal e converte a forma textual com helpers locais do próprio bloco, mas não chama o helper passivo por nome.

## Se existe wrapper/fallback no app.js para esse helper

Não.

## Se existe consumo indireto por payload, salvamento, editor ou modal

Sim, existe consumo indireto por fluxo de modal e por construção de payload de símbolos no bloco do `app.js`, porque `tipoMarca` entra na persistência do símbolo. Porém esse consumo é indireto e não envolve o helper passivo por nome.

## Se o helper está exposto em `window.BranaSimbolosGraficosModule`

Sim.

## Caminho real no namespace

- `window.BranaSimbolosGraficosModule.helpers.validarTipoMarcaSimbolo`

## Se há duplicação de lógica entre módulo e app.js

Há duplicação parcial de intenção, não de chamada direta:

- o `app.js` possui lógica local para converter e aplicar `tipoMarca`;
- o módulo passivo possui `validarTipoMarcaSimbolo(valor)` como normalizador explícito.

Não há wrapper atual conectando os dois caminhos.

## Se uma futura integração funcional mínima seria possível sem criar wrapper novo

Sim, é possível documentar ou consumir o helper futuramente sem criar wrapper novo, desde que o futuro uso vá direto ao namespace passivo e preserve o comportamento atual do `app.js`.

## Se uma futura integração funcional mínima exigiria criar wrapper novo

Não necessariamente. Para este helper, uma futura integração mínima pode ser feita sem wrapper novo, porque o helper já está exposto no namespace passivo.

## Se criar wrapper novo seria alteração funcional futura separada

Sim. Se alguém decidir expor esse helper no `app.js` por compatibilidade, isso seria uma alteração funcional futura separada, não parte desta etapa documental.

## Risco de regressão se esse helper for integrado futuramente

Baixo, desde que a integração preserve:

- a mesma normalização;
- o mesmo retorno vazio para valores não reconhecidos;
- o mesmo mapeamento de `1`/`2` e `sistema`/`usuario`;
- a semântica do fluxo de modal existente.

O risco sobe se a integração tentar redesenhar o bloco de símbolos, mexer em biblioteca ou alterar o contrato de `tipo_marca`.

## Classificação de pureza

**puro**

Motivos:

- não usa DOM;
- não usa cache global;
- não altera estado;
- não chama API/requestJson;
- não salva;
- não exclui;
- não depende de eventos, seleção, renderização, biblioteca, modal, editor, preview ou `postMessage`;
- não altera HTML, SVG, ícones, cores, classes CSS ou texto visível;
- não toca pacientes, procedimentos, materiais ou financeiro;
- não toca backend/banco.

## Decisão recomendada

**manter apenas documentado**

O helper já está claro e puro, mas nesta rodada a recomendação mais segura é apenas documentar o contrato e deixar a integração funcional mínima para uma etapa futura separada, se houver.

## Próxima etapa recomendada

Se este helper voltar a ser tocado, a próxima etapa deve ser uma integração funcional mínima separada, com validação de que o contrato atual do `app.js` permanece intacto e sem abrir editor, preview, biblioteca, modal ou `postMessage`.

## Confirmação final

Nesta etapa, nenhum código foi alterado. Não houve mudança em `frontend/app.js`, `frontend/index.html`, `frontend/js/modules/simbolos-graficos.js`, backend, banco, schema, migrations ou endpoints. A blindagem textual/mojibake foi respeitada.
