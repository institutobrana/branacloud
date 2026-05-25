# Fase 2 - Agenda de contatos - Subetapa 12 - Plano documental de fronteiras da renderizacao da lista

## 1. Contexto
Esta subetapa continua a frente `Agenda de contatos` apos a validacao manual bem-sucedida da Subetapa 11.

O foco agora e `agendaContatosRender`, porque a funcao permanece no centro da atualizacao visual da lista e depende de varios pontos ja extraidos ou ainda acoplados ao `frontend/app.js`.

O objetivo desta etapa e documentar se existe um recorte seguro dentro da renderizacao da lista ou se o proximo passo precisa ser ainda menor.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_9_implementacao_logica_pura_filtragem.md`
- `docs/fase_2_agenda_contatos_subetapa_10_plano_atualizar_filtro_tipos.md`
- `docs/fase_2_agenda_contatos_subetapa_11_implementacao_opcoes_filtro_tipos.md`
- `docs/fase_2_agenda_contatos_subetapa_4_mapa_apoio_visual_ui.md`
- `docs/fase_2_agenda_contatos_subetapa_6_implementacao_minima_helper_visual.md`
- `docs/fase_2_agenda_contatos_subetapa_6b_correcao_regressao_icone_telefone.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/js/modules/agenda-contatos-listagem.js`

## 3. Confirmacao dos commits anteriores
Commits confirmados:
- `596c1d2fb487401b1dabdb83b5bffe5c674f1418` - `Extrai filtro de agenda contatos`
- `9b7542fb5d2d39a4c7e4ca9ce8a7a4d0a0d718c2` - `Extrai opcoes de filtro de agenda contatos`
- `d78aec0ca64161ac6852b0f6246773c860329acb` - `Corrige icone de telefone em agenda contatos`

## 4. Confirmacao da validacao manual informada pelo usuario
A validacao manual foi informada como bem-sucedida:
- `Agenda de contatos` abre sem erro;
- filtro de tipos aparece normalmente;
- campo Tipo do modal continua com as opcoes corretas;
- filtro por tipo funciona;
- busca por nome funciona;
- tipo + busca por nome funcionam juntos;
- coluna de telefones continua igual;
- selecao de linha continua funcionando;
- modal abre/fecha sem salvar;
- salvar/excluir nao foram alterados;
- `Agenda principal` e `Agenda legado` continuam abrindo;
- nao foi relatado erro de console.

## 5. Diretriz core/comum
`Agenda de contatos` continua tratada como `core / comum`.

Regras mantidas:
- nao implementar multiarea
- nao criar flags multiarea
- nao separar comportamento por area profissional
- nao alterar backend, banco, endpoint ou permissao

## 6. Funcao candidata
Funcao candidata para estudo da fronteira de renderizacao:
- `agendaContatosRender`

## 7. Mapa de chamadas e dependencias
### Onde a funcao esta definida
- `frontend/app.js`, logo apos o fluxo de carregamento de `Agenda de contatos`

### Onde a funcao e chamada
- `agendaContatosCarregar()` chama `agendaContatosRender()`
- `agendaContatos.filtro` dispara `agendaContatosRender` no evento `change`
- `agendaContatos.busca` dispara `agendaContatosRender` no evento `input`

### Fluxo observado
- o carregamento da lista atualiza `agendaContatosCache`
- a selecao em `agendaContatosSelId` e preservada quando possivel
- a renderizacao filtra os itens
- em seguida monta a tabela e atualiza o total exibido

## 8. Entradas implicitas
`agendaContatosRender` usa implicitamente:
- `agendaContatos`
- `agendaContatosCache`
- `agendaContatosSelId`
- `agendaContatosFiltrar()`
- `agendaContatosTelefonesTexto(item)`

## 9. Saidas / efeitos
Efeitos observados:
- escreve a grade/lista em `agendaContatos.tbody.innerHTML`
- escreve o total em `agendaContatos.total.textContent`
- preserva a linha selecionada por classe CSS quando o id bate com `agendaContatosSelId`
- converte a lista filtrada em HTML de linhas

## 10. DOM lido e DOM escrito
### DOM lido
- `agendaContatos.tbody`
- `agendaContatos.total`
- `agendaContatos.filtro`
- `agendaContatos.busca`

### DOM escrito
- `agendaContatos.tbody.innerHTML`
- `agendaContatos.total.textContent`

## 11. Dependencias com cache, selecao, estado, filtros e helper de telefones
### Cache
- `agendaContatosCache` e lido indiretamente via `agendaContatosFiltrar()`

### Selecao
- `agendaContatosSelId` afeta a classe `selected` das linhas

### Estado
- o objeto `agendaContatos` concentra o contexto de tela

### Filtros
- `agendaContatosFiltrar()` continua decidindo quais itens vao para a lista

### Helper de telefones
- `agendaContatosTelefonesTexto(item)` e usado para a terceira coluna da grade

## 12. Confirmacao de inexistencia ou existencia de requestJson, modal, salvar, excluir, payload e eventos
### requestJson
- inexistente dentro de `agendaContatosRender()`

### modal
- inexistente dentro de `agendaContatosRender()`

### salvar
- inexistente dentro de `agendaContatosRender()`

### excluir
- inexistente dentro de `agendaContatosRender()`

### payload
- inexistente dentro de `agendaContatosRender()`

### eventos
- inexistente dentro da funcao em si
- os eventos que disparam a renderizacao estao em `agendaContatosVincularEventos()`

Conclusao:
- a funcao e visual, mas nao e apenas uma transformacao pura;
- a escrita do HTML ainda esta misturada com a coleta do estado de selecao e com a decisao do total exibido.

## 13. Avaliacao se deve extrair funcao inteira ou apenas logica menor
Recomendacao documental:
- nao extrair a funcao inteira de imediato
- o recorte atual ainda e grande para um patch unico
- a fronteira mais segura continua sendo apenas a montagem de HTML de uma linha ou a normalizacao de dados para render

Motivo:
- `agendaContatosRender` mistura:
  - filtragem de itens
  - montagem de HTML de cada linha
  - escrita da grade
  - atualizacao do total
  - preservacao visual da selecao

## 14. Recorte minimo futuro recomendado, se existir
O recorte minimo futuro mais seguro e:
- extrair apenas a montagem de HTML de uma linha da lista

Alternativas ainda possiveis, mas mais amplas:
- extrair a normalizacao de dados para render
- manter a escrita no DOM em `frontend/app.js`

Nao ha recomendacao, nesta etapa, para extrair `agendaContatosRender` inteira.

## 15. Arquivo futuro sugerido
Arquivo futuro sugerido:
- `frontend/js/modules/agenda-contatos-listagem.js`

Motivo:
- o modulo ja concentra a logica de filtragem e opcoes de tipos
- a montagem de linha pertence ao mesmo dominio de listagem da tela
- evita criar outro arquivo apenas para um helper isolado

## 16. Namespace futuro sugerido
Namespace sugerido:
- `window.BranaAgendaContatosListagemModule`

Possiveis helpers futuros:
- `filtrarAgendaContatos`
- `montarOpcoesFiltroTipos`
- `montarLinhaAgendaContatos`

## 17. Plano de wrapper/fallback em frontend/app.js
Plano documental para futura implementacao:
- `frontend/app.js` continua responsavel por:
  - coletar os dados da lista filtrada
  - manter a selecao
  - aplicar o HTML na tabela
  - atualizar o total
- o helper futuro devolveria apenas a representacao de uma linha ou de um conjunto de linhas
- se o namespace nao estiver disponivel, o fallback deve manter a logica atual exatamente como esta hoje

## 18. Funcoes que devem permanecer em frontend/app.js
Devem permanecer em `frontend/app.js`:
- `agendaContatosRender`
- `agendaContatosFiltrar`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosCarregar`
- `agendaContatosAbrir`
- `agendaContatosVincularEventos`
- `agendaContatosSelecionarLinha`
- `agendaContatosTelefonesTexto`
- funcoes de modal, salvar e excluir

