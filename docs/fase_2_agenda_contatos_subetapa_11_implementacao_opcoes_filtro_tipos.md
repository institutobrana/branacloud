# Fase 2 - Agenda de contatos - Subetapa 11 - Implementacao minima da geracao pura de opcoes de filtro de tipos

## 1. Contexto
Esta subetapa continua a frente `Agenda de contatos` apos a validacao manual bem-sucedida da Subetapa 9 e o planejamento da Subetapa 10.

O foco agora foi extrair a geracao pura das opcoes de filtro de tipos para um helper separado, mantendo em `frontend/app.js` apenas a escrita no DOM e o fallback conservador.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_9_implementacao_logica_pura_filtragem.md`
- `docs/fase_2_agenda_contatos_subetapa_10_plano_atualizar_filtro_tipos.md`
- `docs/fase_2_agenda_contatos_subetapa_8_plano_logica_pura_filtragem.md`
- `docs/fase_2_agenda_contatos_subetapa_6_implementacao_minima_helper_visual.md`
- `docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/js/modules/agenda-contatos-listagem.js`

## 3. Confirmacao do commit anterior
Commit confirmado:
- `8428bf4b1469ec0ad2b6151aab4c7b56a8cb5d8a` - `Planeja filtro de tipos de agenda contatos`

## 4. Diretriz core/comum
`Agenda de contatos` continua tratada como `core / comum`.

Regras mantidas:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar backend, banco, endpoint ou permissao

## 5. Escopo implementado
Foi implementada somente a geracao pura das opcoes de filtro de tipos.

O recorte permaneceu minimo:
- helper puro novo em `frontend/js/modules/agenda-contatos-listagem.js`
- wrapper conservador mantido em `frontend/app.js`
- nenhum ajuste em `frontend/index.html`

## 6. Arquivo JS alterado
Arquivo alterado:
- `frontend/js/modules/agenda-contatos-listagem.js`

## 7. Confirmacao de que frontend/index.html nao precisou ser alterado
`frontend/index.html` nao precisou ser alterado nesta subetapa porque o modulo de listagem ja estava carregado desde a Subetapa 9.

## 8. Alteracao minima feita em frontend/app.js
`agendaContatosAtualizarFiltroTipos()` passou a tentar usar o helper puro do modulo de listagem.

Se o helper nao estiver disponivel, a funcao preserva o fallback atual:
- monta as opcoes a partir de `agendaContatosTiposCache`
- preserva o HTML dos selects
- continua escrevendo em `agendaContatos.filtro` e `agendaContatos.tipo`

## 9. Contrato preservado de agendaContatosAtualizarFiltroTipos
Contrato atual preservado:
- nao recebe parametros
- depende de `agendaContatos`
- depende de `agendaContatosTiposCache`
- escreve o HTML nos controles da UI
- preserva o fallback atual quando o helper novo nao estiver carregado

## 10. Contrato do helper montarOpcoesFiltroTipos
Contrato do helper extraido:
- assinatura: `montarOpcoesFiltroTipos(listaTipos)`
- entrada: lista de tipos ja normalizada ou uma lista potencialmente vazia/nula
- saida: string HTML com as opcoes de tipos
- preserva exatamente o fallback atual quando a lista estiver vazia
- preserva valores e textos das opcoes
- nao amplia nem altera as opcoes

## 11. Confirmacao de que os textos/valores das opcoes foram preservados
As opcoes preservadas continuam sendo:
- `Cirurgião`
- `Protético`
- `Fornecedor`
- `Outros`

Os textos e valores das opcoes permanecem sem ampliacao funcional.

## 12. Dependencias que continuam inexistentes dentro do helper
Dentro do helper puro nao existem dependencias de:
- DOM
- requestJson
- cache global
- estado global
- modal
- eventos
- selecao

## 13. Funcoes expressamente nao alteradas
Nao foram alteradas:
- `agendaContatosFiltrar`
- `agendaContatosRender`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosCarregar`
- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- helper de telefones ja extraido

## 14. Checks tecnicos executados
Checks executados nesta subetapa:
- `git status --short`
- `git log --oneline -10`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/agenda-contatos-listagem.js`
- `git diff -- frontend/js/modules/agenda-contatos-telefones.js`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git diff -- docs/fase_2_agenda_contatos_subetapa_11_implementacao_opcoes_filtro_tipos.md`
- `node --check frontend/js/modules/agenda-contatos-listagem.js`
- `node --check frontend/js/modules/agenda-contatos-telefones.js`
- `node --check frontend/app.js`

## 15. Onde testar no sistema antes de prosseguir
Teste manual antes de seguir:
1. Abrir o sistema no navegador.
2. Entrar em `Agenda de contatos`.
3. Confirmar que a tela abre sem erro.
4. Conferir se o filtro de tipos aparece normalmente.
5. Conferir se o campo tipo do modal continua com as opcoes corretas.
6. Testar filtro por tipo.
7. Testar busca por nome.
8. Testar tipo + busca por nome juntos.
9. Abrir e fechar modal sem salvar.
10. Confirmar que salvar/excluir nao foram alterados.
11. Confirmar que a coluna de telefones continua igual.
12. Confirmar que a selecao de linha continua funcionando.
13. Confirmar que `Agenda principal` e `Agenda legado` continuam abrindo.
14. Confirmar console do navegador sem `ReferenceError` ou `TypeError`.

## 16. Resultado esperado do teste manual
Resultado esperado:
- os selects de tipos continuam exibindo exatamente as opcoes conhecidas
- o modal continua funcionando sem regressao visual ou funcional
- a lista continua filtrando por tipo e por nome como antes
- nao surgem erros de console

## 17. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, labels, placeholders, strings visiveis ou mojibake.

Qualquer texto estranho observado deve permanecer apenas como pendencia futura, sem correcao nesta etapa.

## 18. Registro para roadmap
- A Subetapa 11 foi implementada documentalmente e tecnicamente com a extracao minima da geracao pura de opcoes de filtro de tipos.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- `frontend/index.html` nao precisou ser alterado.
- O proximo teste manual continua obrigatorio antes de prosseguir.

## 19. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:
- `frontend/js/modules/agenda-contatos-listagem.js`
- `frontend/app.js`
- `docs/fase_2_agenda_contatos_subetapa_11_implementacao_opcoes_filtro_tipos.md`
- `docs/11_roadmap_desenvolvimento.md`
