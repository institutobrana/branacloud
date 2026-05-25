# Fase 2 - Agenda de contatos - Subetapa 9 - Implementacao minima da logica pura de filtragem

## 1. Contexto
Esta subetapa executa a implementacao minima da logica pura de filtragem de `Agenda de contatos`, mantendo o recorte conservador planejado nas etapas documentais anteriores.

O foco desta etapa e separar a logica pura `filtrarAgendaContatos` da coleta de contexto da UI, preservando o comportamento atual da busca e do filtro por tipo.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_7_plano_segundo_recorte_filtrar.md`
- `docs/fase_2_agenda_contatos_subetapa_8_plano_logica_pura_filtragem.md`
- `docs/fase_2_agenda_contatos_subetapa_6_implementacao_minima_helper_visual.md`
- `docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-contatos-telefones.js`

## 3. Confirmacao do commit anterior
Commit anterior confirmado:
- `f7b8129782eb4aa68869f50ebf96c82811797d04` - `Planeja logica pura de filtro de agenda contatos`

## 4. Diretriz core/comum
`Agenda de contatos` continua tratada como `core / comum`.

Regras mantidas:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar backend, banco, endpoint ou permissao

## 5. Escopo implementado
Nesta subetapa foi feita a extracao minima de:
- helper puro `filtrarAgendaContatos`
- wrapper conservador `agendaContatosFiltrar` em `frontend/app.js`
- inclusao do novo script em `frontend/index.html`

O fluxo visual maior de `Agenda de contatos` nao foi alterado.

## 6. Arquivo JS criado
Arquivo criado:
- `frontend/js/modules/agenda-contatos-listagem.js`

Namespace exposto:
- `window.BranaAgendaContatosListagemModule`

Helper exposto:
- `filtrarAgendaContatos`

## 7. Alteracao feita em `frontend/index.html`
Foi adicionada a inclusao do novo modulo de listagem antes de `frontend/app.js`, mantendo a ordem conservadora dos scripts.

Ordem preservada:
- `agenda-contatos-telefones.js`
- `agenda-contatos-listagem.js`
- `app.js`

## 8. Alteracao minima feita em `frontend/app.js`
A funcao `agendaContatosFiltrar` foi mantida como wrapper conservador.

Ela agora:
- coleta o filtro de tipo a partir de `agendaContatos?.filtro?.value`;
- coleta o termo de busca a partir de `agendaContatos?.busca?.value`;
- usa `agendaContatosCache`;
- chama o helper novo se o modulo estiver carregado;
- preserva fallback com a logica atual caso o modulo nao esteja disponivel.

Nenhuma outra funcao foi alterada.

## 9. Contrato preservado de `agendaContatosFiltrar`
Contrato atual preservado:
- continua sendo chamada por `agendaContatosRender`
- continua retornando a lista filtrada
- continua filtrando por tipo e por texto do nome
- continua sem ampliar a busca para outros campos

## 10. Contrato do helper `filtrarAgendaContatos`
### Entrada
- `lista`
- `filtroTipo`
- `termoBusca`

### Saida
- novo array filtrado

### Regras preservadas
- lista invalida ou nula vira array vazio
- `filtroTipo` nulo ou indefinido vira string vazia
- `termoBusca` nulo ou indefinido vira string vazia
- o filtro por tipo continua comparando com `item.tipo`
- a busca continua comparando apenas com `item.nome`
- o helper nao altera os objetos originais
- o helper nao toca DOM, cache, selecao, modal, eventos, salvar, excluir ou payload

## 11. Confirmacao de que a busca continua restrita a `item.nome`
A busca permanece restrita a `item.nome`.

Ela nao foi ampliada para telefone, cidade, tipo, observacao ou qualquer outro campo.

## 12. Dependencias que continuam inexistentes
Dentro do helper puro:
- DOM
- requestJson
- cache global
- estado global
- modal
- eventos
- selecao

## 13. Funcoes expressamente nao alteradas
Nao foram alteradas:
- `agendaContatosRender`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosCarregar`
- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`
- o helper de telefones ja extraido
- qualquer rota, endpoint, model, service, banco, schema, migration ou seed

## 14. Checks tecnicos executados
- `git status --short`
- `git log --oneline -10`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/agenda-contatos-listagem.js`
- `git diff -- frontend/js/modules/agenda-contatos-telefones.js`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git diff -- docs/fase_2_agenda_contatos_subetapa_9_implementacao_logica_pura_filtragem.md`
- `node --check frontend/js/modules/agenda-contatos-listagem.js`
- `node --check frontend/js/modules/agenda-contatos-telefones.js`
- `node --check frontend/app.js`

## 15. Onde testar no sistema antes de prosseguir
O usuario deve testar:
1. Abrir o sistema no navegador.
2. Entrar em `Agenda de contatos`.
3. Confirmar que a tela abre sem erro.
4. Conferir se a grade/lista de contatos aparece normalmente.
5. Testar filtro por texto usando nome de contato existente.
6. Testar filtro por texto com termo inexistente.
7. Testar busca vazia.
8. Testar filtro por tipo, se houver dados.
9. Testar combinacao de filtro por tipo + busca por nome.
10. Confirmar que a busca nao passou a filtrar por telefone, cidade ou outros campos.
11. Confirmar que a coluna de telefones continua igual.
12. Clicar em uma linha e confirmar que a selecao continua funcionando.
13. Abrir e fechar modal de contato sem salvar.
14. Confirmar que salvar/excluir nao foram alterados.
15. Confirmar que Agenda principal e Agenda legado continuam abrindo.
16. Confirmar console do navegador sem `ReferenceError` ou `TypeError`.

## 16. Resultado esperado do teste manual
- a listagem deve continuar igual em comportamento
- o filtro por tipo deve continuar funcionando
- a busca deve continuar restrita ao nome
- a coluna de telefones deve continuar igual
- a selecao de linha deve continuar funcionando
- modal, salvar e excluir devem continuar sem regressao

## 17. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, labels, placeholders, strings visiveis ou mojibake.

Qualquer texto estranho observado deve permanecer apenas como pendencia futura, sem correcao nesta etapa.

## 18. Registro para roadmap
- Subetapa 9 de `Agenda de contatos` implementada
- logica pura de filtragem extraida
- modulo tratado como `core / comum`
- nenhum backend, banco, endpoint ou permissao foi alterado
- proximo teste manual obrigatorio antes de prosseguir
- proxima subetapa recomendada somente apos validacao manual

## 19. Commit seletivo obrigatorio
Se e somente se a etapa ficar restrita aos arquivos permitidos:
- usar apenas `git add frontend/js/modules/agenda-contatos-listagem.js`
- usar apenas `git add frontend/index.html`
- usar apenas `git add frontend/app.js`
- usar apenas `git add docs/fase_2_agenda_contatos_subetapa_9_implementacao_logica_pura_filtragem.md`
- se alterado, usar apenas `git add docs/11_roadmap_desenvolvimento.md`
- depois executar `git commit -m "Extrai filtro de agenda contatos"`
- em seguida executar `git push`