## 19. Riscos de regressao
Riscos observados:
- quebrar a preservacao da linha selecionada
- perder a contagem correta do total
- alterar a ordem dos itens renderizados
- quebrar a coluna de telefones
- causar diferenca visual na grade
- introduzir duplicacao entre o fallback de `app.js` e o helper futuro

## 20. Checks tecnicos obrigatorios para futura implementacao
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
- validar lista, filtro, total, selecao e coluna de telefones

## 21. Onde testar no sistema antes de prosseguir apos futura implementacao
Quando houver implementacao real, testar:
1. abrir `Agenda de contatos`
2. confirmar que a lista carrega
3. confirmar que o total exibido continua correto
4. confirmar que a selecao continua visivel
5. confirmar que o filtro por nome e tipo continua funcionando
6. confirmar que a coluna de telefones continua igual
7. confirmar que modal, salvar e excluir continuam sem regressao
8. confirmar console sem `ReferenceError` ou `TypeError`

## 22. Decisao: proxima subetapa pode ou nao ser implementacao minima
Decisao documental desta subetapa:
- ainda nao e o momento mais seguro para uma implementacao minima da renderizacao completa
- o proximo passo mais conservador e continuar a documentar a separacao da montagem de linha ou da normalizacao de dados para render

## 23. Proxima subetapa recomendada
Proxima subetapa recomendada:
- `Agenda de contatos - Subetapa 13 - Plano documental da montagem da linha da lista`

## 24. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, labels, placeholders, strings visiveis ou mojibake.

Qualquer texto estranho observado deve permanecer apenas como pendencia futura, sem correcao nesta etapa.

## 25. Registro para roadmap
- A validacao manual da Subetapa 11 foi registrada como bem-sucedida.
- A Subetapa 12 foi criada documentalmente.
- O plano de fronteiras de renderizacao da lista foi registrado.
- O modulo continua tratado como `core / comum`.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- A proxima subetapa recomendada continua conservadora e documental.

## 26. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:
- `docs/fase_2_agenda_contatos_subetapa_12_plano_fronteiras_renderizacao_lista.md`
- `docs/11_roadmap_desenvolvimento.md`
