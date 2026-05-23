# Recomendacao do proximo modulo apos a pausa de Usuarios/Admin

## 1. Objetivo

Registrar, de forma somente documental, qual deve ser o proximo modulo mais seguro para continuar a modularizacao conservadora do frontend do Brana Cloud depois da pausa da trilha de Usuarios/Admin.

## 2. Estado atual apos a pausa de Usuarios/Admin

A trilha de Usuarios/Admin foi pausada de forma deliberada apos a Subetapa 4, porque o proximo candidato sugerido naquele bloco passou a ser `usersRenderAdvanced()`, classificado como risco medio.

Resumo da situacao atual:
- Usuarios/Admin permanece pausado;
- nao ha autorizacao para retomar `usersRenderAdvanced()`;
- login, senha interna, perfis, seed canonico Brana e validacoes de fechamento ja foram corrigidos e documentados em etapas anteriores;
- a modularizacao segura precisa seguir por outro bloco, mais isolado, com risco menor e recorte claro;
- esta etapa e somente documental.

## 3. Confirmacao de que Usuarios/Admin esta pausado

Confirmado. A trilha nao deve ser retomada agora sem nova autorizacao especifica.

## 4. Modulos avaliados

| Modulo | Risco | Justificativa resumida | Decisao |
|---|---|---|---|
| Símbolos Gráficos | Baixo | Existe helper puro especifico e inedito `validarTipoMarcaSimbolo(valor)`, com contrato simples, sem DOM, sem `requestJson`, sem payload e sem salvamento. | **Recomendado** |
| Preferencias e Opcoes do Sistema | Medio/alto | Bloco amplo, com preferencias, opcoes de sistema, payloads e impacto em comportamento de seguranca/controle de usuarios. Ja teve ciclo proprio e foi pausado/reavaliado. | Nao recomendado agora |
| Auxiliares / Tabelas auxiliares | Medio | Fronteira relativamente clara, mas compartilha scaffold com outros modulos e usa modal/DOM compartilhado. | Cautela |
| CID | Medio | Area menor, mas ja foi explorada em ciclo proprio e nao oferece justificativa tao forte quanto o helper puro de Symbols Graphics. | Nao recomendado agora |
| Medicamentos | Medio | CRUD com filtros, combos e fluxo de exclusao; ciclo recente ja foi encerrado. | Nao recomendado agora |
| Prestadores | Medio | CRUD com vinculos a usuarios, agenda e convenios; risco maior que Symbols Graphics. | Nao recomendado agora |
| Convenios e Planos | Medio/alto | Depende de pacientes, prestadores, agenda e fluxo de exclusao segura. | Nao recomendado agora |
| Materiais | Alto | Lista, modais, indices, vinculos e superficie ampla de DOM/API. | Nao recomendado agora |
| Procedimentos Genericos | Alto | Vinculo com materiais, procedimentos e payloads sensiveis. | Nao recomendado agora |
| Intervencoes / Procedimentos | Alto | Materiais, vinculos, custos, preco, repasse e reajuste. | Nao recomendado agora |
| Anamnese | Alto | Fluxo clinico sensivel e historicamente grande. | Nao recomendado agora |
| Etiquetas | Baixo/medio | Ja teve ciclo anterior e nao apresenta justificativa melhor que Symbols Graphics nesta rodada. | Nao recomendado agora |
| Plano de Contas | Baixo/medio | Ciclo ja consolidado e nao e o melhor ponto de retomada nesta rodada. | Nao recomendado agora |

## 5. Por que Símbolos Gráficos é o melhor próximo módulo

`Símbolos Gráficos` é a única exceção realmente defensável entre os módulos já explorados ou avaliados porque ainda existe um helper puro específico e simples, `validarTipoMarcaSimbolo(valor)`, com as seguintes características:

- entrada pequena e previsível;
- saída determinística (`"sistema"`, `"usuario"` ou `""`);
- sem DOM;
- sem estado global;
- sem cache;
- sem `requestJson`;
- sem payload;
- sem salvamento;
- sem exclusão;
- sem banco;
- sem backend;
- sem modais pesados;
- sem fluxo de permissões ou senha interna;
- sem dependência direta de login ou de usuários.

Isso torna o bloco mais seguro do que Preferencias/Opcoes, Auxiliares, Prestadores, Convenios, Materiais, Procedimentos Genericos, Intervencoes/Procedimentos e Anamnese.

## 6. Primeira subetapa recomendada para o módulo escolhido

Primeira subetapa recomendada:
- Subetapa 0 documental e de fronteiras do helper `validarTipoMarcaSimbolo(valor)`;
- sem tocar no editor, modal, biblioteca, preview, `postMessage`, salvar ou excluir;
- sem mover código ainda;
- sem alterar `frontend/app.js` ou `frontend/index.html`;
- sem alterar backend, banco ou seeds.

## 7. O que deve ficar fora da primeira subetapa

Ficam fora:
- abrir o editor de símbolos;
- mexer no modal inteiro;
- mexer em biblioteca, preview ou ordenação;
- mexer em `requestJson`;
- mexer em salvar ou excluir;
- mexer em permissões, senha interna ou usuarios;
- mexer em materiais, procedimentos, anamnese ou financeiro;
- corrigir textos visiveis, acentos ou mojibake.

## 8. O que deve entrar em commit depois desta etapa documental

Se a futura subetapa for executada, o commit deve conter apenas o pacote minimo da trilha escolhida, com:
- o codigo realmente extraido;
- o documento da subetapa;
- sem incluir outros modulos;
- sem misturar com correcoes funcionais sensiveis;
- sem incluir anamnese, SQLServer, restauracao ou arquivos soltos.

## 9. O que deve entrar no roadmap se a nova trilha for iniciada

Se `Símbolos Gráficos` realmente for iniciado, o roadmap deve receber apenas uma linha curta indicando:
- qual helper foi analisado ou extraido;
- que o recorte foi minimo;
- que nao houve impacto em usuarios/admin, login, senha interna, permissões, backend, banco ou seeds.

## 10. Onde testar depois de uma futura alteracao de codigo

Teste manual recomendado depois de uma eventual alteracao:
- abrir o painel de Símbolos Gráficos;
- confirmar o comportamento do helper de tipo/marca;
- abrir o editor ou modal apenas se fizer parte do recorte futuro;
- validar que a biblioteca e o preview continuam funcionais;
- verificar regressão nos combos e no fluxo de procedimentos que consomem símbolos;
- observar o console para garantir ausencia de erros novos.

## 11. Confirmacoes finais

- Nenhum codigo foi alterado nesta etapa.
- Nenhum documento existente foi alterado.
- Nenhum backend foi alterado.
- Nenhum banco foi alterado.
- Nenhum seed foi alterado.
- Nenhum texto visivel foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Esta é apenas uma recomendação documental para orientar a próxima subetapa segura.
