# Fase 2 - Agenda de contatos - Subetapa 13 - Plano documental da montagem da linha da lista

## 1. Contexto
Esta subetapa continua a frente `Agenda de contatos` apos a validacao manual bem-sucedida da Subetapa 12.

O foco agora e a montagem da linha individual da lista dentro de `agendaContatosRender`, porque essa parte ainda concentra a representacao visual de cada contato e pode ser o proximo recorte seguro, desde que a escrita no DOM continue em `frontend/app.js`.

O objetivo desta etapa e documentar se a montagem de uma linha pode virar helper puro futuro ou se o recorte precisa ser menor.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_12_plano_fronteiras_renderizacao_lista.md`
- `docs/fase_2_agenda_contatos_subetapa_11_implementacao_opcoes_filtro_tipos.md`
- `docs/fase_2_agenda_contatos_subetapa_10_plano_atualizar_filtro_tipos.md`
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
- `3b1aca50f1f48a0afad6c783e1bec7e5188b3b1f` - `Planeja renderizacao de agenda contatos`

## 4. Diretriz core/comum
`Agenda de contatos` continua tratada como `core / comum`.

Regras mantidas:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar backend, banco, endpoint ou permissao

## 5. Funcao/trecho candidato
Trecho candidato para estudo:
- montagem da linha dentro de `agendaContatosRender`

## 6. Mapa dos campos usados na linha
Na linha atual, o HTML usa:
- `item.id`
- `item.nome`
- `item.tipo`
- telefones formatados por `agendaContatosTelefonesTexto(item)`

Tambem depende da selecao visual atual:
- `agendaContatosSelId`

## 7. Dependencias com selecao, DOM, cache e helpers ja extraidos
### Selecao
- `agendaContatosSelId` define se a linha recebe a classe `selected`

### DOM
- a linha e convertida em HTML de `tr` e `td`
- a escrita final continua em `agendaContatos.tbody.innerHTML`

### Cache
- os itens da lista vem de `agendaContatosCache` apos o filtro

### Helpers ja extraidos
- `agendaContatosTelefonesTexto(item)` e usado para a coluna de telefones
- `agendaContatosFiltrar()` e usado antes da renderizacao, para escolher os itens exibidos

## 8. Separacao entre logica pura e efeitos de DOM
### Logica pura
- selecionar os campos do item
- definir o atributo `data-id`
- montar o HTML da linha
- aplicar a classe `selected` conforme o id atual
- inserir a coluna de telefones ja formatada

### Efeitos de DOM
- escrever o HTML final em `tbody.innerHTML`
- atualizar o total em `total.textContent`

Conclusao:
- a montagem da linha tem uma parte pura clara;
- a escrita final da tabela e a atualizacao do total devem continuar em `frontend/app.js`.

## 9. Contrato futuro recomendado
Contrato ideal para helper futuro:
- entrada: `item` e `selectedId`
- opcionalmente, um texto de telefones ja formatado ou um helper de telefones injetado
- saida: string HTML de uma linha da lista

### Recomendacao documental
O helper futuro deve ser capaz de:
- receber o `item` de contato
- decidir a classe `selected` com base em `selectedId`
- usar o helper de telefones ou receber os telefones ja formatados

### Saida esperada
- string HTML completa da linha

Esse contrato evita misturar:
- montagem da linha
- escrita do `tbody`
- contagem do total

## 10. Arquivo futuro sugerido
Arquivo futuro sugerido:
- `frontend/js/modules/agenda-contatos-listagem.js`

Motivo:
- o modulo ja abriga a logica de filtragem e as opcoes de tipos
- a montagem de linha pertence ao mesmo dominio de listagem
- evita criar um novo arquivo para um helper que ainda e parte direta da visualizacao da lista

## 11. Namespace futuro sugerido
Namespace sugerido:
- `window.BranaAgendaContatosListagemModule`

Possiveis helpers futuros:
- `filtrarAgendaContatos`
- `montarOpcoesFiltroTipos`
- `montarLinhaAgendaContatos`

## 12. Nome do helper futuro
Nome sugerido para o helper:
- `montarLinhaAgendaContatos`

Nome alternativo ainda aceitavel:
- `renderizarLinhaAgendaContatos`

## 13. Plano de wrapper/fallback em frontend/app.js
Plano documental para futura implementacao:
- `frontend/app.js` continua:
  - chamando `agendaContatosFiltrar()`
  - mantendo a selecao por `agendaContatosSelId`
  - escrevendo `tbody.innerHTML`
  - atualizando `total.textContent`
- o helper futuro devolve apenas a string HTML da linha
- se o namespace nao estiver disponivel, o fallback deve manter a logica atual exatamente como esta hoje

Estrutura conceitual:
- helper puro: `montarLinhaAgendaContatos(item, selectedId, telefonesTexto)`
- wrapper em `app.js`: `agendaContatosRender()`

## 14. Funcoes/efeitos que devem permanecer em frontend/app.js
Devem permanecer em `frontend/app.js`:
- `agendaContatosRender`
- `agendaContatosFiltrar`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosCarregar`
- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- `agendaContatosSelecionarLinha`
- `agendaContatosTelefonesTexto`
- escrita de `tbody.innerHTML`
- escrita de `total.textContent`

## 15. Riscos de regressao
Riscos observados:
- quebrar a classe `selected`
- alterar a ordem das colunas
- perder a coluna de telefones
- alterar o `data-id` usado pela selecao
- introduzir diferenca visual entre linhas normais e selecionadas
- duplicar logica entre o fallback e o helper futuro

## 16. Checks tecnicos obrigatorios para futura implementacao
Se houver implementacao futura, os checks minimos devem incluir:
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git status --short`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-contatos-listagem.js`
- `node --check frontend/js/modules/agenda-contatos-telefones.js`
- abrir `Agenda de contatos`
- validar lista, coluna de telefones, selecao de linha e total

## 17. Onde testar no sistema apos futura implementacao
Quando houver implementacao real, testar:
1. abrir `Agenda de contatos`
2. confirmar que a lista carrega
3. confirmar que a linha renderizada continua exibindo nome, tipo e telefones
4. confirmar que a classe `selected` continua correta
5. confirmar que a selecao de linha continua funcionando
6. confirmar que o total continua correto
7. confirmar que modal, salvar e excluir continuam sem regressao
8. confirmar console sem `ReferenceError` ou `TypeError`

## 18. Decisao: proxima subetapa pode ou nao ser implementacao minima
Decisao documental desta subetapa:
- sim, a proxima subetapa pode ser uma implementacao minima
- o recorte seguro e a extracao da montagem de HTML da linha
- a escrita no `tbody` e a atualizacao do total devem continuar em `frontend/app.js`

## 19. Proxima subetapa recomendada
Proxima subetapa recomendada:
- `Agenda de contatos - Subetapa 14 - Implementacao minima da montagem pura da linha da lista`

## 20. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, labels, placeholders, strings visiveis ou mojibake.

Qualquer texto estranho observado deve permanecer apenas como pendencia futura, sem correcao nesta etapa.

## 21. Registro para roadmap
- A Subetapa 13 foi criada documentalmente.
- O plano de montagem da linha da lista foi registrado.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- Nenhuma alteracao de codigo foi feita.
- A proxima subetapa recomendada e `Agenda de contatos - Subetapa 14 - Implementacao minima da montagem pura da linha da lista`.

## 22. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:
- `docs/fase_2_agenda_contatos_subetapa_13_plano_montagem_linha_lista.md`
- `docs/11_roadmap_desenvolvimento.md`

