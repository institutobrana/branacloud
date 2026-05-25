# Fase 2 - Agenda de contatos - Subetapa 14 - Implementacao minima da montagem pura da linha da lista

## 1. Contexto
Esta subetapa continua a frente `Agenda de contatos` apos a validacao manual bem-sucedida da Subetapa 12 e o planejamento da Subetapa 13.

O foco agora foi extrair a montagem pura da linha individual da lista, mantendo em `frontend/app.js` a orquestracao da renderizacao, a escrita no `tbody` e a atualizacao do total.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_13_plano_montagem_linha_lista.md`
- `docs/fase_2_agenda_contatos_subetapa_12_plano_fronteiras_renderizacao_lista.md`
- `docs/fase_2_agenda_contatos_subetapa_11_implementacao_opcoes_filtro_tipos.md`
- `docs/fase_2_agenda_contatos_subetapa_9_implementacao_logica_pura_filtragem.md`
- `docs/fase_2_agenda_contatos_subetapa_6_implementacao_minima_helper_visual.md`
- `docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/js/modules/agenda-contatos-listagem.js`

## 3. Confirmacao do commit anterior
Commit confirmado:
- `1e9a7c0a78ab0a93e0c58aaa247d5d97b3c1e15e` - `Planeja montagem de linha de agenda contatos`

## 4. Diretriz core/comum
`Agenda de contatos` continua tratada como `core / comum`.

Regras mantidas:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar backend, banco, endpoint ou permissao

## 5. Escopo implementado
Foi implementada somente a montagem pura da linha da lista.

O recorte permaneceu minimo:
- helper puro novo em `frontend/js/modules/agenda-contatos-listagem.js`
- wrapper conservador mantido em `frontend/app.js`
- nenhum ajuste em `frontend/index.html`

## 6. Arquivo JS alterado
Arquivo alterado:
- `frontend/js/modules/agenda-contatos-listagem.js`

## 7. Confirmacao de que frontend/index.html nao foi alterado
`frontend/index.html` nao foi alterado nesta subetapa porque o modulo de listagem ja estava carregado desde a Subetapa 9.

## 8. Alteracao minima feita em frontend/app.js
`agendaContatosRender()` passou a tentar usar o helper puro de montagem da linha.

Se o helper nao estiver disponivel, a funcao preserva o fallback atual de montagem da linha.

`agendaContatosRender()` continua sendo a orquestradora da lista:
- chama `agendaContatosFiltrar()`
- calcula o total
- escreve `agendaContatos.tbody.innerHTML`
- escreve `agendaContatos.total.textContent`

## 9. Contrato preservado de `agendaContatosRender`
Contrato atual preservado:
- continua sendo chamada por `agendaContatosCarregar`
- continua sendo acionada por `change` no filtro e `input` na busca
- continua filtrando a lista antes de renderizar
- continua atualizando a tabela e o total
- continua preservando a selecao visual

## 10. Contrato do helper `montarLinhaAgendaContatos`
### Entrada
- `item`
- `selectedId`
- `telefonesTexto`

### Saida
- string HTML da linha

### Regras preservadas
- preserva `data-id`
- preserva a classe `selected` quando `item.id` corresponde a `selectedId`
- preserva a ordem das colunas
- preserva nome, tipo e telefones exatamente como hoje
- nao escreve DOM
- nao usa `requestJson`
- nao le nem escreve cache global
- nao depende de `agendaContatos`
- nao depende de `this`
- nao mexe em modal, eventos ou selecao direta

## 11. Confirmacao de que `data-id`, classe `selected`, nome, tipo e telefones foram preservados
A linha continua preservando:
- `data-id`
- classe `selected`
- nome
- tipo
- telefones

## 12. Dependencias que continuam inexistentes dentro do helper
Dentro do helper puro:
- DOM
- requestJson
- cache global
- estado global
- modal
- eventos
- selecao direta

## 13. Funcoes expressamente nao alteradas
Nao foram alteradas:
- `agendaContatosFiltrar`
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
- `git diff -- docs/fase_2_agenda_contatos_subetapa_14_implementacao_montagem_linha_lista.md`
- `node --check frontend/js/modules/agenda-contatos-listagem.js`
- `node --check frontend/js/modules/agenda-contatos-telefones.js`
- `node --check frontend/app.js`

## 15. Onde testar no sistema antes de prosseguir
O usuario deve testar:
1. Abrir o sistema no navegador.
2. Entrar em `Agenda de contatos`.
3. Confirmar que a tela abre sem erro.
4. Conferir se a grade/lista aparece normalmente.
5. Conferir ordem das colunas.
6. Conferir nome, tipo e telefones.
7. Conferir se a coluna de telefones continua igual.
8. Clicar em uma linha e confirmar que a selecao visual continua funcionando.
9. Trocar filtro por tipo e confirmar que a selecao nao quebra.
10. Buscar por nome e confirmar que a lista continua correta.
11. Testar busca vazia.
12. Abrir e fechar modal sem salvar.
13. Confirmar que salvar/excluir nao foram alterados.
14. Confirmar que `Agenda principal` e `Agenda legado` continuam abrindo.
15. Confirmar console do navegador sem `ReferenceError` ou `TypeError`.

## 16. Resultado esperado do teste manual
- a lista continua com a mesma aparencia e ordem
- a classe `selected` continua funcionando
- a coluna de telefones continua igual
- o total exibido continua correto
- modal, salvar e excluir continuam sem regressao

## 17. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, labels, placeholders, strings visiveis ou mojibake.

Qualquer texto estranho observado deve permanecer apenas como pendencia futura, sem correcao nesta etapa.

## 18. Registro para roadmap
- A Subetapa 14 foi implementada documentalmente e tecnicamente com a extracao minima da montagem pura da linha da lista.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- `frontend/index.html` nao foi alterado.
- O proximo teste manual continua obrigatorio antes de prosseguir.

## 19. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:
- `frontend/js/modules/agenda-contatos-listagem.js`
- `frontend/app.js`
- `docs/fase_2_agenda_contatos_subetapa_14_implementacao_montagem_linha_lista.md`
- `docs/11_roadmap_desenvolvimento.md`
